import React, { useState } from 'react';
import {
  arrayOf,
  bool,
  func,
} from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
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
  const [criteria, setCriteria] = useState(props.certificationResults);
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
            key={cc.id}
            certificationResult={cc}
            canEdit={props.canEdit}
            onSave={handleSave}
            resources={prepareResources(props.resources, cc.criterion)}
            accessibilityStandards={props.accessibilityStandards}
            qmsStandards={props.qmsStandards}
          />
        ))}
      <Accordion
        className={classes.NestedAccordionLevelOne}
      >
        <AccordionSummary
          className={classes.NestedAccordionLevelOneSummary}
          expandIcon={<ExpandMoreIcon />}
          id="removed-header"
        >
          Removed Certification Criteria
          <ChplTooltip title="These certification criteria have been removed from the Program.">
            <InfoOutlinedIcon />
          </ChplTooltip>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            { criteria.filter((cc) => cc.criterion.removed && (cc.success || props.viewAll))
              .sort((a, b) => sortCerts(a, b))
              .map((cc) => (
                <ChplCriterion
                  key={cc.id}
                  certificationResult={cc}
                  canEdit={props.canEdit}
                  onSave={handleSave}
                  resources={prepareResources(props.resources, cc.criterion)}
                  accessibilityStandards={props.accessibilityStandards}
                  qmsStandards={props.qmsStandards}
                />
              ))}
          </Container>
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}

export default ChplCriteria;

ChplCriteria.propTypes = {
  certificationResults: arrayOf(certificationResult).isRequired,
  accessibilityStandards: arrayOf(accessibilityStandard),
  canEdit: bool,
  onSave: func,
  qmsStandards: arrayOf(qmsStandard),
  resources: resourceDefinition,
  viewAll: bool,
};

ChplCriteria.defaultProps = {
  accessibilityStandards: [],
  canEdit: false,
  onSave: () => {},
  qmsStandards: [],
  resources: {},
  viewAll: false,
};
