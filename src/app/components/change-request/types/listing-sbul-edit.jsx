import React, { useContext } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import ChplUrlChecker from 'components/url-checker/url-checker';
import { ChplLink } from 'components/util';
import { ChangeRequestContext, UserContext, useAnalyticsContext } from 'shared/contexts';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #DDD',
    paddingRight: '16px',
    marginRight: '8px',
    gap: '16px',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailsSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
};

function ChplChangeRequestListingSbulEdit() {
  const { analytics } = useAnalyticsContext();
  const { changeRequest, setChangeRequest } = useContext(ChangeRequestContext);
  const { hasAnyRole } = useContext(UserContext);

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

  const handleDispatch = ({ url: submittedUrl }) => {
    setChangeRequest((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        url: submittedUrl,
      },
    }));
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.detailsContainer}>
        <Typography variant="subtitle1">Current details</Typography>
        <Typography>
          { getCurrent() }
        </Typography>
      </Box>
      <Divider />
      <Box sx={styles.detailsContainer}>
        <Typography variant="subtitle1">Submitted details</Typography>
        { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])
          && (
            <Typography>
              { changeRequest.details.url }
            </Typography>
          )}
        { hasAnyRole(['chpl-developer'])
          && (
            <ChplUrlChecker
              dispatch={handleDispatch}
              url={changeRequest.details.url}
            />
          )}
      </Box>
    </Box>
  );
}

export default ChplChangeRequestListingSbulEdit;

ChplChangeRequestListingSbulEdit.propTypes = {
};
