import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Box,
} from '@material-ui/core';
import { func, number, object } from 'prop-types';
import { useSnackbar } from 'notistack';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import Edit from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

import ChplQuarterEdit from './quarter-edit';
import ChplQuarterView from './quarter-view';

import { usePostInitiateQuarterlyReport, usePostQuarterlyReportRequest } from 'api/surveillance';
import { UserContext } from 'shared/contexts';

function ChplQuarter({
  quarter, year, dispatch, report: initialReport, acb,
}) {
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: doDownload } = usePostQuarterlyReportRequest();
  const { mutate: doInitiate } = usePostInitiateQuarterlyReport();
  const [report, setReport] = useState(undefined);
  const [state, setState] = useState('summary');

  useEffect(() => {
    setReport(initialReport);
  }, [initialReport]);

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
    dispatch({ action: `focus-quarter-${quarter.name}` });
  };

  const initiate = () => {
    const payload = {
      acb,
      quarter: quarter.name,
      year,
    };
    doInitiate(payload, {
      onSuccess: (results) => {
        setReport(results.data);
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
    dispatch({ action: `focus-quarter-${quarter.name}` });
  };

  if (!report) {
    return <CircularProgress />;
  }

  if (state === 'edit') {
    return (
      <ChplQuarterEdit
        report={report}
        dispatch={handleDispatch}
      />
    );
  }

  if (state === 'view') {
    return (
      <ChplQuarterView
        report={report}
        dispatch={handleDispatch}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Card>
        <CardContent>
          <Typography variant="h4">
            <strong>
              { quarter.name }
              {' '}
              { year }
            </strong>
          </Typography>
          <Typography style={{ padding: '4px' }} variant="body2">{quarter.description}</Typography>
          {report.id
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
        </CardContent>
      </Card>
    </Box>
  );
}

export default ChplQuarter;

ChplQuarter.propTypes = {
  quarter: object.isRequired,
  dispatch: func.isRequired,
  year: number.isRequired,
  report: object,
  acb: object.isRequired,
};

ChplQuarter.defaultProps = {
  report: {},
};
