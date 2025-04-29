import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import {
  func,
  number,
  object,
} from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  ArrowDownwardSharp, Edit, RemoveRedEye,
} from '@material-ui/icons';

import ChplAnnualView from './annual-view';

import { usePostAnnualReportRequest } from 'api/surveillance';
import { UserContext } from 'shared/contexts';

function ChplAnnual({
  year,
  dispatch,
  report,
}) {
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostAnnualReportRequest();
  const [state, setState] = useState('summary');

  const download = () => {
    mutate(report, {
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

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setState('summary');
        dispatch({ action: 'cancel' });
        break;
      default:
        dispatch({ action, payload });
    }
  };

  const view = () => {
    setState('view');
    dispatch({ action: 'focus-annual' });
  };

  return (
    <>
      {state === 'summary' ? (
        <Card>
          <CardContent>
            <Typography variant="h4" fontWeight="bold">Annual Summary</Typography>
            <Typography variant="body2" style={{ padding: 2 }}>{year}</Typography>
            <Box>
              {report.id && (
                <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}>
                  {hasAnyRole(['chpl-admin', 'chpl-onc-acb']) && (
                    <Button
                      color="primary"
                      size="small"
                      endIcon={<Edit />}
                    >
                      Edit
                    </Button>
                  )}
                  {hasAnyRole(['chpl-onc']) && (
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      style={{ marginRight: '4px' }}
                      onClick={view}
                      endIcon={<RemoveRedEye />}
                    >
                      View
                    </Button>
                  )}
                  <Button
                    color="primary"
                    size="small"
                    onClick={download}
                    endIcon={<ArrowDownwardSharp />}
                  >
                    Download
                  </Button>
                </Box>
              )}
              {!report.id && hasAnyRole(['chpl-admin', 'chpl-onc-acb']) && (
                <Button>Initiate</Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <ChplAnnualView
          report={report}
          dispatch={handleDispatch}
        />
      )}

    </>
  );
}

export default ChplAnnual;

ChplAnnual.propTypes = {
  dispatch: func.isRequired,
  year: number.isRequired,
  report: object,
};

ChplAnnual.defaultProps = {
  report: {},
};
