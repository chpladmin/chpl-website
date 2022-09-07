import React from 'react';
import {
  Button,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import GetAppIcon from '@material-ui/icons/GetApp';

import { usePostReportRequest } from 'api/cms';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  titlePadding: {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
});

function ChplCms() {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostReportRequest();
  const classes = useStyles();

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

  return (
    <Container maxWidth="lg">
      <Typography className={classes.titlePadding} variant="h1">CMS Management</Typography>
      <Typography className={classes.titlePadding} variant="h2">Download the latest CMS listing</Typography>
      <Button
        onClick={downloadFile}
        color="primary"
        variant="contained"
        id="download-results"
      >
        Download the CMS listing
        {' '}
        <GetAppIcon className={classes.iconSpacing} />
      </Button>
    </Container>
  );
}

export default ChplCms;

ChplCms.propTypes = {
};
