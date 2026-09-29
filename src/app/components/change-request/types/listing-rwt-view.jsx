import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';

import { ChplLink } from 'components/util';
import { ChangeRequestContext, useAnalyticsContext } from 'shared/contexts';

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
};

function ChplChangeRequestListingRwtView() {
  const { analytics } = useAnalyticsContext();
  const { changeRequest } = useContext(ChangeRequestContext);

  const getCurrent = () => {
    if (changeRequest.details.listing.rwtResultsUrl) {
      return (
        <ChplLink
          href={changeRequest.details.listing.rwtResultsUrl}
          analytics={{
            ...analytics,
            event: 'Navigate to Current RWT Results URL',
            label: changeRequest.details.listing.rwtResultsUrl,
          }}
        />
      );
    }
    return 'No current URL';
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.detailsContainer}>
        <Typography variant="subtitle1">
          Current RWT Results URL
        </Typography>
        <Typography>
          { getCurrent() }
        </Typography>
      </Box>
      <Box sx={styles.detailsContainer}>
        <Typography variant="subtitle1">
          Submitted RWT Results URL
        </Typography>
        <Typography>
          <ChplLink
            href={changeRequest.details.url}
            analytics={{
              ...analytics,
              event: 'Navigate to Submitted RWT Results URL',
              label: changeRequest.details.url,
            }}
          />
        </Typography>
      </Box>
    </Box>
  );
}

export default ChplChangeRequestListingRwtView;

ChplChangeRequestListingRwtView.propTypes = {
};
