import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Container,
  makeStyles,
} from '@material-ui/core';
import { ErrorBoundary } from 'react-error-boundary';
import { number, oneOfType, string } from 'prop-types';

import { useFetchPendingListing } from 'api/pending-listings';
import { ChplActionBar } from 'components/action-bar';
import {
  ChplConfirmDeveloper, ChplConfirmProduct, ChplConfirmVersion, ChplConfirmListing, ChplConfirmProgress,
} from 'components/listing/confirm';
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
  const { data: pendingListing, isLoading, isSuccess } = useFetchPendingListing({ id });
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
      ...uploaded.developer
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

  const confirm = () => {
    console.log('confirming');
  };

  const reject = () => {
    console.log('rejecting');
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
        console.log('cancel / navigate away');
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
        <ErrorBoundary fallback={<div>Progress Bar went wrong</div>}>
          <ChplConfirmProgress
            value={getProgress(stage)}
            canNext={canAct('next')}
            canPrevious={canAct('previous')}
            dispatch={handleProgressDispatch}
          />
        </ErrorBoundary>
        { stage === 'developer' && staged
          && (
            <ErrorBoundary fallback={<div>Developer went wrong</div>}>
              <ChplConfirmDeveloper
                developer={staged}
                listing={pending}
                dispatch={handleDeveloperDispatch}
              />
            </ErrorBoundary>
          )}
        { stage === 'product'
          && (
            <ErrorBoundary fallback={<div>Product went wrong</div>}>
              <ChplConfirmProduct
                product={staged}
                developer={pending.developer}
                dispatch={handleProductDispatch}
              />
            </ErrorBoundary>
          )}
        { stage === 'version'
          && (
            <ErrorBoundary fallback={<div>Version went wrong</div>}>
              <ChplConfirmVersion
                version={staged}
                product={pending.product}
                dispatch={handleVersionDispatch}
              />
            </ErrorBoundary>
          )}
        { stage === 'listing'
          && (
            <ErrorBoundary fallback={<div>Listing went wrong</div>}>
              <ChplConfirmListing
                listing={pending}
              />
            </ErrorBoundary>
          )}
        <ErrorBoundary fallback={<div>Action Bar went wrong</div>}>
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
        </ErrorBoundary>
      </div>
    </Container>
  );
}

export default ChplConfirm;

ChplConfirm.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
