import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import { object } from 'prop-types';

import ChplQuarterViewListingSurveillance from './quarter-view-listing-surveillance';

import { getDisplayDateFormat } from 'services/date-util';
import { utilStyles, palette } from 'themes';

const useStyles = makeStyles({
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
});

function ChplQuarterViewListing({ listing }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const classes = useStyles();

  return (
    <Accordion key={listing.chplProductNumber}>
      <AccordionSummary
        className={classes.accordionSummary}
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
        <div className={classes.accordionSummaryContent}>
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
        </div>
      </AccordionSummary>
      <AccordionDetails style={{ display: 'flex', padding: '0', marginTop: '-32px', boxShadow: 'none' }}>
        <Box display="flex" width="100%" gridGap="32px" flexDirection="row" justifyContent="space-between">
          { listing.surveillances.map((surv) => (
            <ChplQuarterViewListingSurveillance
              key={surv.id}
              surveillance={surv}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default ChplQuarterViewListing;

ChplQuarterViewListing.propTypes = {
  listing: object.isRequired,
};
