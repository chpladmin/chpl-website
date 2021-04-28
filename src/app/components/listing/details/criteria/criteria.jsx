import React, { useState } from 'react';
import { arrayOf, bool, object } from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SyncIcon from '@material-ui/icons/Sync';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Chip,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../../themes/theme';
import { getAngularService, ChplCriteriaDetailsEdit, ChplCriteriaDetailsView } from '.';
import { accessibilityStandard, qmsStandard } from '../../../../shared/prop-types';

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

function ChplCriteria(props) {
  const [canEdit] = useState(props.canEdit);
  const [criteria, setCriteria] = useState(props.certificationResult);
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [staged, setStaged] = useState(false);
  const [qmsStandards] = useState(props.qmsStandards);
  const [accessibilityStandards] = useState(props.accessibilityStandards);
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();

  const handleAccordionChange = (event, isExpanded) => {
    if (!isExpanded) {
      $analytics.eventTrack('Viewed criteria details', { category: 'Listing Details', label: criteria.criterion.number });
    }
  };

  const handleChange = () => {
    setPending(true);
    setStaged(false);
  };

  const handleSave = (criteria) => {
    setPending(false);
    setStaged(true);
    setEditing(false);
    setCriteria(criteria);
  };

  return (
    <ThemeProvider theme={theme}>
      <Accordion disabled={!criteria.success} className={classes.NestedAccordionLevelOne} onChange={() => handleAccordionChange()}>
        <AccordionSummary
          className={classes.NestedAccordionLevelOneSummary}
          expandIcon={<ExpandMoreIcon />}
          id={`${criteria.id}-header`}
        >
          <Grid container spacing={4}>
            <Grid item xs={1}>
              { criteria.success
                && (
                  <Typography variant="subtitle1">
                    <DoneAllIcon size="small" />
                  </Typography>
                )}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">
                { criteria.criterion.removed
                  && (
                    <>
                      Removed |
                    </>
                  )}
                {criteria.criterion.number}
              </Typography>
              { pending
              && (
              <Chip
                overlap="circle"
                label="Pending Changes"
                className={classes.pendingChip}
                avatar={(
                  <Avatar className={classes.pendingChip}>
                    <SyncIcon color="secondary" />
                  </Avatar>
                )}
              />
              )}
              { staged
              && (
              <Chip
                overlap="circle"
                label="Staged Changes"
                className={classes.stagedChip}
                avatar={(
                  <Avatar className={classes.stagedChip}>
                    <CloudDoneIcon color="secondary" />
                  </Avatar>
                )}
              />
              )}
            </Grid>
            <Grid item xs={8}>
              <Typography>
                {criteria.criterion.title}
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4}>
            { editing
              ? (
                <>
                  <ChplCriteriaDetailsEdit
                    criteria={criteria}
                    resources={props.resources}
                    onCancel={() => setEditing(false)}
                    onChange={handleChange}
                    onSave={handleSave}
                  />
                </>
              ) : (
                <>
                  { canEdit
                    && (
                      <Grid item xs={12}>
                        <Button fullWidth color="secondary" variant="contained" onClick={() => setEditing(true)}>
                          Edit Criteria
                          <EditOutlinedIcon
                            className={classes.iconSpacing}
                            fontSize="small"
                          />
                        </Button>
                      </Grid>
                    )}
                  <ChplCriteriaDetailsView
                    criteria={criteria}
                    accessibilityStandards={accessibilityStandards}
                    qmsStandards={qmsStandards}
                  />
                </>
              )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}

export default ChplCriteria;

ChplCriteria.propTypes = {
  canEdit: bool,
  certificationResult: object.isRequired,
  resources: object.isRequired,
  accessibilityStandards: arrayOf(accessibilityStandard).isRequired,
  qmsStandards: arrayOf(qmsStandard).isRequired,
};

ChplCriteria.defaultProps = {
  canEdit: false,
};
