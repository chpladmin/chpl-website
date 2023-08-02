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
    alignContent: 'center',
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
    certificationResult: initialCriterion,
    hasIcs,
    isConfirming,
    isEditing,
    listing,
    onSave,
    resources,
  } = props;
  const [accessibilityStandards, setAccessibilityStandards] = useState([]);
  const [criterion, setCriterion] = useState(undefined);
  const [expanded, setExpanded] = useState(false);
  const [qmsStandards, setQmsStandards] = useState([]);
  const [pending, setPending] = useState(false);
  const [staged, setStaged] = useState(false);
  const $analytics = getAngularService('$analytics');
  const classes = useStyles();

  useEffect(() => {
    setCriterion(initialCriterion);
  }, [initialCriterion]);

  useEffect(() => {
    setAccessibilityStandards(listing.accessibilityStandards);
    setQmsStandards(listing.qmsStandards);
  }, [listing]);

  const getIcon = () => {
    if (listing.certificationEdition.name === '2011') { return null; }
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
    setCriterion(updatedCriterion);
    onSave(updatedCriterion);
  };

  if (!criterion) { return null; }

  return (
    <div>
      <Accordion
        disabled={!criterion.success && !(criterion.g1Success !== null || criterion.g2Success !== null) && !isEditing}
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
              </Box>
            </Box>
            <Box className={classes.criterionAccordionSummaryData}>
              <Typography variant="body2">
                <ChplHighlightCures text={criterion.criterion.title} />
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        { listing.certificationEdition.name !== '2011'
          && (
            <AccordionDetails
              className={classes.criterionAccordionDetails}
              id={`criterion-id-${criterion.criterion.id}-details`}
            >
              <Container>
                { isEditing
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
                    <ChplCriterionDetailsView
                      criterion={criterion}
                      accessibilityStandards={accessibilityStandards}
                      qmsStandards={qmsStandards}
                    />
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
  certificationResult: certificationResult.isRequired,
  hasIcs: bool,
  isConfirming: bool,
  isEditing: bool,
  listing: listingPropType.isRequired,
  onSave: func,
  resources: resourceDefinition,
};

ChplCriterion.defaultProps = {
  hasIcs: false,
  isConfirming: false,
  isEditing: false,
  onSave: () => {},
  resources: {},
};
