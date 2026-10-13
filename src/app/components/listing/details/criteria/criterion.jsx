import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';

import ChplCriterionDetailsView from './criterion-details-view';

import ChplTooltip from 'components/util/chpl-tooltip';
import { eventTrack } from 'services/analytics.service';
import { CriterionContext, useAnalyticsContext } from 'shared/contexts';
import {
  certificationResult,
  listing as listingPropType,
} from 'shared/prop-types';
import { palette } from 'themes';

const styles = {
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
  criterionNumber: {
    textTransform: 'none',
    fontWeight: '700',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
  updateRequired: {
    color: palette.error,
  },
};

function ChplCriterion({
  certificationResult: initialCriterion,
  listing,
}) {
  const { analytics } = useAnalyticsContext();
  const [accessibilityStandards, setAccessibilityStandards] = useState([]);
  const [criterion, setCriterion] = useState(undefined);
  const [expanded, setExpanded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [qmsStandards, setQmsStandards] = useState([]);

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
          <ExpandMoreIcon color="primary" fontSize="large" sx={styles.rotate} />
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
      ...analytics,
      event: `${expanded ? 'Hide' : 'Show'} Details - ${criterion.criterion.number}`,
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
        sx={styles.criterionAccordion}
        onChange={handleAccordionChange}
        id={`criterion-id-${criterion.criterion.id}`}
      >
        <AccordionSummary
          sx={styles.criterionAccordionSummary}
          expandIcon={getIcon()}
          id={`criterion-id-${criterion.criterion.id}-header`}
        >
          <Box sx={styles.criterionAccordionSummaryHeader}>
            <Box sx={styles.criterionAccordionSummarySubBox}>
              <Box sx={styles.criterionAccordionSummaryData}>
                { criterion.success
                  && (
                    <CheckIcon fontSize="large" aria-label={`Listing attests to criterion ${criterion.number}`} />
                  )}
              </Box>
              <Box sx={styles.criterionAccordionSummaryData}>
                <Typography variant="h6" sx={styles.criterionNumber}>
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
            <Box sx={styles.criterionAccordionSummaryData}>
              <Typography variant="body2">
                { criterion.criterion.title }
              </Typography>
            </Box>
              { !criterion.upToDate && !isDisabled
              && (
                <Box>
                  <ChplTooltip title="Requirement not met">
                    <IconButton size="small" aria-label="Requirement not met for this criterion">
                      <WarningIcon sx={styles.updateRequired} />
                    </IconButton>
                  </ChplTooltip>
                </Box>
              )}
          </Box>
        </AccordionSummary>
        { (listing.edition === null || listing.edition.name !== '2011')
          && (
            <AccordionDetails
              sx={styles.criterionAccordionDetails}
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
