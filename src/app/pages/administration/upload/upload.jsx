import React from 'react';
import {
  Box,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';

import {
  ChplUploadListings,
  ChplUploadPromotingInteroperability,
  ChplUploadRealWorldTestingWrapper,
  ChplUploadApiDocumentationWrapper,
} from '../../../components/upload';

import { palette, theme, utilStyles } from 'themes';

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
});

function ChplUpload() {
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
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Container maxWidth="lg">
          <Box className={classes.uploadCardContainer}>
            <Box className={classes.uploadCard}>
              <ChplUploadListings />
            </Box>
            <Box className={classes.uploadCard}>
              <ChplUploadRealWorldTestingWrapper />
            </Box>
            <Box className={classes.uploadCard}>
              <ChplUploadPromotingInteroperability />
            </Box>
            <Box className={classes.uploadCard}>
              <ChplUploadApiDocumentationWrapper />
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
