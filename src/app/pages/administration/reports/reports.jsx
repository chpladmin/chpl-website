import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
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
import ChplReportJobTypesView from 'components/jobs/report-job-types-view';
import ChplUserTriggersView from 'components/jobs/user-triggers-view';
import {
  ChplLoadingTable,
  ChplPageBody,
  ChplPageHeader,
  ChplSkeletonCard,
} from 'components/util';
import { utilStyles } from 'themes';

const styles = {
  containerTrigger: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
};

// Same layout as the loaded page: the Currently Scheduled Reports card, with its
// result count, sort control and report cards, over the Types of Reports table
const loadingStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  header: {
    padding: '16px',
  },
  content: {
    padding: '16px',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '0 16px',
  },
  result: {
    borderRadius: '8px',
  },
};

function ChplReportsLoading() {
  return (
    <Box sx={loadingStyles.container} role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>Loading scheduled reports</Box>
      <ChplSkeletonCard>
        <Box aria-hidden="true">
          <Box sx={loadingStyles.header}>
            <Skeleton variant="text" width="30%" height={32} />
          </Box>
          <Box sx={loadingStyles.content}>
            <Box sx={loadingStyles.resultsHeader}>
              <Skeleton variant="text" width="25%" height={24} />
              <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: '4px' }} />
            </Box>
            <Box sx={loadingStyles.results}>
              {[...Array(3)].map((_result, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <Skeleton key={idx} variant="rectangular" height={140} sx={loadingStyles.result} />
              ))}
            </Box>
          </Box>
        </Box>
      </ChplSkeletonCard>
      <ChplSkeletonCard>
        <Box aria-hidden="true">
          <Box sx={loadingStyles.header}>
            <Skeleton variant="text" width="25%" height={32} />
          </Box>
          <Box sx={loadingStyles.content}>
            <ChplLoadingTable columns={4} rows={8} showControls={false} framed={false} />
          </Box>
        </Box>
      </ChplSkeletonCard>
    </Box>
  );
}

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

  // Both cards wait together, so neither appears beside a skeleton, and so do
  // the ONC-ACBs the scheduled reports are labelled with. The effects above copy
  // each result into state a render after it arrives, so wait for those too
  if (acbQuery.isLoading || jobTypeQuery.isLoading || userQuery.isLoading
      || (acbQuery.data?.acbs?.length > 0 && acbs.length === 0)
      || (jobTypeQuery.data?.some((j) => j.group === 'chplJobs') && jobTypes.length === 0)
      || (userQuery.data?.length > 0 && userTriggers.length === 0)) {
    return (
      <>
        <ChplPageHeader text="Scheduled Reports" />
        <ChplPageBody>
          <ChplReportsLoading />
        </ChplPageBody>
      </>
    );
  }

  return (
    <>
      <ChplPageHeader text="Scheduled Reports" />
      <ChplPageBody>
        { !job
          && (
            <Box sx={styles.containerTrigger}>
              <ChplUserTriggersView
                acbs={acbs}
                triggers={userTriggers}
                dispatch={handleDispatch}
              />
              { jobTypes.length > 0
                && (
                  <ChplReportJobTypesView
                    jobTypes={jobTypes}
                    dispatch={handleDispatch}
                  />
                )}
            </Box>
          )}
        { job
          && (
            <ChplJobEdit
              acbs={acbs}
              job={job}
              dispatch={handleDispatch}
            />
          )}
      </ChplPageBody>
    </>
  );
}

export default ChplReports;

ChplReports.propTypes = {
};
