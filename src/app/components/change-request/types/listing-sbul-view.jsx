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

function ChplChangeRequestListingSbulView() {
  const { analytics } = useAnalyticsContext();
  const { changeRequest } = useContext(ChangeRequestContext);

  const getCurrent = () => {
    if (changeRequest.details.listing.certificationResults.find((cr) => cr.criterion.id === 182)?.serviceBaseUrlList) {
      const url = changeRequest.details.listing.certificationResults.find((cr) => cr.criterion.id === 182)?.serviceBaseUrlList;
      return (
        <ChplLink
          href={url}
          analytics={{
            ...analytics,
            event: 'Navigate to Current SBUL',
            label: url,
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
          Current Service Base URL List
        </Typography>
        <Typography>
          { getCurrent() }
        </Typography>
      </Box>
      <Box sx={styles.detailsContainer}>
        <Typography variant="subtitle1">
          Submitted Service Base URL List
        </Typography>
        <Typography>
          <ChplLink
            href={changeRequest.details.url}
            analytics={{
              ...analytics,
              event: 'Navigate to Submitted SBUL',
              label: changeRequest.details.url,
            }}
          />
        </Typography>
      </Box>
    </Box>
  );
}

export default ChplChangeRequestListingSbulView;

ChplChangeRequestListingSbulView.propTypes = {
};
