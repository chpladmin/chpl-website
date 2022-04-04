import React, { useEffect, useState } from 'react';
import {
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplJobTypesView from './job-types-view';
import ChplSystemJobsView from './system-jobs-view';
import ChplUserJobsView from './user-jobs-view';

import {
  useDeleteJob,
  useFetchJobTypes,
  useFetchSystemJobs,
  useFetchUserJobs,
  usePostJob,
  usePutJob,
} from 'api/jobs';

function ChplJobs() {
  const jobTypeQuery = useFetchJobTypes();
  const systemQuery = useFetchSystemJobs();
  const userQuery = useFetchUserJobs();
  const { mutate: remove } = useDeleteJob();
  const { mutate: post } = usePostJob();
  const { mutate: put } = usePutJob();
  const { enqueueSnackbar } = useSnackbar();
  const [userJobs, setUserJobs] = useState([]);
  const [systemJobs, setSystemJobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  useEffect(() => {
    if (jobTypeQuery.isLoading || !jobTypeQuery.isSuccess) {
      return;
    }
    setJobTypes(jobTypeQuery.data);
  }, [jobTypeQuery.data, jobTypeQuery.isLoading, jobTypeQuery.isSuccess]);

  useEffect(() => {
    if (systemQuery.isLoading || !systemQuery.isSuccess) {
      return;
    }
    setSystemJobs(systemQuery.data);
  }, [systemQuery.data, systemQuery.isLoading, systemQuery.isSuccess]);

  useEffect(() => {
    if (userQuery.isLoading || !userQuery.isSuccess) {
      return;
    }
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

  const handleDispatch = (action, payload) => {
    switch (action) {
      default:
        console.log({file: 'jobs.jsx', action, payload});
        // no default
    }
  };

  return (
    <>
      <Typography variant="h1">Scheduled Jobs</Typography>
      <ChplUserJobsView
        jobs={userJobs}
        dispatch={handleDispatch}
      />
      <ChplSystemJobsView
        jobs={systemJobs}
        dispatch={handleDispatch}
      />
      <ChplJobTypesView
        jobTypes={jobTypes}
        dispatch={handleDispatch}
      />
    </>
  );
}

export default ChplJobs;

ChplJobs.propTypes = {
};
