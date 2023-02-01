import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { useFetchAcbs } from 'api/acbs';
import {
  useDeleteTrigger,
  useFetchJobTypes,
  useFetchUserTriggers,
  usePostTrigger,
  usePutJob,
  usePutTrigger,
} from 'api/jobs';
import ChplJobEdit from 'components/jobs/job-edit';
import ChplJobTypesView from 'components/jobs/job-types-view';
import ChplUserTriggersView from 'components/jobs/user-triggers-view';

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

function ChplReports() {
  const acbQuery = useFetchAcbs(true);
  const jobTypeQuery = useFetchJobTypes();
  const userQuery = useFetchUserTriggers();
  const deleteTrigger = useDeleteTrigger();
  const postTrigger = usePostTrigger();
  const putJob = usePutJob();
  const putTrigger = usePutTrigger();
  const { enqueueSnackbar } = useSnackbar();
  const [acbs, setAcbs] = useState([]);
  const [job, setJob] = useState(undefined);
  const [jobTypes, setJobTypes] = useState([]);
  const [userTriggers, setUserTriggers] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (acbQuery.isLoading || !acbQuery.isSuccess) { return; }
    setAcbs(acbQuery.data.acbs);
  }, [acbQuery.data, acbQuery.isLoading, acbQuery.isSuccess]);

  useEffect(() => {
    if (jobTypeQuery.isLoading || !jobTypeQuery.isSuccess) { return; }
    setJobTypes(jobTypeQuery.data.filter((j) => j.group === 'chplJobs'));
  }, [jobTypeQuery.data, jobTypeQuery.isLoading, jobTypeQuery.isSuccess]);

  useEffect(() => {
    if (userQuery.isLoading || !userQuery.isSuccess) { return; }
    setUserTriggers(userQuery.data);
  }, [userQuery.data, userQuery.isLoading, userQuery.isSuccess]);

  const handleDispatch = ({ action, payload }) => {
    let apiAction;
    let message;
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
          message = 'Report created: Recurring report scheduled';
        } else if (payload.job && payload.name) {
          apiAction = putTrigger.mutate;
          message = 'Report updated: Recurring report updated';
        } else if (payload.jobDataMap.editableJobFields) {
          apiAction = putJob.mutate;
          message = 'Report updated';
        }
        break;
      case 'schedule':
        if (payload.group === 'chplJobs') {
          setJob({ job: payload });
        }
        break;
        // no default
    }
    if (apiAction) {
      apiAction(payload, {
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
      <Typography className={classes.titlePadding} variant="h1">Scheduled Reports</Typography>
      { !job
        && (
          <div className={classes.container}>
            <div>
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
            <div>
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

export default ChplReports;

ChplReports.propTypes = {
};
