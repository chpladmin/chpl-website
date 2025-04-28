import React from 'react';
import {
  Box,
  Divider,
} from '@material-ui/core';
import { object } from 'prop-types';

import ChplQuarterViewListingSurveillance from './quarter-view-listing-surveillance';

function ChplQuarterViewListing({
  listing,
}) {
  return (
    <>
      <Box display="flex" width="100%" gridGap="32px" flexDirection="row" justifyContent="space-between">
        {listing.surveillances.map((surv) => (
          <ChplQuarterViewListingSurveillance
            key={surv.id}
            surveillance={surv}
          />
        ))}
      </Box>
      <Divider />
    </>
  );
}

export default ChplQuarterViewListing;

ChplQuarterViewListing.propTypes = {
  listing: object.isRequired,
};
