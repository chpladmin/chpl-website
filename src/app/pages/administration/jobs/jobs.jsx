import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as jsJoda from '@js-joda/core';
import '@js-joda/timezone';

import ChplJobEdit from './job-edit';
import ChplJobTypesView from './job-types-view';
import ChplSystemJobsView from './system-jobs-view';
import ChplUserJobsView from './user-jobs-view';

import { useFetchAcbs } from 'api/acbs';
import {
  useDeleteTrigger,
  useFetchJobTypes,
  useFetchSystemJobs,
  useFetchUserJobs,
  usePostJob,
  usePostOneTimeJob,
  usePutJob,
  usePutTrigger,
} from 'api/jobs';
import { UserContext } from 'shared/contexts';
import theme from 'themes/theme';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  fullWidth: {
    gridColumnStart: '1',
    gridColumnEnd: '-1',
  },
});

function ChplJobs() {
  const { hasAnyRole } = useContext(UserContext);
  const acbQuery = useFetchAcbs();
  const jobTypeQuery = useFetchJobTypes();
  const systemQuery = useFetchSystemJobs({ isAuthenticated: hasAnyRole(['ROLE_ADMIN']) });
  const userQuery = useFetchUserJobs();
  const deleteTrigger = useDeleteTrigger();
  const postJob = usePostJob();
  const postOneTimeJob = usePostOneTimeJob();
  const putJob = usePutJob();
  const putTrigger = usePutTrigger();
  const { enqueueSnackbar } = useSnackbar();
  const [acbs, setAcbs] = useState([]);
  const [job, setJob] = useState(undefined);
  const [jobTypes, setJobTypes] = useState([]);
  const [systemJobs, setSystemJobs] = useState([]);
  const [userJobs, setUserJobs] = useState([]);
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
    setSystemJobs(systemQuery.data);
  }, [systemQuery.data, systemQuery.isLoading, systemQuery.isSuccess]);

  useEffect(() => {
    if (userQuery.isLoading || !userQuery.isSuccess) { return; }
    setUserJobs(userQuery.data);
  }, [userQuery.data, userQuery.isLoading, userQuery.isSuccess]);

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'close':
        setJob(undefined);
        break;
      case 'delete':
        deleteTrigger.mutate(payload, {
          onSuccess: () => {
            const message = 'Job deleted: Recurring job deleted';
            enqueueSnackbar(message, {
              variant: 'success',
            });
            setJob(undefined);
          },
          onError: (error) => {
            const message = error.response.data?.error
                  || error.response.data?.errorMessages.join(' ');
            enqueueSnackbar(message, {
              variant: 'error',
            });
          },
        });
        break;
      case 'edit':
        if (payload.job) {
          setJob(payload);
        } else if (payload.jobDataMap.editableJobFields) {
          setJob(payload);
        } else {
          console.log({ trace: 'jobs.jsx - edit-else', action, payload });
        }
        break;
      case 'save':
        if (payload.job && !payload.name) {
          postJob.mutate(payload, {
            onSuccess: () => {
              const message = 'Job created: Recurring job scheduled';
              enqueueSnackbar(message, {
                variant: 'success',
              });
              setJob(undefined);
            },
            onError: (error) => {
              const message = error.response.data?.error
                    || error.response.data?.errorMessages.join(' ');
              enqueueSnackbar(message, {
                variant: 'error',
              });
            },
          });
        } else if (payload.job && payload.name) {
          putTrigger.mutate(payload, {
            onSuccess: () => {
              const message = 'Job updated: Recurring job updated';
              enqueueSnackbar(message, {
                variant: 'success',
              });
              setJob(undefined);
            },
            onError: (error) => {
              const message = error.response.data?.error
                    || error.response.data?.errorMessages.join(' ');
              enqueueSnackbar(message, {
                variant: 'error',
              });
            },
          });
        } else if (payload.jobDataMap.editableJobFields) {
          putJob.mutate(payload, {
            onSuccess: () => {
              const message = 'Job updated';
              enqueueSnackbar(message, {
                variant: 'success',
              });
              setJob(undefined);
            },
            onError: (error) => {
              const message = error.response.data?.error
                    || error.response.data?.errorMessages.join(' ');
              enqueueSnackbar(message, {
                variant: 'error',
              });
            },
          });
        } else if (payload.group === 'systemJobs' && payload.runTime) {
          const runDateMillis = jsJoda.Instant
            .from(jsJoda.LocalDateTime
              .parse(payload.runTime)
              .atZone(jsJoda.ZoneId.of('America/New_York')))
            .toEpochMilli();
          postOneTimeJob.mutate({
            job: payload,
            runDateMillis,
          }, {
            onSuccess: () => {
              const message = 'Job created: one time job scheduled';
              enqueueSnackbar(message, {
                variant: 'success',
              });
              setJob(undefined);
            },
            onError: (error) => {
              const message = error.response.data?.error
                    || error.response.data?.errorMessages.join(' ');
              enqueueSnackbar(message, {
                variant: 'error',
              });
            },
          });
        } else {
          console.log({ trace: 'jobs.jsx - save-else', action, payload });
        }
        break;
      case 'schedule':
        if (payload.group === 'systemJobs') {
          setJob(payload);
        } else if (payload.group === 'chplJobs') {
          setJob({ job: payload });
        } else {
          console.log({ trace: 'jobs.jsx - schedule-else', action, payload });
        }
        break;
      default:
        console.log({ trace: 'jobs.jsx - switch-default', action, payload });
        // no default
    }
  };

  return (
    <>
      <Typography variant="h1">Scheduled Jobs</Typography>
      { !job
        && (
          <div className={classes.container}>
            <div className={ hasAnyRole(['ROLE_ADMIN']) ? '' : classes.fullWidth }>
              <ChplUserJobsView
                acbs={acbs}
                jobs={userJobs}
                dispatch={handleDispatch}
              />
            </div>
            { hasAnyRole(['ROLE_ADMIN'])
              && (
                <ChplSystemJobsView
                  jobs={systemJobs}
                />
              )}
            <div className={classes.fullWidth}>
              <ChplJobTypesView
                jobTypes={jobTypes}
                dispatch={handleDispatch}
              />
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
    </>
  );
}

export default ChplJobs;

ChplJobs.propTypes = {
};
