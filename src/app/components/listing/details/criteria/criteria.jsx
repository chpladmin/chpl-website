import React, { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
import { bool, func } from 'prop-types';

import ChplCriterion from './criterion';

import { ChplTooltip } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { ListingContext, UserContext } from 'shared/contexts';
import {
  listing as listingPropType,
  resources as resourceDefinition,
} from 'shared/prop-types';

const useStyles = makeStyles({
  infoIconColor: {
    color: '#156dac',
    marginLeft: '4px',
    marginTop: '4px',
  },
  NestedAccordionLevelOne: {
    borderRadius: '4px',
    display: 'grid',
    borderColor: ' #c2c6ca',
    borderWidth: '.5px',
    borderStyle: 'solid',
  },
  NestedAccordionLevelOneSummary: {
    backgroundColor: '#efefef !important',
    borderRadius: '4px',
    borderBottom: '.5px solid #c2c6ca',
  },
});

function ChplCriteria(props) {
  const {
    hasIcs,
    isConfirming,
    isEditing,
    listing,
    resources,
    onSave,
    viewAll,
  } = props;
  const { setListing } = useContext(ListingContext);
  const { hasAnyRole } = useContext(UserContext);
  const [criteria, setCriteria] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setCriteria(listing.certificationResults
      .sort((a, b) => sortCriteria(a.criterion, b.criterion)));
    setListing(listing);
  }, [listing]);

  const handleSave = (criterion) => {
    const updated = criteria.filter((cc) => cc.criterion.id !== criterion.criterion.id);
    updated.push(criterion);
    setCriteria(updated.sort((a, b) => sortCriteria(a.criterion, b.criterion)));
    onSave(updated);
  };

  const prepareResources = (criterion) => {
    const updated = {
      ...resources,
      testData: { ...resources.testData, data: resources.testData?.data.filter((item) => item.criteria.id === criterion.id) },
      testProcedures: { ...resources.testProcedures, data: resources.testProcedures?.data.filter((item) => item.criteria.id === criterion.id) },
      testStandards: { ...resources.testStandards, data: resources.testStandards?.data.filter((item) => item.year === criterion.certificationEdition) },
    };
    return updated;
  };

  if (criteria.length === 0) { return null; }

  return (
    <>
      { criteria.filter((cc) => !cc.criterion.removed && (cc.success || viewAll))
        .map((cc) => (
          <ChplCriterion
            key={cc.criterion.id}
            certificationResult={cc}
            hasIcs={hasIcs}
            isConfirming={isConfirming}
            isEditing={isEditing}
            onSave={handleSave}
            resources={prepareResources(cc.criterion)}
          />
        ))}
      { (criteria.filter((cc) => cc.criterion.removed && (cc.success || viewAll)).length > 0)
        && (
          <div>
            <Accordion
              className={classes.NestedAccordionLevelOne}
            >
              <AccordionSummary
                className={classes.NestedAccordionLevelOneSummary}
                expandIcon={<ExpandMoreIcon color="primary" fontSize="large" />}
                id="removed-header"
              >
                Removed Certification Criteria
                <ChplTooltip title="These certification criteria have been removed from the Program.">
                  <InfoIcon className={classes.infoIconColor} fontSize="medium" />
                </ChplTooltip>
              </AccordionSummary>
              <AccordionDetails>
                <Container>
                  { criteria.filter((cc) => cc.criterion.removed && (cc.success || viewAll))
                    .map((cc) => (
                      <ChplCriterion
                        key={cc.criterion.id}
                        certificationResult={cc}
                        isEditing={isEditing && !isConfirming && (cc.success || hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']))}
                        onSave={handleSave}
                        resources={prepareResources(cc.criterion)}
                      />
                    ))}
                </Container>
              </AccordionDetails>
            </Accordion>
          </div>
        )}
    </>
  );
}

export default ChplCriteria;

ChplCriteria.propTypes = {
  hasIcs: bool,
  isConfirming: bool,
  isEditing: bool,
  listing: listingPropType.isRequired,
  onSave: func,
  resources: resourceDefinition,
  viewAll: bool,
};

ChplCriteria.defaultProps = {
  hasIcs: false,
  isConfirming: false,
  isEditing: false,
  onSave: () => {},
  resources: {},
  viewAll: false,
};
