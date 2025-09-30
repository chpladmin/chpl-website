import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { func, number, object } from 'prop-types';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import Edit from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

import ChplAnnualEdit from './annual-edit';
import ChplAnnualView from './annual-view';

import { usePostAnnualReportRequest, usePostInitiateAnnualReport } from 'api/surveillance';
import { UserContext } from 'shared/contexts';

function ChplAnnual({
  year, dispatch, report, acb,
}) {
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: doDownload } = usePostAnnualReportRequest();
  const { mutate: doInitiate } = usePostInitiateAnnualReport();
  const [state, setState] = useState('summary');

  const download = () => {
    doDownload(report, {
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

  const edit = () => {
    setState('edit');
    dispatch({ action: 'focus-annual' });
  };

  const initiate = () => {
    const payload = {
      acb,
      year,
    };
    doInitiate(payload, {
      onSuccess: () => {
        edit();
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

  if (state === 'edit') {
    return (
      <ChplAnnualEdit
        report={report}
        dispatch={handleDispatch}
      />
    );
  }

  if (state === 'view') {
    return (
      <ChplAnnualView
        report={report}
        dispatch={handleDispatch}
      />
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="h2">
          <strong>Annual Summary</strong>
        </Typography>
        <Typography variant="body2" style={{ padding: '4px' }}>
          {year}
        </Typography>
        <Box>
          { report.id
            && (
              <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}>
                { hasAnyRole(['chpl-admin', 'chpl-onc-acb'])
                  && (
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      style={{ marginRight: '4px' }}
                      onClick={edit}
                      endIcon={<Edit fontSize="small" />}
                    >
                      Edit
                    </Button>
                  )}
                { hasAnyRole(['chpl-onc'])
                  && (
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      style={{ marginRight: '4px' }}
                      onClick={view}
                      endIcon={<RemoveRedEye fontSize="small" />}
                    >
                      View
                    </Button>
                  )}
                <Button
                  color="primary"
                  size="small"
                  variant="outlined"
                  onClick={download}
                  endIcon={<CloudDownloadOutlinedIcon fontSize="small" />}
                >
                  Download
                </Button>
              </Box>
            )}
          { !report.id && hasAnyRole(['chpl-admin', 'chpl-onc-acb'])
            && (
              <Button
                color="primary"
                variant="outlined"
                size="small"
                onClick={initiate}
                endIcon={<BeenhereIcon fontSize="small" />}
                style={{ marginTop: '8px' }}
              >
                Initiate
              </Button>
            )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ChplAnnual;

ChplAnnual.propTypes = {
  dispatch: func.isRequired,
  year: number.isRequired,
  report: object,
  acb: object.isRequired,
};

ChplAnnual.defaultProps = {
  report: {},
};
