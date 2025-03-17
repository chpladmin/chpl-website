import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { number, oneOfType, string } from 'prop-types';

import ChplDeveloperEdit from './developer-edit';
import ChplDeveloperJoin from './developer-join';
import ChplDeveloperSplit from './developer-split';
import ChplDeveloperView from './developer-view';
import ChplVersionEdit from './version-edit';

import { useDeleteUserFromDeveloper, useFetchDeveloperHierarchy } from 'api/developer';
import { usePostCreateInvitation, usePostCreateOldInvitation } from 'api/users';
import ChplAttestationCreate from 'components/attestation/attestation-create';
import ChplAttestationEdit from 'components/attestation/attestation-edit';
import { getAngularService } from 'services/angular-react-helper';
import { AnalyticsContext, DeveloperContext, useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplDeveloperPage({ id }) {
  const $state = getAngularService('$state');
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isSuccess } = useFetchDeveloperHierarchy({ id });
  const { mutate: deleteUserFromDeveloper } = useDeleteUserFromDeveloper();
  const { mutate: createInvitation } = usePostCreateInvitation();
  const { mutate: createOldInvitation } = usePostCreateOldInvitation();
  const [changeRequest, setChangeRequest] = useState(undefined);
  const [developer, setDeveloper] = useState(undefined);
  const [version, setVersion] = useState(undefined);
  const [state, setState] = useState('view');
  const classes = useStyles();

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
      case 'createAttestation':
      case 'edit':
      case 'join':
      case 'split':
        setState(action);
        break;
      case 'editAttestation':
        setState(action);
        setChangeRequest(payload);
        break;
      case 'editVersion':
        setState(action);
        setVersion({ version: payload.version, productId: payload.productId });
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
      case 'invite':
        createOldInvitation({
          ...payload,
          emailAddress: payload.email,
          permissionObjectId: developer.id,
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
      case 'editProduct':
        $state.go('organizations.developers.developer.product.edit', {
          productId: payload.id,
        });
        break;
      case 'mergeProduct':
        $state.go('organizations.developers.developer.product.merge', {
          productId: payload.id,
        });
        break;
      case 'splitProduct':
        $state.go('organizations.developers.developer.product.split', {
          productId: payload.id,
        });
        break;
      case 'mergeVersion':
        $state.go('organizations.developers.developer.product.version.merge', {
          productId: payload.product.id,
          versionId: payload.version,
        });
        break;
      case 'splitVersion':
        $state.go('organizations.developers.developer.product.version.split', {
          productId: payload.product.id,
          versionId: payload.version,
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
        <Box className={classes.pageHeader}>
          <Container disableGutters maxWidth="lg">
            <Typography
              variant="h1"
            >
              { developer.name }
            </Typography>
          </Container>
        </Box>
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
                dispatch={handleDispatch}
              />
            )}
          { state === 'editVersion'
            && (
              <ChplVersionEdit
                dispatch={handleDispatch}
                productId={version.productId}
                version={version.version}
              />
            )}
          { state === 'join'
            && (
              <ChplDeveloperJoin
                dispatch={handleDispatch}
              />
            )}
          { state === 'split'
            && (
              <ChplDeveloperSplit
                dispatch={handleDispatch}
              />
            )}
          { state === 'createAttestation'
            && (
              <ChplAttestationCreate
                dispatch={handleDispatch}
              />
            )}
          { state === 'editAttestation'
            && (
              <ChplAttestationEdit
                dispatch={handleDispatch}
                changeRequest={changeRequest}
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
