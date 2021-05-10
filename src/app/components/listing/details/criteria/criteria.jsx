import React, { useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  object,
} from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@material-ui/core';

import theme from '../../../../themes/theme';
import { ChplTooltip } from '../../../util';
import { getAngularService, ChplCriterion } from '.';
import { accessibilityStandard, qmsStandard } from '../../../../shared/prop-types';

/*
const useStyles = makeStyles(() => ({
  NestedAccordionLevelOne: {
    borderRadius: '8px',
    display: 'grid',
  },
  NestedAccordionLevelOneSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  pendingChip: {
    fontSize: '.7rem',
    backgroundColor: '#d98c54',
    color: '#ffffff',
  },
  stagedChip: {
    fontSize: '.7rem',
    backgroundColor: '#999900',
    color: '#ffffff',
  },
}));
*/

function ChplCriteria(props) {
  /* eslint-disable react/destructuring-assignment */
  const sortCerts = getAngularService('utilService').sortCertActual;
  const [criteria, setCriteria] = useState(props.certificationResults);
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
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id="removed-header"
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              Removed Certification Criteria
              <ChplTooltip title="These certification criteria have been removed from the Program.">
                <InfoOutlinedIcon />
              </ChplTooltip>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4}>
            { criteria.filter((cc) => cc.criterion.removed && (cc.success || props.viewAll))
              .sort((a, b) => sortCerts(a, b))
              .map((cc) => (
                <Grid
                  item
                  xs={12}
                  key={cc.id}
                >
                  <ChplCriterion
                    certificationResult={cc}
                    canEdit={props.canEdit}
                    onSave={handleSave}
                    resources={props.resources}
                    accessibilityStandards={props.accessibilityStandards}
                    qmsStandards={props.qmsStandards}
                  />
                </Grid>
              ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}

export default ChplCriteria;

ChplCriteria.propTypes = {
  certificationResults: arrayOf(object).isRequired,
  accessibilityStandards: arrayOf(accessibilityStandard),
  canEdit: bool,
  onSave: func,
  qmsStandards: arrayOf(qmsStandard),
  resources: object,
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
