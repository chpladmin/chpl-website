import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import GetAppIcon from '@material-ui/icons/GetApp';

import { usePostReportRequest } from 'api/complaints';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplComplaintsDownload() {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostReportRequest();
  const classes = useStyles();

  const downloadFile = () => {
    mutate({}, {
      onSuccess: (response) => {
        enqueueSnackbar(`Your request has been submitted and you'll get an email at ${response.data.job.jobDataMap.email} when it's done`, {
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
    <Button
      onClick={downloadFile}
      color="primary"
      variant="contained"
      id="download-results"
      endIcon={<GetAppIcon />}
    >
      Download all complaints
    </Button>
  );
}

export default ChplComplaintsDownload;

ChplComplaintsDownload.propTypes = {
};
