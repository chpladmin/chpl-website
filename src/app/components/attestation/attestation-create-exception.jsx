import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Slide,
} from '@mui/material';
import { func, shape, string } from 'prop-types';
import { useSnackbar } from 'notistack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { usePostAttestationException } from 'api/developer';
import { ChplDialogTitle } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { developer as developerPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const styles = {
  ...utilStyles,
  dialogTitle: {
    fontWeight: 800,
    fontSize: '1.5em',
  },
  dialogContent: {
    color: '#000000',
  },
  dialogActions: {
    justifyContent: 'flex-start',
  },
};

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
      TransitionComponent={Transition}
    >
      <ChplDialogTitle
        id="exception-details"
        onClose={cancelCreatingException}
      >
        Re-open Attestations submission feature
      </ChplDialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText sx={styles.dialogContent}>
          This action will re-open the Attestations submission feature for
          {' '}
          { developer.name }
          {' for '}
          { getDisplayDateFormat(period.periodStart) }
          {' to '}
          { getDisplayDateFormat(period.periodEnd) }
          . Please confirm you want to continue.
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions sx={styles.dialogActions}>
        <Button
          color="primary"
          variant="contained"
          id="create-attestation-exception-button"
          disabled={isSubmitting}
          onClick={createAttestationException}
          sx={styles.buttonMargin}
        >
          Confirm
          {' '}
          <CheckIcon sx={styles.iconSpacing} />
        </Button>
        <Button
          variant="contained"
          id="cancel-attestation-exception-button"
          onClick={cancelCreatingException}
          sx={styles.buttonMargin}>
          Cancel
          {' '}
          <CloseIcon sx={styles.iconSpacing} />
        </Button>
      </DialogActions>
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
