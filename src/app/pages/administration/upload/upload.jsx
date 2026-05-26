import React, { useContext } from 'react';
import {
  Box,
  makeStyles,
} from '@material-ui/core';

import ChplUploadListings from 'components/upload/upload-listings';
import ChplUploadPromotingInteroperability from 'components/upload/upload-promoting-interoperability';
import ChplUploadRealWorldTesting from 'components/upload/upload-real-world-testing';
import { UserContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  uploadCards: {
    width: '48%',
  },
});

function ChplUpload() {
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gridGap="8px"
    >
      { hasAnyRole(['chpl-admin', 'chpl-onc-acb'])
        && (
          <Box className={classes.uploadCards}>
            <ChplUploadListings />
          </Box>
        )}
      <Box className={classes.uploadCards}>
        <ChplUploadRealWorldTesting />
      </Box>
      { hasAnyRole(['chpl-admin', 'chpl-onc'])
        && (
          <Box className={classes.uploadCards}>
            <ChplUploadPromotingInteroperability />
          </Box>
        )}
    </Box>
  );
}

export default ChplUpload;

ChplUpload.propTypes = {
};
