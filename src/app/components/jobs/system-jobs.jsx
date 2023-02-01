import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as jsJoda from '@js-joda/core';
import '@js-joda/timezone';

import ChplJobEdit from './job-edit';
import ChplSystemJobTypesView from './system-job-types-view';
import ChplSystemTriggersView from './system-triggers-view';

import {
  useDeleteTrigger,
  useFetchJobTypes,
  useFetchSystemTriggers,
  usePostOneTimeTrigger,
} from 'api/jobs';
import { BreadcrumbContext, UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  titlePadding: {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
});

function ChplJobs() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { hasAnyRole } = useContext(UserContext);
  const jobTypeQuery = useFetchJobTypes();
  const systemQuery = useFetchSystemTriggers({ isAuthenticated: hasAnyRole(['ROLE_ADMIN']) });
  const deleteTrigger = useDeleteTrigger();
  const postOneTimeTrigger = usePostOneTimeTrigger();
  const { enqueueSnackbar } = useSnackbar();
  const [job, setJob] = useState(undefined);
  const [jobTypes, setJobTypes] = useState([]);
  const [systemTriggers, setSystemTriggers] = useState([]);
  const classes = useStyles();
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="systemJobs.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        System Jobs
      </Button>,
    );
    append(
      <Button
        key="systemJobs.viewall"
        depth={1}
        variant="text"
        onClick={() => handleDispatch({ action: 'close' })}
      >
        System Jobs
      </Button>,
    );
    display('systemJobs.viewall.disabled');
  }, []);

  useEffect(() => {
    if (jobTypeQuery.isLoading || !jobTypeQuery.isSuccess) { return; }
    setJobTypes(jobTypeQuery.data.filter((j) => j.group === 'systemJobs'));
  }, [jobTypeQuery.data, jobTypeQuery.isLoading, jobTypeQuery.isSuccess]);

  useEffect(() => {
    if (systemQuery.isLoading || !systemQuery.isSuccess) { return; }
    setSystemTriggers(systemQuery.data);
  }, [systemQuery.data, systemQuery.isLoading, systemQuery.isSuccess]);

  handleDispatch = ({ action, payload }) => {
    let apiAction;
    let message;
    let updated = { ...payload };
    switch (action) {
      case 'close':
        setJob(undefined);
        display('systemJobs.viewall.disabled');
        hide('systemJobs.viewall');
        hide('systemJobs.schedule.disabled');
        break;
      case 'delete':
        apiAction = deleteTrigger.mutate;
        message = payload.successMessage;
        break;
      case 'edit':
        setJob(payload);
        display('systemJobs.viewall');
        hide('systemJobs.viewall.disabled');
        break;
      case 'save':
        if (payload.group === 'systemJobs' && payload.runTime) {
          let runDate;
          if (typeof payload.runTime === 'string') {
            runDate = jsJoda.LocalDateTime
              .parse(payload.runTime)
              .atZone(jsJoda.ZoneId.of('America/New_York'));
          } else {
            runDate = payload.runTime
              .atZone(jsJoda.ZoneId.of('America/New_York'));
          }
          const runDateMillis = jsJoda.Instant
            .from(runDate)
            .toEpochMilli();
          apiAction = postOneTimeTrigger.mutate;
          message = 'Job created: one time job scheduled';
          updated = {
            job: payload,
            runDateMillis,
          };
        }
        break;
      case 'schedule':
        if (payload.group === 'systemJobs') {
          setJob(payload);
          display('systemJobs.viewall');
          hide('systemJobs.viewall.disabled');
        }
        break;
        // no default
    }
    if (apiAction) {
      apiAction(updated, {
        onSuccess: () => {
          enqueueSnackbar(message, {
            variant: 'success',
          });
          setJob(undefined);
          display('systemJobs.viewall.disabled');
          hide('systemJobs.viewall');
        },
        onError: (error) => {
          const errorMessage = error.response.data?.error
                || error.response.data?.errorMessages.join(' ');
          enqueueSnackbar(errorMessage, {
            variant: 'error',
          });
        },
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography className={classes.titlePadding} variant="h1">System Jobs</Typography>
      { !job
        && (
          <div className={classes.container}>
            <div>
              { (systemQuery.isLoading || !systemQuery.isSuccess)
                && (
                  <CircularProgress />
                )}
              { !systemQuery.isLoading && systemQuery.isSuccess
                && (
                  <ChplSystemTriggersView
                    triggers={systemTriggers}
                    dispatch={handleDispatch}
                  />
                )}
            </div>
            <div>
              { (jobTypeQuery.isLoading || !jobTypeQuery.isSuccess)
                && (
                  <CircularProgress />
                )}
              { !jobTypeQuery.isLoading && jobTypeQuery.isSuccess && jobTypes.length > 0
                && (
                  <ChplSystemJobTypesView
                    jobTypes={jobTypes}
                    dispatch={handleDispatch}
                  />
                )}
            </div>
          </div>
        )}
      { job
        && (
          <ChplJobEdit
            job={job}
            dispatch={handleDispatch}
          />
        )}
    </Container>
  );
}

export default ChplJobs;

ChplJobs.propTypes = {
};
