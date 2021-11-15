import React, { useState } from 'react';
import {
  arrayOf,
  bool,
  func,
} from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../../themes/theme';
import { ChplTooltip } from '../../../util';
import { getAngularService, ChplCriterion } from '.'; // eslint-disable-line import/no-cycle
import {
  accessibilityStandard,
  certificationResult,
  resources as resourceDefinition,
  qmsStandard,
} from '../../../../shared/prop-types';
import { FlagContext } from '../../../../shared/contexts';

const useStyles = makeStyles(() => ({
  NestedAccordionLevelOne: {
    borderRadius: '8px',
    display: 'grid',
  },
  NestedAccordionLevelOneSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
}));

function ChplCriteria(props) {
  /* eslint-disable react/destructuring-assignment */
  const sortCerts = getAngularService('utilService').sortCertActual;
  const { hasAnyRole } = getAngularService('authService');
  const [criteria, setCriteria] = useState(props.certificationResults);
  const [hasIcs] = useState(props.hasIcs);
  const [isConfirming] = useState(props.isConfirming);
  const classes = useStyles();
  const flags = {
    conformanceMethodIsOn: props.conformanceMethodIsOn,
    optionalStandardsIsOn: props.optionalStandardsIsOn,
  };
  /* eslint-enable react/destructuring-assignment */

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
    <FlagContext.Provider value={flags}>
      <ThemeProvider theme={theme}>
        { criteria.filter((cc) => !cc.criterion.removed && (cc.success || props.viewAll))
          .sort((a, b) => sortCerts(a, b))
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
                    .sort((a, b) => sortCerts(a, b))
                    .map((cc) => (
                      <ChplCriterion
                        key={cc.criterion.id}
                        certificationResult={cc}
                        canEdit={props.canEdit && (cc.success || hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']))}
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
      </ThemeProvider>
    </FlagContext.Provider>
  );
}

export default ChplCriteria;

ChplCriteria.propTypes = {
  certificationResults: arrayOf(certificationResult).isRequired,
  accessibilityStandards: arrayOf(accessibilityStandard),
  canEdit: bool,
  conformanceMethodIsOn: bool,
  isConfirming: bool,
  hasIcs: bool,
  onSave: func,
  optionalStandardsIsOn: bool,
  qmsStandards: arrayOf(qmsStandard),
  resources: resourceDefinition,
  viewAll: bool,
};

ChplCriteria.defaultProps = {
  accessibilityStandards: [],
  canEdit: false,
  conformanceMethodIsOn: false,
  isConfirming: false,
  hasIcs: false,
  onSave: () => {},
  optionalStandardsIsOn: false,
  qmsStandards: [],
  resources: {},
  viewAll: false,
};
