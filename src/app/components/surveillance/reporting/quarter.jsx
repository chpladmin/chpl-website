import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from '@material-ui/core';
import {
  func,
  number,
  object,
} from 'prop-types';
import { useSnackbar } from 'notistack';
import { ArrowDownwardSharp, Edit, RemoveRedEye } from '@material-ui/icons';

import ChplQuarterView from './quarter-view';

import { usePostQuarterlyReportRequest } from 'api/surveillance';
import { UserContext } from 'shared/contexts';

function ChplQuarter({
  quarter,
  year,
  dispatch,
  report,
}) {
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostQuarterlyReportRequest();
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
    dispatch({ action: `focus-quarter-${quarter.name}` });
  };

  return (
    <>
      {state === 'view'
        && (
          <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
            <ChplQuarterView
              report={report}
              dispatch={handleDispatch}
            />
          </CardContent>
        )}
      {state === 'summary'
        && (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Card>
              <CardContent>
                <Typography fontWeight="bold" variant="h4">
                  {quarter.name}
                  {' '}
                  {year}
                </Typography>
                <Typography style={{ padding: 2 }} variant="body2">{quarter.description}</Typography>
                {report.id
                  && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}>
                      {hasAnyRole(['chpl-admin', 'chpl-onc-acb'])
                        && (
                          <Button color="primary" size="small" endIcon={<Edit />}>Edit</Button>
                        )}
                      {hasAnyRole(['chpl-onc'])
                        && (
                          <Button
                            color="primary"
                            variant="outlined"
                            style={{ marginRight: '4px' }}
                            size="small"
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
                {!report.id && hasAnyRole(['chpl-admin', 'chpl-onc-acb'])
                  && (
                    <Button size="small">Initiate</Button>
                  )}
              </CardContent>
            </Card>
          </Box>
        )}
    </>
  );
}

export default ChplQuarter;

ChplQuarter.propTypes = {
  quarter: object.isRequired,
  dispatch: func.isRequired,
  year: number.isRequired,
  report: object,
};

ChplQuarter.defaultProps = {
  report: {},
};
