import React, { useState } from 'react';
import { arrayOf, bool, object } from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@material-ui/core';

import theme from '../../../../themes/theme';
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

function setUpCriteria(criteria, sort) {
  return criteria.sort((a, b) => {
    if (a.criterion.removed !== b.criterion.removed) {
      return a.criterion.removed ? 1 : -1;
    }
    return sort(a, b);
  });
}

function ChplCriteria(props) {
  //const $analytics = getAngularService('$analytics');
  const sortCerts = getAngularService('utilService').sortCertActual;
  const [criteria/*, setCriteria*/] = useState(setUpCriteria(props.certificationResults, sortCerts));
  //const [editing, setEditing] = useState(false);
  //const [pending, setPending] = useState(false);
  //const [staged, setStaged] = useState(false);
  //  const classes = useStyles();

  /*
  const handleAccordionChange = (event, isExpanded) => {
    if (!isExpanded) {
      $analytics.eventTrack('Viewed criteria details', { category: 'Listing Details', label: criterion.criterion.number });
    }
  };

  const handleCancel =  () => {
    setEditing(false);
    setPending(false);
  };

  const handleChange = () => {
    setPending(true);
  };

  const handleSave = (criterion) => {
    if (pending) {
      setPending(false);
      setStaged(true);
    }
    setEditing(false);
    setCriterion(criterion);
  };

  */
  return (
    <ThemeProvider theme={theme}>
      { criteria.filter((cc) => !cc.criterion.removed && (cc.success || props.viewAll))
        .map((cc) => (
          <ChplCriterion
            key={cc.id}
            certificationResult={cc}
            canEdit={props.canEdit}
            resources={props.resources}
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
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4}>
            { criteria.filter((cc) => cc.criterion.removed && (cc.success || props.viewAll))
              .map((cc) => (
                <Grid
                  item
                  xs={12}
                  key={cc.id}
                >
                  <ChplCriterion
                    certificationResult={cc}
                    canEdit={props.canEdit}
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
  canEdit: bool,
  certificationResults: arrayOf(object).isRequired,
  resources: object.isRequired,
  accessibilityStandards: arrayOf(accessibilityStandard).isRequired,
  qmsStandards: arrayOf(qmsStandard).isRequired,
  viewAll: bool,
};

ChplCriteria.defaultProps = {
  canEdit: false,
  viewAll: false,
};
