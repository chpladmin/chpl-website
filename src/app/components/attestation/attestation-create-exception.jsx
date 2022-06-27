import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { func, shape, string } from 'prop-types';
import { useSnackbar } from 'notistack';

import { usePostAttestationException } from 'api/developer';
import { ChplDialogTitle } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { developer as developerPropType } from 'shared/prop-types';

function ChplAttestationCreateException(props) {
  const { mutate } = usePostAttestationException();
  const { enqueueSnackbar } = useSnackbar();
  const { developer, dispatch, period } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancelCreatingException = () => {
    dispatch('cancel');
  };

  const createAttestationException = () => {
    setIsSubmitting(true);
    const payload = {
      developer,
      period,
    };
    mutate(payload, {
      onSuccess: ({ data: { exceptionEnd, developer: { name } } }) => {
        dispatch('saved');
        setIsSubmitting(false);
        const message = `You have re-opened the submission feature for ${name} until ${getDisplayDateFormat(exceptionEnd)}.`;
        enqueueSnackbar(message, {
          variant: 'success',
        });
      },
      onError: () => {
        const message = 'Something went wrong. Please try again or contact ONC for support';
        enqueueSnackbar(message, {
          variant: 'error',
        });
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={cancelCreatingException}
      aria-labelledby="exception-details"
      open
    >
      <ChplDialogTitle
        id="exception-details"
        onClose={cancelCreatingException}
      >
        Re-open Attestations submission feature
      </ChplDialogTitle>
      <DialogContent
        dividers
      >
        <Typography>
          This action will re-open the Attestations submission feature for
          {' '}
          { developer.name }
          {' for '}
          { getDisplayDateFormat(period.periodStart) }
          {' to '}
          { getDisplayDateFormat(period.periodEnd) }
          . Please confirm you want to continue.
        </Typography>
        <Button
          color="primary"
          id="create-attestation-exception-button"
          variant="contained"
          disabled={isSubmitting}
          onClick={createAttestationException}
        >
          Confirm
        </Button>
        <Button
          color="primary"
          id="cancel-attestation-exception-button"
          onClick={cancelCreatingException}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default ChplAttestationCreateException;

ChplAttestationCreateException.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
  period: shape({
    periodStart: string,
    periodEnd: string,
  }).isRequired,
};
