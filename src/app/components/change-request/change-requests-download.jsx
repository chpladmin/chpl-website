import React, { useEffect, useState } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useSnackbar } from 'notistack';
import { object, number, string } from 'prop-types';

import { usePostReportRequest } from 'api/change-requests';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplChangeRequestsDownload(props) {
  const { bonusQuery, queryParams, recordCount } = props;
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostReportRequest();
  const [query, setQuery] = useState({});
  const classes = useStyles();

  useEffect(() => {
    const updated = {
      ...queryParams,
    };
    if (bonusQuery) {
      updated.developerId = parseInt(bonusQuery.split('=')[1], 10);
    }
    setQuery(updated);
  }, [bonusQuery, queryParams]);

  const download = () => {
    eventTrack({
      ...analytics,
      event: 'Download Results',
      label: recordCount,
    });
    mutate(query, {
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
    <Button
      fullWidth
      color="primary"
      variant="contained"
      onClick={download}
      disabled={recordCount === 0}
    >
      Download
      {' '}
      { recordCount }
      {' '}
      result
      { recordCount === 1 ? '' : 's' }
      <GetAppIcon className={classes.iconSpacing} />
    </Button>
  );
}

export default ChplChangeRequestsDownload;

ChplChangeRequestsDownload.propTypes = {
  bonusQuery: string,
  queryParams: object,
  recordCount: number,
};

ChplChangeRequestsDownload.defaultProps = {
  bonusQuery: '',
  queryParams: {},
  recordCount: 0,
};
