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

import { useFetchCriteria } from 'api/standards';
import { ChplTooltip } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { jsJoda } from 'services/date-util';
import { UserContext } from 'shared/contexts';
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
    canEdit,
    hasIcs,
    isConfirming,
    listing,
    resources,
    onSave,
    viewAll,
  } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [allCriteria, setAllCriteria] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const { data, isLoading, isSuccess } = useFetchCriteria({
    activeStartDay: listing.certificationDay,
    activeEndDay: jsJoda.LocalDate.now(),
    certificationEdition: listing.certificationEdition.name,
  });
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setAllCriteria(data.map((c) => ({
      success: false,
      criterion: c,
    })));
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    setCriteria(Array.from([...allCriteria, ...listing.certificationResults]
      .reduce((m, cr) => m.set(cr.criterion.id, cr), new Map())
      .values())
      .sort((a, b) => sortCriteria(a.criterion, b.criterion)));
  }, [allCriteria, listing]);

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
            canEdit={canEdit}
            hasIcs={hasIcs}
            isConfirming={isConfirming}
            listing={listing}
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
                        canEdit={canEdit && !isConfirming && (cc.success || hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']))}
                        onSave={handleSave}
                        resources={prepareResources(cc.criterion)}
                        listing={listing}
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
  canEdit: bool,
  hasIcs: bool,
  isConfirming: bool,
  listing: listingPropType.isRequired,
  onSave: func,
  resources: resourceDefinition,
  viewAll: bool,
};

ChplCriteria.defaultProps = {
  canEdit: false,
  hasIcs: false,
  isConfirming: false,
  onSave: () => {},
  resources: {},
  viewAll: false,
};
