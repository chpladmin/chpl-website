import React, { useContext, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  makeStyles,
} from '@material-ui/core';
import { func, number, object } from 'prop-types';
import { useSnackbar } from 'notistack';

import { usePutVersion } from 'api/version';
import ChplVersion from 'components/version/version';
import { eventTrack } from 'services/analytics.service';
import { DeveloperContext, UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  pageContainer: {
    padding: '32px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gridGap: '16px',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
});

function ChplEditVersion({ dispatch, productId, version }) {
  const { analytics } = useAnalyticsContext();
  const { developer } = useContext(DeveloperContext);
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePutVersion();
  const [errorMessages, setErrorMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        dispatch('cancel');
        break;
      case 'save':
        console.log(action, payload);
        setIsProcessing(true);
        eventTrack({
          ...analytics,
          event: 'Save Version',
        });
        setErrorMessages([]);
        mutate({
          ...payload,
          versionIds: [payload.id],
          newProductId: productId,
        }, {
          onSuccess: (response) => {
            setIsProcessing(false);
            console.log({response});
            let body;
            if (body) {
              enqueueSnackbar(body, {
                variant: 'error',
              });
            }
          },
          onError: (error) => {
            setIsProcessing(false);
            console.log({error});
            let body = error?.response?.data?.error;
            if (body) {
              enqueueSnackbar(body, {
                variant: 'error',
              });
            }
          },
        });
        break;
        // no default
    }
  };

  if (!version) { return <CircularProgress />; }

  return (
    <Container disableGutters maxWidth="lg">
      <Box className={classes.pageContainer}>
        <ChplVersion
          dispatch={handleDispatch}
          version={version}
          isEditing
          isProcessing={isProcessing}
          errorMessages={errorMessages}
        />
      </Box>
    </Container>
  );
}

export default ChplEditVersion;

ChplEditVersion.propTypes = {
  dispatch: func.isRequired,
  productId: number.isRequired,
  version: object.isRequired,
};
