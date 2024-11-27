import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Container,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { number, oneOfType, string } from 'prop-types';

import ChplDeveloperEdit from './edit';
import ChplDeveloperSplit from './developer-split';
import ChplDeveloperView from './developer-view';

import { useDeleteUserFromDeveloper, useFetchDeveloperHierarchy } from 'api/developer';
import { usePostCreateInvitation } from 'api/users';
import { getAngularService } from 'services/angular-react-helper';
import { AnalyticsContext, DeveloperContext, useAnalyticsContext } from 'shared/contexts';

function ChplDeveloperPage({ id }) {
  const $state = getAngularService('$state');
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isSuccess } = useFetchDeveloperHierarchy({ id });
  const { mutate: deleteUserFromDeveloper } = useDeleteUserFromDeveloper();
  const { mutate: createInvitation } = usePostCreateInvitation();
  const [developer, setDeveloper] = useState(undefined);
  const [state, setState] = useState('view');

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setDeveloper(data);
  }, [data, isLoading, isSuccess]);

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        setState('view');
        break;
      case 'edit':
      case 'split':
        setState(action);
        break;
      case 'join':
        $state.go(`organizations.developers.developer.${action}`);
        break;
      case 'cognito-invite':
        createInvitation({
          ...payload,
          organizationId: developer.id,
        }, {
          onSuccess: () => {
            enqueueSnackbar(`Email sent successfully to ${payload.email}`, {
              variant: 'success',
            });
          },
          onError: (error) => {
            enqueueSnackbar(error.data?.error ?? 'An unexpected error has occurred.', {
              variant: 'error',
            });
          },
        });
        break;
      case 'impersonate':
        break;
      case 'delete':
        deleteUserFromDeveloper({ userId: payload, id: developer.id }, {
          onSuccess: () => {
            enqueueSnackbar('User removed', {
              variant: 'success',
            });
          },
          onError: () => {
            enqueueSnackbar('An unexpected error has occurred.', {
              variant: 'error',
            });
          },
        });
        break;
      default:
        console.error(`Unknown action: ${action} with payload: ${JSON.stringify(payload)}`);
    }
  };

  if (isLoading || !isSuccess || !developer) {
    return <CircularProgress />;
  }

  const developerState = {
    developer,
  };

  const analyticsData = {
    analytics: {
      ...analytics,
      category: 'Developer',
      label: developer.name,
    },
  };

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <DeveloperContext.Provider value={developerState}>
        <Container maxWidth="lg">
          <Typography
            variant="h1"
          >
            { developer.name }
          </Typography>
        </Container>
        <Container maxWidth="lg" id="main-content" tabIndex="-1">
          { state === 'view'
            && (
              <ChplDeveloperView
                dispatch={handleDispatch}
              />
            )}
          { state === 'edit'
            && (
              <ChplDeveloperEdit
                developer={developer}
                dispatch={handleDispatch}
              />
            )}
          { state === 'split'
            && (
              <ChplDeveloperSplit
                dispatch={handleDispatch}
              />
            )}
        </Container>
      </DeveloperContext.Provider>
    </AnalyticsContext.Provider>
  );
}

export default ChplDeveloperPage;

ChplDeveloperPage.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
