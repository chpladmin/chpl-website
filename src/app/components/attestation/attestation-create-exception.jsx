import React, { useState } from 'react';
import {
  Button,
  Typography,
} from '@material-ui/core';
import { func, object } from 'prop-types';
import { useSnackbar } from 'notistack';

import { usePostAttestationException } from 'api/developer';
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
    <>
      <Typography>
        This action will re-open the Attestations submission feature for
        {' '}
        { developer.name }
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
    </>
  );
}

export default ChplAttestationCreateException;

ChplAttestationCreateException.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
  period: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
