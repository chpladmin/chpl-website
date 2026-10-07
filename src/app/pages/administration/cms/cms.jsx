import React, { useContext } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';

import { usePostReportRequest } from 'api/cms';
import { FlagContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const styles = {
  ...utilStyles,
  titlePadding: {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
};

function ChplCms() {
  const { cmsDisabledIsOn } = useContext(FlagContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostReportRequest();

  const downloadFile = () => {
    mutate({}, {
      onSuccess: (response) => {
        enqueueSnackbar(`Your request has been submitted and you'll get an email at ${response.data.job.jobDataMap.user.email} when it's done`, {
          variant: 'success',
        });
      },
      onError: (error) => {
        const message = error.response.data.error;
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  if (cmsDisabledIsOn) {
    return (
      <Container maxWidth="lg">
        <Typography variant="body1">
          Access to the CMS ID Creator has been paused. Please check back periodically for updates.
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Typography sx={styles.titlePadding} variant="h2">Download the latest CMS listing</Typography>
      <Button
        onClick={downloadFile}
        color="primary"
        variant="contained"
        id="download-results"
        endIcon={<CloudDownloadOutlinedIcon />}
      >
        Download the CMS listing
      </Button>
    </>
  );
}

export default ChplCms;

ChplCms.propTypes = {
};
