import React, { useState } from 'react';
import {
  arrayOf,
  bool,
  func,
} from 'prop-types';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CheckIcon from '@material-ui/icons/Check';
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
  Container,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { getAngularService, ChplCriterionDetailsEdit, ChplCriterionDetailsView } from '.'; // eslint-disable-line import/no-cycle
import { ChplHighlightCures } from '../../../util';
import {
  accessibilityStandard,
  certificationResult,
  resources as resourceDefinition,
  qmsStandard,
} from '../../../../shared/prop-types';

const useStyles = makeStyles(() => ({
  criterionAccordion: {
    borderRadius: '8px',
    display: 'grid',    
  },
  criterionAccordionSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '.5px solid #c2c6ca',
  },
  criterionAccordionDetails: {
    borderBottom:'.5px solid #c2c6ca',
    borderLeft: '.5px solid #c2c6ca',
    borderRight: '.5px solid #c2c6ca',
    borderRadius: '0 0 8px 8px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  pendingChip: {
    fontSize: '.7rem',
    backgroundColor: '#3e0d59',
    color: '#ffffff',
  },
  stagedChip: {
    fontSize: '.7rem',
    backgroundColor: '#0d5928',
    color: '#ffffff',
  },
  criterionNumber: {
    textTransform: 'none',
  },
  editCriterion: {
    margin: '8px 0px',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
}));

function ChplCriterion(props) {
  /* eslint-disable react/destructuring-assignment */
  const [canEdit] = useState(props.canEdit);
  const [criterion, setCriterion] = useState(props.certificationResult);
  const [editing, setEditing] = useState(false);
  const [hasIcs] = useState(props.hasIcs);
  const [isConfirming] = useState(props.isConfirming);
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [resources] = useState(props.resources);
  const [staged, setStaged] = useState(false);
  const [qmsStandards] = useState(props.qmsStandards);
  const [accessibilityStandards] = useState(props.accessibilityStandards);
  const $analytics = getAngularService('$analytics');
  const utilService = getAngularService('utilService');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  const getIcon = () => (expanded
    ? (
      <>
        Hide Details
        <ExpandMoreIcon color="primary" fontSize="large" className={classes.rotate} />
      </>
    )
    : (
      <>
        Show Details
        <ExpandMoreIcon color="primary" fontSize="large" />
      </>
    ));

  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(!expanded);
    if (isExpanded) {
      const label = criterion.criterion.number + (utilService.isCures(criterion.criterion) ? ' (Cures Update)' : '');
      $analytics.eventTrack('Viewed criteria details', { category: 'Listing Details', label });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setPending(false);
  };

  const handleChange = () => {
    setPending(true);
  };

  const handleSave = (updatedCriterion) => {
    if (pending) {
      setPending(false);
      setStaged(true);
    }
    setEditing(false);
    setCriterion(updatedCriterion);
    props.onSave(updatedCriterion);
  };

  return (
    <Accordion
      disabled={!criterion.success && !(criterion.g1Success !== null || criterion.g2Success !== null) && !canEdit}
      className={classes.criterionAccordion}
      onChange={handleAccordionChange}
      id={`criterion-id-${criterion.criterion.id}`}
    >
      <AccordionSummary
        className={classes.criterionAccordionSummary}
        expandIcon={getIcon()}
        id={`criterion-id-${criterion.criterion.id}-header`}
      >
        <Grid container alignItems='center' spacing={4}>
          <Grid item xs={1}>
            { criterion.success
              && (
                <CheckIcon fontSize="large" aria-label={`Listing attests to criterion ${criterion.number}`} />
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
              <div className={classes.criterionNumber}>
                {criterion.criterion.number}
              </div>
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
              <ChplHighlightCures text={criterion.criterion.title} />
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails
        className={classes.criterionAccordionDetails}
        id={`criterion-id-${criterion.criterion.id}-details`}
      >
        <Container>
          { editing
            ? (
              <ChplCriterionDetailsEdit
                criterion={criterion}
                hasIcs={hasIcs}
                isConfirming={isConfirming}
                onCancel={handleCancel}
                onChange={handleChange}
                onSave={handleSave}
                resources={resources}
              />
            ) : (
              <>
                { canEdit
                  && (
                    <div>
                      <Button
                        fullWidth
                        color="secondary"
                        variant="contained"
                        className={classes.editCriterion}
                        onClick={() => setEditing(true)}
                        id={`criterion-id-${criterion.criterion.id}-edit`}
                      >
                        Edit Criteria
                        <EditOutlinedIcon
                          className={classes.iconSpacing}
                          fontSize="large"
                        />
                      </Button>
                    </div>
                  )}
                <div>
                  <ChplCriterionDetailsView
                    criterion={criterion}
                    accessibilityStandards={accessibilityStandards}
                    qmsStandards={qmsStandards}
                  />
                </div>
              </>
            )}
        </Container>
      </AccordionDetails>
    </Accordion>
  );
}

export default ChplCriterion;

ChplCriterion.propTypes = {
  accessibilityStandards: arrayOf(accessibilityStandard).isRequired,
  canEdit: bool,
  certificationResult: certificationResult.isRequired,
  isConfirming: bool,
  hasIcs: bool,
  onSave: func,
  qmsStandards: arrayOf(qmsStandard).isRequired,
  resources: resourceDefinition,
};

ChplCriterion.defaultProps = {
  canEdit: false,
  isConfirming: false,
  hasIcs: false,
  onSave: () => {},
  resources: {},
};
