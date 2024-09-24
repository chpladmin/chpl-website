import React, { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ChplCriterionDetailsView from './criterion-details-view';

import { eventTrack } from 'services/analytics.service';
import { CriterionContext, UserContext } from 'shared/contexts';
import {
  certificationResult,
  listing as listingPropType,
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

function ChplCriterion({
  certificationResult: initialCriterion,
  listing,
}) {
  const [accessibilityStandards, setAccessibilityStandards] = useState([]);
  const [criterion, setCriterion] = useState(undefined);
  const [expanded, setExpanded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [qmsStandards, setQmsStandards] = useState([]);
  const { user } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    setCriterion(initialCriterion);
  }, [initialCriterion]);

  useEffect(() => {
    setAccessibilityStandards(listing.accessibilityStandards);
    setQmsStandards(listing.qmsStandards);
  }, [listing]);

  useEffect(() => {
    if (!criterion) { return; }
    setIsDisabled(!criterion.success && !((criterion.g1Success !== null && criterion.g1Success !== undefined) || (criterion.g2Success !== null && criterion.g2Success !== undefined)));
  }, [criterion]);

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

  const handleAccordionChange = () => {
    eventTrack({
      event: `${expanded ? 'Hide' : 'Show'} Details - ${criterion.criterion.number}`,
      category: 'Listing Details',
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
      group: user?.role,
    });
    setExpanded(!expanded);
  };

  if (!criterion) { return null; }

  const criterionState = {
    criterion,
  };

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
                <Typography variant="h6" className={classes.criterionNumber}>
                  { criterion.criterion.status === 'REMOVED'
                    && (
                      <>
                        Removed |
                        {' '}
                      </>
                    )}
                  { criterion.criterion.status === 'RETIRED'
                    && (
                      <>
                        Retired |
                        {' '}
                      </>
                    )}
                  {criterion.criterion.number}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.criterionAccordionSummaryData}>
              <Typography variant="body2">
                { criterion.criterion.title }
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
                <CriterionContext.Provider value={criterionState}>
                  <ChplCriterionDetailsView
                    criterion={criterion}
                    accessibilityStandards={accessibilityStandards}
                    qmsStandards={qmsStandards}
                  />
                </CriterionContext.Provider>
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
  listing: listingPropType.isRequired,
};
