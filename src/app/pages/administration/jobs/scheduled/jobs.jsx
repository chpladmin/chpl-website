import React, { useEffect, useState } from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplJobEdit from './job-edit';
import ChplJobTypesView from './job-types-view';
import ChplSystemJobsView from './system-jobs-view';
import ChplUserJobsView from './user-jobs-view';

import { useFetchAcbs } from 'api/acbs';
import {
  useDeleteJob,
  useFetchJobTypes,
  useFetchSystemJobs,
  useFetchUserJobs,
  usePostJob,
  usePostOneTimeJob,
  usePutJob,
} from 'api/jobs';
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
  const acbQuery = useFetchAcbs();
  const jobTypeQuery = useFetchJobTypes();
  const systemQuery = useFetchSystemJobs();
  const userQuery = useFetchUserJobs();
  const { mutate: remove } = useDeleteJob();
  const { mutate: post } = usePostJob();
  const postOneTimeJob = usePostOneTimeJob();
  const { mutate: put } = usePutJob();
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

  const deleteJob = (request) => {
    remove(request, {
      onError: (error) => {
        const message = error.response.data?.error
              || error.response.data?.errorMessages.join(' ');
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  const save = (request) => {
    const mutate = request.id ? put : post;
    mutate({
      ...request,
    }, {
      onError: (error) => {
        const message = error.response.data?.error
              || error.response.data?.errorMessages.join(' ');
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'close':
        setJob(undefined);
        break;
      case 'edit':
        if (payload.jobDataMap.editableJobFields) {
          setJob(payload);
        } else {
          console.log({ trace: 'jobs.jsx - edit-else', action, payload });
        }
        break;
      case 'save':
        if (payload.group === 'systemJobs' && payload.runTime) {
          postOneTimeJob.mutate({
            job: payload,
            runDateMillis: payload.runTime,
          }, {
            onSuccess: () => {
              const message = 'Job created: one time job scheduled'
              enqueueSnackbar(message, {
                variant: 'success',
              });
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
          setJob(payload);
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
            <ChplUserJobsView
              acbs={acbs}
              jobs={userJobs}
              dispatch={handleDispatch}
            />
            <ChplSystemJobsView
              jobs={systemJobs}
            />
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
