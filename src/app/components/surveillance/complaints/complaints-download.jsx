import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import GetAppIcon from '@material-ui/icons/GetApp';

import { useFetchComplaintsDownload } from 'api/complaints';
import { UserContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplComplaintsDownload(props) {
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isDownloading, setIsDownloading] = useState(false);
  const { data, error, isLoading, isSuccess } = useFetchComplaintsDownload({
    isAuthenticated: hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB']),
    isDownloading,
  });
  const classes = useStyles();

  useEffect(() => {
    if (data && isSuccess && !isLoading) {
      enqueueSnackbar(`Your request has been submitted and you'll get an email at ${data.job.jobDataMap.email} when it's done`, {
        variant: 'success',
      });
    }
    if (error && !isLoading && !isSuccess) {
      setIsDownloading(false);
      const message = error.response.data.error;
      enqueueSnackbar(message, {
        variant: 'error',
      });
    }
  }, [data, isLoading, isSuccess]);

  const downloadFile = () => {
    setIsDownloading(true);
  };

  if (!hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB'])) {
    return null;
  }

  return (
    <Button
      onClick={downloadFile}
      color="primary"
      variant="contained"
      id="download-results"
      disabled={isDownloading}
    >
      Download all complaints
      {' '}
      <GetAppIcon className={classes.iconSpacing} />
    </Button>
  );
}

export default ChplComplaintsDownload;

ChplComplaintsDownload.propTypes = {
};
