import React, { useContext } from 'react';
import {
  Box,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';

import ChplUploadApiDocumentation from 'components/upload/upload-api-documentation';
import ChplUploadListings from 'components/upload/upload-listings';
import ChplUploadPromotingInteroperability from 'components/upload/upload-promoting-interoperability';
import ChplUploadRealWorldTesting from 'components/upload/upload-real-world-testing';
import { UserContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  pageHeader: {
    padding: '32px 0',
    backgroundColor: palette.white,
  },
  pageBody: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: palette.background,
    padding: '32px 0',
  },
  uploadCards: {
    width: '48%',
  },
  uploadCardContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '16px',
  },
  uploadCardColumns: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
});

function ChplUpload() {
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();

  return (
    <Box bgcolor={palette.background}>
      <div className={classes.pageHeader}>
        <Container maxWidth="lg">
          <Typography
            variant="h1"
          >
            Upload your files
          </Typography>
        </Container>
      </div>
      <div className={classes.pageBody} tabIndex="-1">
        <Container maxWidth="lg">
          <Box className={classes.uploadCardColumns}>
            <Box className={classes.uploadCardContainer}>
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
              { hasAnyRole(['chpl-admin', 'chpl-onc'])
                && (
                  <Box className={classes.uploadCards}>
                    <ChplUploadApiDocumentation />
                  </Box>
                )}
            </Box>
          </Box>
        </Container>
      </div>
    </Box>
  );
}

export default ChplUpload;

ChplUpload.propTypes = {
};
