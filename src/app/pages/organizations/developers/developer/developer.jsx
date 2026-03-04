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
import ChplProductEdit from './product-edit';
import ChplProductMerge from './product-merge';
import ChplProductSplit from './product-split';
import ChplVersionEdit from './version-edit';
import ChplVersionMerge from './version-merge';
import ChplVersionSplit from './version-split';

import { useDeleteUserFromDeveloper, useFetchDeveloperHierarchy } from 'api/developer';
import { usePostCreateInvitation } from 'api/users';
import ChplAttestationCreate from 'components/attestation/attestation-create';
import ChplAttestationEdit from 'components/attestation/attestation-edit';
import ChplSbulCreate from 'components/sbul/sbul-create';
import { AnalyticsContext, DeveloperContext, useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  fixFooterSpacing: {
    minHeight: 'calc(100vh)',
  },
});

function ChplDeveloperPage({ id }) {
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isSuccess } = useFetchDeveloperHierarchy({ id });
  const { mutate: deleteUserFromDeveloper } = useDeleteUserFromDeveloper();
  const { mutate: createInvitation } = usePostCreateInvitation();
  const [changeRequest, setChangeRequest] = useState(undefined);
  const [developer, setDeveloper] = useState(undefined);
  const [product, setProduct] = useState(undefined);
  const [version, setVersion] = useState(undefined);
  // const [state, setState] = useState('view');
  const [state, setState] = useState('createSbul');
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
      case 'createSbul':
      case 'edit':
      case 'join':
      case 'split':
        setState(action);
        break;
      case 'editAttestation':
        setState(action);
        setChangeRequest(payload);
        break;
      case 'editProduct':
        setState(action);
        setProduct(payload);
        break;
      case 'editVersion':
        setState(action);
        setVersion({ version: payload.version, productId: payload.productId });
        break;
      case 'invite':
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
      case 'mergeProduct':
        setState(action);
        setProduct(payload);
        break;
      case 'splitProduct':
        setState(action);
        setProduct(payload);
        break;
      case 'mergeVersion':
        setState(action);
        setProduct(developer.products.find((p) => p.id === payload.product.id));
        setVersion(payload.product.versions.find((v) => v.id === payload.version));
        break;
      case 'splitVersion':
        setState(action);
        setVersion(payload.product.versions.find((v) => v.id === payload.version));
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
        <Container className={classes.fixFooterSpacing} maxWidth="lg" id="main-content" tabIndex="-1">
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
          { state === 'editProduct'
            && (
              <ChplProductEdit
                dispatch={handleDispatch}
                productId={product.productId}
                product={product}
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
          { state === 'mergeProduct'
            && (
              <ChplProductMerge
                dispatch={handleDispatch}
                developer={developer}
                product={product}
              />
            )}
          { state === 'mergeVersion'
            && (
              <ChplVersionMerge
                dispatch={handleDispatch}
                product={product}
                version={version}
              />
            )}
          { state === 'split'
            && (
              <ChplDeveloperSplit
                dispatch={handleDispatch}
              />
            )}
          { state === 'splitProduct'
            && (
              <ChplProductSplit
                dispatch={handleDispatch}
                product={product}
              />
            )}
          { state === 'splitVersion'
            && (
              <ChplVersionSplit
                dispatch={handleDispatch}
                version={version}
              />
            )}
          { state === 'createAttestation'
            && (
              <ChplAttestationCreate
                dispatch={handleDispatch}
              />
            )}
          { state === 'createSbul'
            && (
              <ChplSbulCreate
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
