import React, { useState } from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography,
} from '@mui/material';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import { number, object } from 'prop-types';

import ChplQuarterEditListingSurveillance from './quarter-edit-listing-surveillance';

import { getDisplayDateFormat } from 'services/date-util';
import { utilStyles, palette } from 'themes';

const styles = {
  ...utilStyles,
  accordionSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    border: `.5px solid ${palette.divider}`,
    marginBottom: '8px',
    '&:before': {
      display: 'none',
    },
  },
  accordionSummaryContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: '8px',
  },
};

function ChplQuarterEditListing({ listing, reportId }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Accordion key={listing.chplProductNumber}>
      <AccordionSummary
        sx={styles.accordionSummary}
        expandIcon={(
          <Button
            variant="outlined"
            color="primary"
            size="small"
            endIcon={isExpanded ? <ArrowUpward /> : <ArrowDownward />}
          >
            { isExpanded ? 'Hide Surveillance' : 'Show Surveillance' }
          </Button>
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box sx={styles.accordionSummaryContent}>
          <div>
            <Typography gutterBottom><strong>Product Number</strong></Typography>
            <Typography>{ listing.chplProductNumber }</Typography>
          </div>
          <div>
            <Typography gutterBottom><strong>Certification Date:</strong></Typography>
            <Typography>{ getDisplayDateFormat(listing.certificationDay) }</Typography>
          </div>
          <div>
            <Typography gutterBottom><strong># Relevant Surveillances:</strong></Typography>
            <Typography>{ listing.surveillances.length }</Typography>
          </div>
        </Box>
      </AccordionSummary>
      <AccordionDetails style={{
        display: 'flex',
        padding: '0',
        marginTop: '-32px',
        boxShadow: 'none',
      }}
      >
        <Box display="flex" width="100%" gap="32px" flexDirection="row" justifyContent="space-between">
          { listing.surveillances
            .sort((a, b) => (a.friendlyId < b.friendlyId ? -1 : 1))
            .map((surv) => (
              <ChplQuarterEditListingSurveillance
                key={surv.id}
                surveillance={surv}
                reportId={reportId}
              />
            ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default ChplQuarterEditListing;

ChplQuarterEditListing.propTypes = {
  listing: object.isRequired,
  reportId: number.isRequired,
};
