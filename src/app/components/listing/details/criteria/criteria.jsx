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
import {
  arrayOf,
  bool,
  func,
} from 'prop-types';

import ChplCriterion from './criterion';

import { ChplTooltip } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { UserContext } from 'shared/contexts';
import {
  accessibilityStandard,
  certificationResult,
  resources as resourceDefinition,
  qmsStandard,
} from 'shared/prop-types';

const useStyles = makeStyles({
  NestedAccordionLevelOne: {
    borderRadius: '8px',
    display: 'grid',
  },
  NestedAccordionLevelOneSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
});

function ChplCriteria(props) {
  const { hasIcs, isConfirming } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [criteria, setCriteria] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setCriteria(props.certificationResults
      .sort((a, b) => sortCriteria(a.criterion, b.criterion)));
  }, [props.certificationResults]); // eslint-disable-line react/destructuring-assignment

  const handleSave = (criterion) => {
    const updated = criteria.filter((cc) => cc.criterion.id !== criterion.criterion.id);
    updated.push(criterion);
    setCriteria(updated);
    props.onSave(updated);
  };

  const prepareResources = (resources, criterion) => {
    const updated = {
      ...resources,
      testData: { ...resources.testData, data: resources.testData?.data.filter((item) => item.criteria.id === criterion.id) },
      testProcedures: { ...resources.testProcedures, data: resources.testProcedures?.data.filter((item) => item.criteria.id === criterion.id) },
      testStandards: { ...resources.testStandards, data: resources.testStandards?.data.filter((item) => item.year === criterion.certificationEdition) },
    };
    return updated;
  };

  return (
    <>
      { criteria.filter((cc) => !cc.criterion.removed && (cc.success || props.viewAll))
        .map((cc) => (
          <ChplCriterion
            key={cc.criterion.id}
            certificationResult={cc}
            canEdit={props.canEdit}
            hasIcs={hasIcs}
            isConfirming={isConfirming}
            onSave={handleSave}
            resources={prepareResources(props.resources, cc.criterion)}
            accessibilityStandards={props.accessibilityStandards}
            qmsStandards={props.qmsStandards}
          />
        ))}
      { (criteria.filter((cc) => cc.criterion.removed && (cc.success || props.viewAll)).length > 0)
        && (
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
                <InfoIcon fontSize="large" />
              </ChplTooltip>
            </AccordionSummary>
            <AccordionDetails>
              <Container>
                { criteria.filter((cc) => cc.criterion.removed && (cc.success || props.viewAll))
                  .map((cc) => (
                    <ChplCriterion
                      key={cc.criterion.id}
                      certificationResult={cc}
                      canEdit={props.canEdit && !isConfirming && (cc.success || hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']))}
                      onSave={handleSave}
                      resources={prepareResources(props.resources, cc.criterion)}
                      accessibilityStandards={props.accessibilityStandards}
                      qmsStandards={props.qmsStandards}
                    />
                  ))}
              </Container>
            </AccordionDetails>
          </Accordion>
        )}
    </>
  );
}

export default ChplCriteria;

ChplCriteria.propTypes = {
  certificationResults: arrayOf(certificationResult).isRequired,
  accessibilityStandards: arrayOf(accessibilityStandard),
  canEdit: bool,
  isConfirming: bool,
  hasIcs: bool,
  onSave: func,
  qmsStandards: arrayOf(qmsStandard),
  resources: resourceDefinition,
  viewAll: bool,
};

ChplCriteria.defaultProps = {
  accessibilityStandards: [],
  canEdit: false,
  isConfirming: false,
  hasIcs: false,
  onSave: () => {},
  qmsStandards: [],
  resources: {},
  viewAll: false,
};
