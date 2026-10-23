import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import Skeleton from '@mui/material/Skeleton';
import { useSnackbar } from 'notistack';
import * as jsJoda from '@js-joda/core';
import { bool } from 'prop-types';
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
import ChplSystemMaintenanceLoading, { ChplSystemMaintenanceResults } from 'components/system-maintenance/system-maintenance-loading';
import { skeletonLineColor } from 'components/util';
import { UserContext } from 'shared/contexts';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
};

const loadingStyles = {
  // The Currently Scheduled System Jobs and Types of Jobs cards inside the
  // System Jobs card, outlined since they sit inside its skeleton card
  innerCard: {
    border: `1px solid ${skeletonLineColor}`,
    borderRadius: '8px',
  },
  innerCardHeader: {
    padding: '16px',
  },
};

function ChplSystemJobsLoading({ showTriggers }) {
  const renderCard = (titleWidth, results) => (
    <Box sx={loadingStyles.innerCard}>
      <Box sx={loadingStyles.innerCardHeader}>
        <Skeleton variant="text" width={titleWidth} height={32} />
      </Box>
      { results }
    </Box>
  );

  return (
    <ChplSystemMaintenanceLoading label="Loading system jobs">
      <Box sx={styles.container}>
        { showTriggers
          && renderCard('45%', <ChplSystemMaintenanceResults actions={1} cards={3} fieldGroups={[2, 2]} />)}
        { renderCard('25%', <ChplSystemMaintenanceResults actions={1} cards={4} fieldGroups={[2]} />)}
      </Box>
    </ChplSystemMaintenanceLoading>
  );
}

function ChplJobs() {
  const { hasAnyRole } = useContext(UserContext);
  const jobTypeQuery = useFetchJobTypes();
  const systemQuery = useFetchSystemTriggers({ isAuthenticated: hasAnyRole(['chpl-admin']) });
  const deleteTrigger = useDeleteTrigger();
  const postOneTimeTrigger = usePostOneTimeTrigger();
  const { enqueueSnackbar } = useSnackbar();
  const [job, setJob] = useState(undefined);
  const [jobTypes, setJobTypes] = useState([]);
  const [systemTriggers, setSystemTriggers] = useState([]);
  let handleDispatch;

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
        break;
      case 'delete':
        apiAction = deleteTrigger.mutate;
        message = payload.successMessage;
        break;
      case 'edit':
        setJob(payload);
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

  if (job) {
    return (
      <Card>
        <CardHeader title="Schedule System Job" />
        <CardContent>
          <ChplJobEdit
            job={job}
            dispatch={handleDispatch}
          />
        </CardContent>
      </Card>
    );
  }

  // isInitialLoading, since the system triggers query is disabled for anyone but an admin
  if (systemQuery.isInitialLoading || jobTypeQuery.isLoading) {
    return (
      <ChplSystemJobsLoading showTriggers={hasAnyRole(['chpl-admin'])} />
    );
  }

  return (
    <Card>
      <CardHeader
        style={{ paddingLeft: '16px' }}
        title={(
          <>
            System Jobs
            <PlayArrowOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </>
        )}
      />
      <CardContent>
        <Box sx={styles.container}>
          { systemQuery.isSuccess
            && (
              <ChplSystemTriggersView
                triggers={systemTriggers}
                dispatch={handleDispatch}
              />
            )}
          { jobTypeQuery.isSuccess && jobTypes.length > 0
            && (
              <ChplSystemJobTypesView
                jobTypes={jobTypes}
                dispatch={handleDispatch}
              />
            )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ChplJobs;

ChplJobs.propTypes = {
};

ChplSystemJobsLoading.propTypes = {
  showTriggers: bool.isRequired,
};
