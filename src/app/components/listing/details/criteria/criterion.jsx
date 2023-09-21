import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CheckIcon from '@material-ui/icons/Check';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SyncIcon from '@material-ui/icons/Sync';
import { bool, func } from 'prop-types';

import ChplCriterionDetailsEdit from './criterion-details-edit';
import ChplCriterionDetailsView from './criterion-details-view';

import { ChplHighlightCures } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { isCures } from 'services/criteria.service';
import {
  certificationResult,
  listing as listingPropType,
  resources as resourceDefinition,
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
  criterionAccordionSummaryHeader: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '16px',
  },
  criterionAccordionDetails: {
    borderRadius: '0 0 8px 8px',
  },
  criterionAccordionSummarySubBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '8px',
  },
  criterionAccordionSummaryData: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
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
    fontWeight: '700',
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
    certificationResult: initialCriterion,
    canEdit,
    hasIcs,
    isConfirming,
    listing,
    onSave,
    resources,
  } = props;
  const [accessibilityStandards, setAccessibilityStandards] = useState([]);
  const [criterion, setCriterion] = useState(undefined);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [qmsStandards, setQmsStandards] = useState([]);
  const [pending, setPending] = useState(false);
  const [staged, setStaged] = useState(false);
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();

  useEffect(() => {
    setCriterion(initialCriterion);
  }, [initialCriterion]);

  useEffect(() => {
    if (!criterion) { return; }
    setIsDisabled(!criterion.success && !((criterion.g1Success !== null && criterion.g1Success !== undefined) || (criterion.g2Success !== null && criterion.g2Success !== undefined)) && !canEdit);
  }, [criterion, canEdit]);

  useEffect(() => {
    setAccessibilityStandards(listing.accessibilityStandards);
    setQmsStandards(listing.qmsStandards);
  }, [listing]);

  const getIcon = () => {
    if (listing.edition !== null && listing.edition.name === '2011') { return null; }
    if (isDisabled) { return null; }
    return (expanded
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
  };

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

  if (!criterion) { return null; }

  return (
    <div>
      <Accordion
        disabled={isDisabled}
        className={classes.criterionAccordion}
        onChange={handleAccordionChange}
        id={`criterion-id-${criterion.criterion.id}`}
      >
        <AccordionSummary
          className={classes.criterionAccordionSummary}
          expandIcon={getIcon()}
          id={`criterion-id-${criterion.criterion.id}-header`}
        >
          <Box className={classes.criterionAccordionSummaryHeader}>
            <Box className={classes.criterionAccordionSummarySubBox}>
              <Box className={classes.criterionAccordionSummaryData}>
                { criterion.success
                && (
                  <CheckIcon fontSize="large" aria-label={`Listing attests to criterion ${criterion.number}`} />
                )}
              </Box>
              <Box className={classes.criterionAccordionSummaryData}>
                <Typography variant="subtitle1">
                  { criterion.criterion.status === 'REMOVED'
                  && (
                    <>
                      Removed | 
                    </>
                  )}
                  { criterion.criterion.status === 'RETIRED'
                  && (
                    <>
                      Retired | 
                    </>
                  )}
                </Typography>
                <Typography className={classes.criterionNumber}>
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
              </Box>
            </Box>
            <Box className={classes.criterionAccordionSummaryData}>
              <Typography variant="body2">
                <ChplHighlightCures text={criterion.criterion.title} />
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        { (listing.edition === null || listing.edition.name !== '2011')
          && (
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
          )}
      </Accordion>
    </div>
  );
}

export default ChplCriterion;

ChplCriterion.propTypes = {
  canEdit: bool,
  certificationResult: certificationResult.isRequired,
  hasIcs: bool,
  isConfirming: bool,
  listing: listingPropType.isRequired,
  onSave: func,
  resources: resourceDefinition,
};

ChplCriterion.defaultProps = {
  canEdit: false,
  hasIcs: false,
  isConfirming: false,
  onSave: () => {},
  resources: {},
};
