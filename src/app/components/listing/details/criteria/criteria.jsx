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

import ChplCriterion from './criterion';

import theme from 'themes/theme';
import { ChplTooltip } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import {
  accessibilityStandard,
  certificationResult,
  resources as resourceDefinition,
  qmsStandard,
} from 'shared/prop-types';

const useStyles = makeStyles(() => ({
  infoIconColor:{
    color:'#156dac',
    marginLeft: '4px',
    marginTop: '4px',
   },
  NestedAccordionLevelOne: {
    borderRadius: '4px',
    display: 'grid',
    borderColor: ' #c2c6ca',
    borderWidth:'.5px',
    borderStyle:'solid',
  },
  NestedAccordionLevelOneSummary: {
    backgroundColor: '#EFEFEF!important',
    borderRadius: '4px',
    borderBottom: '.5px solid #c2c6ca',
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
                { criteria.filter((cc) => cc.criterion.removed && (cc.success || props.viewAll))
                  .sort((a, b) => sortCerts(a, b))
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
          </div>
        )}
    </ThemeProvider>
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
