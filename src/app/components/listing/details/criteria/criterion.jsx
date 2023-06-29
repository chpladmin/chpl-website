import React, { useState } from 'react';
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
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CheckIcon from '@material-ui/icons/Check';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SyncIcon from '@material-ui/icons/Sync';
import {
  arrayOf,
  bool,
  func,
} from 'prop-types';

import ChplCriterionDetailsEdit from './criterion-details-edit';
import ChplCriterionDetailsView from './criterion-details-view';

import { ChplHighlightCures } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { isCures } from 'services/criteria.service';
import {
  accessibilityStandard,
  certificationResult,
  resources as resourceDefinition,
  qmsStandard,
} from 'shared/prop-types';
import { palette } from 'themes';

const useStyles = makeStyles({
  criterionAccordion: {
    borderRadius: '8px',
    display: 'grid',
    borderColor: palette.divider,
    borderWidth: '.5px',
    borderStyle: 'solid',
  },
  criterionAccordionSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    padding: '0 4px',
    borderBottom: `.5px solid ${palette.divider}`,
  },
  criterionAccordionDetails: {
    borderRadius: '0 0 8px 8px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  pendingChip: {
    fontSize: '.7rem',
    backgroundColor: '#3e0d59',
    color: palette.white,
  },
  stagedChip: {
    fontSize: '.7rem',
    backgroundColor: '#0d5928',
    color: palette.white,
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
});

function ChplCriterion(props) {
  const {
    accessibilityStandards,
    canEdit,
    hasIcs,
    isConfirming,
    onSave,
    qmsStandards,
    resources,
  } = props;
  const [criterion, setCriterion] = useState(props.certificationResult); // eslint-disable-line react/destructuring-assignment
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [staged, setStaged] = useState(false);
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();

  const getIcon = () => (expanded
    ? (
      <>
        <Typography color="primary" variant="body2">Hide Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" className={classes.rotate} />
      </>
    )
    : (
      <>
        <Typography color="primary" variant="body2">Show Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" />
      </>
    ));

  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(!expanded);
    if (isExpanded) {
      const label = criterion.criterion.number + (isCures(criterion.criterion) ? ' (Cures Update)' : '');
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
    onSave(updatedCriterion);
  };

  return (
    <div>
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
          <Grid container alignItems="center" spacing={4}>
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
              <Typography variant="body2">
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
    </div>
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
