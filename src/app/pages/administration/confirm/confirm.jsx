import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Container,
  makeStyles,
} from '@material-ui/core';
import { number, oneOfType, string } from 'prop-types';
import { useSnackbar } from 'notistack';

import { useConfirmPendingListing, useFetchPendingListing, useRejectPendingListing } from 'api/pending-listings';
import { ChplActionBar } from 'components/action-bar';
import {
  ChplConfirmDeveloper,
  ChplConfirmListing,
  ChplConfirmProduct,
  ChplConfirmProgress,
  ChplConfirmVersion,
} from 'components/listing/confirm';
import { getAngularService } from 'services/angular-react-helper';
import { utilStyles } from 'themes';

const replaceDeveloperCode = (chplProductNumber, code) => {
  const parts = chplProductNumber.split('.');
  parts[3] = code;
  return parts.join('.');
};

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: '16px',
    gap: '16px',
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 100px)',
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
});

function ChplConfirm({ id }) {
  const $state = getAngularService('$state');
  const { data: pendingListing, isLoading, isSuccess } = useFetchPendingListing({ id });
  const { mutate: confirmListing } = useConfirmPendingListing();
  const { mutate: rejectListing } = useRejectPendingListing();
  const { enqueueSnackbar } = useSnackbar();
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pending, setPending] = useState(undefined);
  const [showAcknowledgement, setShowAcknowledgement] = useState(false);
  const [stage, setStage] = useState('developer');
  const [staged, setStaged] = useState(undefined);
  const [uploaded, setUploaded] = useState(undefined);
  const [warnings, setWarnings] = useState([]);
  const classes = useStyles();

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
    /*
      if (this.pending.developer && !this.pending.developer.id) {
      this.pending.developer.id = '';
      }
    */
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
    $state.go('^', {}, { reload: true });
  };

  const confirm = () => {
    setIsSubmitting(true);
    confirmListing({
      listing: pending,
      acknowledgeWarnings,
    }, {
      onSuccess: (result) => {
        enqueueSnackbar(`The Listing has been confirmed. Details are available at <a href="#/listing/${result.id}">${result.chplProductNumber}</a>`, {
          variant: 'success',
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
            setShowAcknowledgement(true);
          } else {
            setShowAcknowledgement(false);
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

  if (!uploaded || isLoading || !isSuccess) { return <CircularProgress />; }

  return (
    <Container className={classes.fixFooterSpacing} maxWidth="lg">
      <div className={classes.container}>
        Inspecting Listing
        { pending.chplProductNumber }
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
            <ChplConfirmListing
              listing={pending}
            />
          )}
        <ChplActionBar
          canConfirm
          canReject
          isDisabled={!canAct('confirm')}
          isProcessing={isSubmitting}
          showWarningAcknowledgement={showAcknowledgement}
          errors={errors}
          warnings={warnings}
          dispatch={handleActionDispatch}
        />
      </div>
    </Container>
  );
}

export default ChplConfirm;

ChplConfirm.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
