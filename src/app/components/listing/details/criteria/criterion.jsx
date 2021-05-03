import React, { useState } from 'react';
import { arrayOf, bool, func, object } from 'prop-types';
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

import { getAngularService, ChplCriterionDetailsEdit, ChplCriterionDetailsView } from '.';
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

function ChplCriterion(props) {
  /* eslint-disable react/destructuring-assignment */
  const [criterion, setCriterion] = useState(props.certificationResult);
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [staged, setStaged] = useState(false);
  const [qmsStandards] = useState(props.qmsStandards);
  const [accessibilityStandards] = useState(props.accessibilityStandards);
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

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
    props.onSave(criterion);
  };

  return (
    <Accordion disabled={!criterion.success && !props.canEdit} className={classes.NestedAccordionLevelOne} onChange={() => handleAccordionChange()}>
      <AccordionSummary
        className={classes.NestedAccordionLevelOneSummary}
        expandIcon={<ExpandMoreIcon />}
        id={`${criterion.id}-header`}
      >
        <Grid container spacing={4}>
          <Grid item xs={1}>
            { criterion.success
              && (
                <Typography variant="subtitle1">
                  <DoneAllIcon size="small" />
                </Typography>
              )}
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle1">
              { criterion.criterion.removed
                && (
                  <>
                    Removed |
                  </>
                )}
              {criterion.criterion.number}
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
            { staged && !pending
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
              {criterion.criterion.title}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={4}>
          { editing
            ? (
              <>
                <ChplCriterionDetailsEdit
                  criterion={criterion}
                  resources={props.resources}
                  onCancel={handleCancel}
                  onChange={handleChange}
                  onSave={handleSave}
                />
              </>
            ) : (
              <>
                { props.canEdit
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
                <ChplCriterionDetailsView
                  criterion={criterion}
                  accessibilityStandards={accessibilityStandards}
                  qmsStandards={qmsStandards}
                />
              </>
            )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default ChplCriterion;

ChplCriterion.propTypes = {
  accessibilityStandards: arrayOf(accessibilityStandard).isRequired,
  canEdit: bool,
  certificationResult: object.isRequired,
  onSave: func,
  qmsStandards: arrayOf(qmsStandard).isRequired,
  resources: object,
};

ChplCriterion.defaultProps = {
  canEdit: false,
  resources: {},
};
