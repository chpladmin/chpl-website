import React, { useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as jsJoda from '@js-joda/core';
import '@js-joda/timezone';

import ChplJobEdit from './job-edit';
import ChplJobTypesView from './job-types-view';
import ChplSystemTriggersView from './system-triggers-view';
import ChplUserTriggersView from './user-triggers-view';

import { useFetchAcbs } from 'api/acbs';
import {
  useDeleteTrigger,
  useFetchJobTypes,
  useFetchSystemTriggers,
  useFetchUserTriggers,
  usePostTrigger,
  usePostOneTimeTrigger,
  usePutJob,
  usePutTrigger,
} from 'api/jobs';
import { UserContext } from 'shared/contexts';
import theme from 'themes/theme';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    [theme.breakpoints.up('lg')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    },
  },
  fullWidth: {
    gridColumnStart: '1',
    gridColumnEnd: '-1',
  },
  titlePadding: {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
});

function ChplJobs() {
  const { hasAnyRole } = useContext(UserContext);
  const acbQuery = useFetchAcbs(true);
  const jobTypeQuery = useFetchJobTypes();
  const systemQuery = useFetchSystemTriggers({ isAuthenticated: hasAnyRole(['ROLE_ADMIN']) });
  const userQuery = useFetchUserTriggers();
  const deleteTrigger = useDeleteTrigger();
  const postTrigger = usePostTrigger();
  const postOneTimeTrigger = usePostOneTimeTrigger();
  const putJob = usePutJob();
  const putTrigger = usePutTrigger();
  const { enqueueSnackbar } = useSnackbar();
  const [acbs, setAcbs] = useState([]);
  const [job, setJob] = useState(undefined);
  const [jobTypes, setJobTypes] = useState([]);
  const [systemTriggers, setSystemTriggers] = useState([]);
  const [userTriggers, setUserTriggers] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (acbQuery.isLoading || !acbQuery.isSuccess) { return; }
    setAcbs(acbQuery.data.acbs);
  }, [acbQuery.data, acbQuery.isLoading, acbQuery.isSuccess]);

  useEffect(() => {
    if (jobTypeQuery.isLoading || !jobTypeQuery.isSuccess) { return; }
    setJobTypes(jobTypeQuery.data);
  }, [jobTypeQuery.data, jobTypeQuery.isLoading, jobTypeQuery.isSuccess]);

  useEffect(() => {
    if (systemQuery.isLoading || !systemQuery.isSuccess) { return; }
    setSystemTriggers(systemQuery.data);
  }, [systemQuery.data, systemQuery.isLoading, systemQuery.isSuccess]);

  useEffect(() => {
    if (userQuery.isLoading || !userQuery.isSuccess) { return; }
    setUserTriggers(userQuery.data);
  }, [userQuery.data, userQuery.isLoading, userQuery.isSuccess]);

  const handleDispatch = ({ action, payload }) => {
    let apiAction;
    let message;
    let updated = { ...payload };
    switch (action) {
      case 'close':
        setJob(undefined);
        break;
      case 'delete':
        apiAction = deleteTrigger.mutate;
        message = payload.successMessage;
        break;
      case 'edit':
        setJob(payload);
        break;
      case 'save':
        if (payload.job && !payload.name) {
          apiAction = postTrigger.mutate;
          message = 'Job created: Recurring job scheduled';
        } else if (payload.job && payload.name) {
          apiAction = putTrigger.mutate;
          message = 'Job updated: Recurring job updated';
        } else if (payload.jobDataMap.editableJobFields) {
          apiAction = putJob.mutate;
          message = 'Job updated';
        } else if (payload.group === 'systemJobs' && payload.runTime) {
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
        } else if (payload.group === 'chplJobs') {
          setJob({ job: payload });
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
      <Typography className={classes.titlePadding} variant="h1">Scheduled Jobs</Typography>
      { !job
        && (
          <div className={classes.container}>
            <div className={hasAnyRole(['ROLE_ADMIN']) ? '' : classes.fullWidth}>
              { (userQuery.isLoading || !userQuery.isSuccess)
                && (
                  <CircularProgress />
                )}
              { !userQuery.isLoading && userQuery.isSuccess
                && (
                  <ChplUserTriggersView
                    acbs={acbs}
                    triggers={userTriggers}
                    dispatch={handleDispatch}
                  />
                )}
            </div>
            { hasAnyRole(['ROLE_ADMIN'])
              && (
                <>
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
                </>
              )}
            <div className={classes.fullWidth}>
              { (jobTypeQuery.isLoading || !jobTypeQuery.isSuccess)
                && (
                  <CircularProgress />
                )}
              { !jobTypeQuery.isLoading && jobTypeQuery.isSuccess && jobTypes.length > 0
                && (
                  <ChplJobTypesView
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
            acbs={acbs}
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
