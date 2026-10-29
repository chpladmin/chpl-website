import React, { useContext } from 'react';
import { Box } from '@mui/material';

import ChplUploadListings from 'components/upload/upload-listings';
import ChplUploadPromotingInteroperability from 'components/upload/upload-promoting-interoperability';
import ChplUploadRealWorldTesting from 'components/upload/upload-real-world-testing';
import { UserContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const styles = {
  ...utilStyles,
  uploadCards: {
    width: '48%',
  },
};

function ChplUpload() {
  const { hasAnyRole } = useContext(UserContext);

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gap="8px"
    >
      { hasAnyRole(['chpl-admin', 'chpl-onc-acb'])
        && (
          <Box sx={styles.uploadCards}>
            <ChplUploadListings />
          </Box>
        )}
      <Box sx={styles.uploadCards}>
        <ChplUploadRealWorldTesting />
      </Box>
      { hasAnyRole(['chpl-admin', 'chpl-onc'])
        && (
          <Box sx={styles.uploadCards}>
            <ChplUploadPromotingInteroperability />
          </Box>
        )}
    </Box>
  );
}

export default ChplUpload;

ChplUpload.propTypes = {
};
