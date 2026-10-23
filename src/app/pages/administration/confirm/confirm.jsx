import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from '@mui/material/Skeleton';
import { number, oneOfType, string } from 'prop-types';
import { useSnackbar } from 'notistack';

import { useConfirmPendingListing, useFetchPendingListing, useRejectPendingListing } from 'api/pending-listings';
import { ChplActionBar, useActionBar } from 'components/action-bar';
import {
  ChplConfirmDeveloper,
  ChplConfirmListing,
  ChplConfirmProduct,
  ChplConfirmProgress,
  ChplConfirmStepLoading,
  ChplConfirmVersion,
} from 'components/listing/confirm';
import { ChplSkeletonCard } from 'components/util';
import { goToState } from 'services/navigation.service';
import { PendingListingContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const replaceDeveloperCode = (chplProductNumber, code) => {
  const parts = chplProductNumber.split('.');
  parts[3] = code;
  return parts.join('.');
};

const styles = {
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: '16px',
    gap: '16px',
  },
  menuItems: {
    padding: '8px',
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: '#000',
      backgroundColor: '#f9f9f9',
      fontWeight: 600,
    },
  },
  snackbarActions: {
    display: 'flex',
    gap: '8px',
    paddingRight: '8px',
    pointerEvents: 'auto',
  },
  snackbarIcon: {
    marginLeft: '4px',
  },
};

// Same layout as the loaded wizard: the listing's heading, the stepper with its
// Back and Next tab, then the Developer step it opens on
const loadingStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: '16px',
    gap: '16px',
  },
  stepper: {
    borderRadius: '64px',
    height: '56px',
  },
  stepperButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '-16px',
  },
  buttons: {
    borderRadius: '0 0 32px 32px',
  },
};

function ChplConfirmLoading() {
  return (
    <Container maxWidth="lg" role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>Loading pending listing</Box>
      <Box sx={loadingStyles.container} aria-hidden="true">
        <Container maxWidth="md">
          <Skeleton variant="text" width="50%" height={32} />
        </Container>
        <Container maxWidth="md" disableGutters>
          <ChplSkeletonCard sx={loadingStyles.stepper}>
            <Box />
          </ChplSkeletonCard>
        </Container>
        <Box sx={loadingStyles.stepperButtons}>
          <Skeleton variant="rectangular" width={190} height={40} sx={loadingStyles.buttons} />
        </Box>
        <ChplConfirmStepLoading announce={false} />
      </Box>
    </Container>
  );
}

function ChplConfirm({ id }) {
  const { data: pendingListing, isLoading, isSuccess } = useFetchPendingListing({ id });
  const { mutate: confirmListing } = useConfirmPendingListing();
  const { mutate: rejectListing } = useRejectPendingListing();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pending, setPending] = useState(undefined);
  const [stage, setStage] = useState('developer');
  const [staged, setStaged] = useState(undefined);
  const [uploaded, setUploaded] = useState(undefined);
  const [warnings, setWarnings] = useState([]);
  let updateActionBar;

  useEffect(() => {
    if (!uploaded) { return; }
    setStaged(() => ({
      ...uploaded.developer,
    }));
  }, [uploaded]);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setUploaded(pendingListing);
    setPending(pendingListing);
    setErrors(pendingListing.errorMessages);
    setWarnings(pendingListing.warningMessages);
  }, [pendingListing, isLoading, isSuccess]);

  const canAct = (action) => {
    switch (action) {
      case 'confirm': return stage === 'listing' && !isSubmitting;
      case 'next': return stage !== 'listing';
      case 'previous': return stage !== 'developer';
        // no default
    }
    return false;
  };

  const cancel = () => {
    goToState('^', {}, { reload: true });
  };

  const confirm = () => {
    setIsSubmitting(true);
    confirmListing({
      listing: pending,
      acknowledgeWarnings,
    }, {
      onSuccess: (result) => {
        enqueueSnackbar('The Listing has been confirmed', {
          variant: 'success',
          action: (key) => (
            <Box sx={styles.snackbarActions}>
              <Button
                color="inherit"
                variant="outlined"
                sx={{ marginRight: '4px' }}
                onClick={() => {
                  window.location.href = `#/listing/${result.data.id}`;
                  closeSnackbar(key);
                }}
              >
                View Listing
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => closeSnackbar(key)}
              >
                Dismiss
                <CloseIcon sx={styles.snackbarIcon} />
              </Button>
            </Box>
          ),
        });
        setIsSubmitting(false);
        cancel();
      },
      onError: (error) => {
        if (error.response.data.contact) {
          enqueueSnackbar('The Listing was already resolved', {
            variant: 'error',
          });
          setIsSubmitting(false);
          cancel();
        } else if (error.response.data?.error) {
          enqueueSnackbar(error.response.data.error, {
            variant: 'error',
          });
          setIsSubmitting(false);
          cancel();
        } else if (error.response.data.errorMessages?.length > 0 || error.response.data.warningMessages?.length > 0) {
          setErrors(error.response.data.errorMessages);
          setWarnings(error.response.data.warningMessages);
          if (error.response.data.warningMessages?.length > 0) {
            updateActionBar({ showWarningAcknowledgement: true });
          } else {
            updateActionBar({ showWarningAcknowledgement: false });
            setAcknowledgeWarnings(false);
          }
          setIsSubmitting(false);
        } else {
          enqueueSnackbar('An error occurred', {
            variant: 'error',
          });
          setIsSubmitting(false);
        }
      },
    });
  };

  const reject = () => {
    rejectListing(id, {
      onSuccess: () => {
        enqueueSnackbar('The pending Listing has been removed', {
          variant: 'error',
        });
        cancel();
      },
      onError: (error) => {
        let message = 'An unexpected error occurred';
        if (error.response?.data?.errorMessages) {
          message = error.response.data.errorMessages.join(', ');
        }
        if (error.response?.data?.error) {
          message = error.response.data.error;
        }
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  const getProgress = () => {
    switch (stage) {
      case 'developer':
        return 0;
      case 'product':
        return 1;
      case 'version':
        return 2;
      case 'listing':
        return 3;
      default:
        return -1;
    }
  };

  const next = () => {
    switch (stage) {
      case 'developer':
        setStaged(() => ({
          ...pending.product,
        }));
        setStage('product');
        break;
      case 'product':
        setStaged(() => ({
          ...pending.version,
        }));
        setStage('version');
        break;
      case 'version':
        setStage('listing');
        break;
      default:
        break;
    }
  };

  const previous = () => {
    switch (stage) {
      case 'product':
        setStaged(() => ({
          ...pending.developer,
        }));
        setStage('developer');
        break;
      case 'version':
        setStaged(() => ({
          ...pending.product,
        }));
        setStage('product');
        break;
      case 'listing':
        setStaged(() => ({
          ...pending.version,
        }));
        setStage('version');
        break;
      default:
        break;
    }
  };

  const handleActionDispatch = (action) => {
    switch (action) {
      case 'cancel':
        cancel();
        break;
      case 'confirm':
        confirm();
        break;
      case 'reject':
        reject();
        break;
      case 'toggleWarningAcknowledgement':
        setAcknowledgeWarnings((prev) => !prev);
        break;
      default:
        console.error(`No action found for ${action} coming from action bar`);
    }
  };

  const handleDeveloperDispatch = (action, data) => {
    switch (action) {
      case 'select':
        setPending((prev) => ({
          ...prev,
          developer: data,
          chplProductNumber: replaceDeveloperCode(pending.chplProductNumber, data.developerCode),
        }));
        break;
      case 'edit':
        setPending((prev) => ({
          ...prev,
          developer: data,
          chplProductNumber: replaceDeveloperCode(pending.chplProductNumber, 'XXXX'),
        }));
        break;
        // no default
    }
  };

  const handleProductDispatch = (action, data) => {
    setPending((prev) => ({
      ...prev,
      product: data,
    }));
  };

  const handleVersionDispatch = (action, data) => {
    setPending((prev) => ({
      ...prev,
      version: data,
    }));
  };

  const handleProgressDispatch = (action) => {
    switch (action) {
      case 'next': next();
        break;
      case 'previous': previous();
        break;
        // no default
    }
  };

  updateActionBar = useActionBar({
    canConfirm: true,
    canReject: true,
    isDisabled: !canAct('confirm'),
    isProcessing: isSubmitting,
    errors,
    warnings,
  }, !!uploaded && !isLoading && isSuccess);

  if (!uploaded || isLoading || !isSuccess) { return <ChplConfirmLoading />; }

  const pendingListingState = {
    listing: pending,
    setListing: setPending,
    uploaded,
    setUploaded,
  };

  return (
    <Container maxWidth="lg">
      <PendingListingContext.Provider value={pendingListingState}>
        <Box sx={styles.container}>
          <Container maxWidth="md">
            <Typography variant="h6">
              {`Inspecting Listing: ${pending.chplProductNumber}`}
            </Typography>
          </Container>
          <ChplConfirmProgress
            value={getProgress(stage)}
            canNext={canAct('next')}
            canPrevious={canAct('previous')}
            dispatch={handleProgressDispatch}
          />
          { stage === 'developer' && staged
            && (
              <ChplConfirmDeveloper
                developer={staged}
                listing={pending}
                dispatch={handleDeveloperDispatch}
              />
            )}
          { stage === 'product'
            && (
              <ChplConfirmProduct
                product={staged}
                developer={pending.developer}
                dispatch={handleProductDispatch}
              />
            )}
          { stage === 'version'
            && (
              <ChplConfirmVersion
                version={staged}
                product={pending.product}
                dispatch={handleVersionDispatch}
              />
            )}
          { stage === 'listing'
            && (
              <ChplConfirmListing />
            )}
          <ChplActionBar dispatch={handleActionDispatch} />
        </Box>
      </PendingListingContext.Provider>
    </Container>
  );
}

export default ChplConfirm;

ChplConfirm.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
