import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  number,
  object,
  string,
} from 'prop-types';
import { useSnackbar } from 'notistack';

import ChplQuarterView from './quarter-view';

import { usePostQuarterlyReportRequest } from 'api/surveillance';
import { ChplTextField } from 'components/util';
import { UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplQuarter({
  quarter,
  year,
  dispatch,
  report,
}) {
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostQuarterlyReportRequest()
  const [state, setState] = useState('summary');
  const classes = useStyles();

  useEffect(() => {
    console.log(report, year);
  }, [report, year]);

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

  const handleDispatch = ({action, payload}) => {
    switch (action) {
      case 'cancel':
        setState('summary');
        dispatch({ action: 'cancel' });
        break;
      default:
        dispatch({action, payload});
    }
  };

  const view = () => {
    setState('view');
    dispatch({ action: `focus-quarter-${quarter.name}` });
  };

  return (
    <Card>
    <CardHeader title={`${quarter.name} ${year}`} />
      <CardContent>
        { state === 'view'
          && (
            <ChplQuarterView
              report={report}
              dispatch={handleDispatch}
            />
          )}
        { state === 'summary'
          && (
            <>
              { quarter.description }
              { report.id
                && (
                  <>
                    { hasAnyRole(['chpl-admin', 'chpl-onc-acb'])
                      && (
                        <Button>Edit</Button>
                      )}
                    { hasAnyRole(['chpl-admin', 'chpl-onc']) // remove admin before deployment
                      && (
                        <Button
                          onClick={view}
                        >
                          View
                        </Button>
                      )}
                    <Button
                      onClick={download}
                    >
                      Download
                    </Button>
                  </>
                )}
              { !report.id && hasAnyRole(['chpl-admin', 'chpl-onc-acb'])
                && (
                  <Button>Initiate</Button>
                )}
            </>
          )}
      </CardContent>
    </Card>
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
}
