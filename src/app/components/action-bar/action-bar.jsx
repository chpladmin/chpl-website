import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf, bool, func, string,
} from 'prop-types';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import SaveIcon from '@material-ui/icons/Save';

import ChplActionBarConfirmation from './action-bar-confirmation';
import ChplActionBarMessages from './action-bar-messages';

import { UserContext } from 'shared/contexts';
import { palette, utilStyles, theme } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  actionBar: {
    backgroundColor: palette.white,
    position: 'fixed',
    bottom: '0',
    right: '0',
    left: '0',
    minHeight: '50px',
    zIndex: '1035',
    marginBottom: '0',
    boxShadow: 'rgb(149 157 165 / 30%) -8px 0 16px 0',
    display: 'grid',
  },
  actionBarButton: {
    minWidth: '15vw',
  },
  actionBarButtons: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 0',
    gap: '16px',
  },
  actionBarErrorAcknowledgement: {
    color: palette.white,
    backgroundColor: palette.error,
    textAlign: 'center',
    borderBottom: `1px solid ${palette.greyLight}`,
    padding: '16px',
    boxShadow: '0 -8px 8px -4px rgba(149, 157, 165, .1)',
  },
  actionBarErrorText: {
    color: palette.white,
  },
  actionBarWarningAcknowledgement: {
    color: palette.error,
    textAlign: 'center',
    borderBottom: `1px solid ${palette.greyLight}`,
    padding: '16px',
    boxShadow: '0 -8px 8px -4px rgba(149, 157, 165, .1)',
  },
  errorCheckbox: {
    color: palette.white,
  },
});

function ChplActionBar({
  errors = [],
  warnings = [],
  canCancel = true,
  canClose = false,
  canConfirm = false,
  canDelete = false,
  canEdit = false,
  canReject = false,
  canSave = true,
  canWithdraw = false,
  dispatch,
  isDeleteDisabled: initialIsDeleteDisabled = false,
  isDisabled: initialIsDisabled = false,
  isProcessing: initialIsProcessing = false,
  showErrorAcknowledgement: initialShowErrorAcknowledgement = false,
  showWarningAcknowledgement: initialShowWarningAcknowledgement = false,
}) {
  const { hasAnyRole } = useContext(UserContext);
  const [errorAcknowledged, setErrorAcknowledged] = useState(false);
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAction, setPendingAction] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [showErrorAcknowledgement, setShowErrorAcknowledgement] = useState(false);
  const [showWarningAcknowledgement, setShowWarningAcknowledgement] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setShowErrorAcknowledgement(initialShowErrorAcknowledgement && hasAnyRole(['chpl-admin', 'chpl-onc']));
  }, [initialShowErrorAcknowledgement, hasAnyRole]);

  useEffect(() => {
    setShowWarningAcknowledgement(initialShowWarningAcknowledgement);
  }, [initialShowWarningAcknowledgement]);

  useEffect(() => {
    setIsDeleteDisabled(initialIsDeleteDisabled);
  }, [initialIsDeleteDisabled]);

  useEffect(() => {
    setIsDisabled(initialIsDisabled);
  }, [initialIsDisabled]);

  useEffect(() => {
    setIsProcessing(initialIsProcessing);
  }, [initialIsProcessing]);

  const act = (action) => {
    if (dispatch) {
      dispatch(action);
    }
  };

  const confirmCancel = () => {
    setIsConfirming(true);
    setPendingAction('cancel');
    setPendingMessage('Are you sure you want to cancel?');
  };

  const confirmDelete = () => {
    setIsConfirming(true);
    setPendingAction('delete');
    setPendingMessage('Are you sure you want to delete this?');
  };

  const confirmReject = () => {
    setIsConfirming(true);
    setPendingAction('reject');
    setPendingMessage('Are you sure you want to reject this?');
  };

  const confirmWithdraw = () => {
    setIsConfirming(true);
    setPendingAction('withdraw');
    setPendingMessage('Are you sure you want to withdraw this submission?');
  };

  const handleConfirmation = (response) => {
    if (response === 'yes' && pendingAction) {
      act(pendingAction);
    }
    setIsConfirming(false);
    setPendingAction('');
  };

  const toggleErrorAcknowledgement = () => {
    setErrorAcknowledged(!errorAcknowledged);
    act('toggleErrorAcknowledgement');
  };

  const toggleWarningAcknowledgement = () => {
    setWarningAcknowledged(!warningAcknowledged);
    act('toggleWarningAcknowledgement');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.actionBar}>
        {isConfirming
          && (
            <ChplActionBarConfirmation
              dispatch={handleConfirmation}
              pendingMessage={pendingMessage}
            />
          )}
        {showErrorAcknowledgement
          && (
            <div
              className={classes.actionBarErrorAcknowledgement}
            >
              <Typography variant="body1">Caution: You are about to bypass error messages to update this product. This action may have unintended consequences. Please check the box and press save to confirm that you want to proceed</Typography>
              <FormControlLabel
                label={
                  <Typography className={classes.actionBarErrorText}><strong>{`I have reviewed the error${errors.length !== 1 ? 's' : ''} and wish to proceed with this update`}</strong></Typography>
                }
                control={(
                  <Checkbox
                    value="errorAcknowledge"
                    onChange={toggleErrorAcknowledgement}
                    checked={errorAcknowledged}
                    color="default"
                    className={classes.errorCheckbox}
                  />
                )}
              />
            </div>
          )}
        {showWarningAcknowledgement
          && (
            <div
              className={classes.actionBarWarningAcknowledgement}
            >
              <FormControlLabel
                label={`I have reviewed the warning${warnings.length !== 1 ? 's' : ''} and wish to proceed with this update`}
                control={(
                  <Checkbox
                    name="warningAcknowledge"
                    value="warningAcknowledge"
                    onChange={toggleWarningAcknowledgement}
                    checked={warningAcknowledged}
                    color="primary"
                  />
                )}
              />
            </div>
          )}
        <div className={classes.actionBarButtons}>
          <>
            { canCancel
              && (
                <Button
                  id="action-bar-cancel"
                  color="secondary"
                  variant="contained"
                  onClick={() => confirmCancel()}
                  className={classes.actionBarButton}
                >
                  Cancel
                  <CloseOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
            { canClose
              && (
                <Button
                  id="action-bar-close"
                  variant="contained"
                  color="secondary"
                  onClick={() => act('cancel')}
                  className={classes.actionBarButton}
                >
                  Close
                  <CloseOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
            { canConfirm
              && (
                <Button
                  id="action-bar-confirm"
                  variant="contained"
                  color="primary"
                  onClick={() => act('confirm')}
                  disabled={isDisabled || isProcessing}
                  className={classes.actionBarButton}
                >
                  { isProcessing && <CircularProgress size={24} className={classes.buttonProgress} /> }
                  Confirm
                  <SaveIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
            { canEdit
              && (
                <Button
                  id="action-bar-edit"
                  variant="contained"
                  color="secondary"
                  onClick={() => act('edit')}
                  className={classes.actionBarButton}
                >
                  Edit
                  <EditOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
            { canSave && !canConfirm
              && (
                <Button
                  id="action-bar-save"
                  color="primary"
                  variant="contained"
                  onClick={() => act('save')}
                  disabled={isDisabled || isProcessing}
                  className={classes.actionBarButton}
                >
                  { isProcessing && <CircularProgress size={24} className={classes.buttonProgress} /> }
                  Save
                  <SaveIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
            { canDelete
              && (
                <Button
                  id="action-bar-delete"
                  variant="outlined"
                  className={`${classes.actionBarButton} ${classes.deleteButtonOutlined}`}
                  onClick={() => confirmDelete()}
                  disabled={isDeleteDisabled || isProcessing}
                >
                  { isProcessing && <CircularProgress size={24} className={classes.buttonProgress} /> }
                  Delete
                  <DeleteOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
            { canReject
              && (
                <Button
                  id="action-bar-reject"
                  variant="outlined"
                  className={`${classes.actionBarButton} ${classes.deleteButtonOutlined}`}
                  onClick={() => confirmReject()}
                >
                  Reject
                  <DeleteOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
            { canWithdraw
              && (
                <Button
                  id="action-bar-withdraw"
                  variant="outlined"
                  className={`${classes.actionBarButton} ${classes.deleteButtonOutlined}`}
                  disabled={isDisabled || isProcessing}
                  onClick={() => confirmWithdraw()}
                >
                  { isProcessing && <CircularProgress size={24} className={classes.buttonProgress} /> }
                  Withdraw
                  <DeleteOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
          </>
        </div>
      </div>
      <ChplActionBarMessages
        errors={errors}
        warnings={warnings}
      />
    </ThemeProvider>
  );
}

export default ChplActionBar;

ChplActionBar.propTypes = {
  dispatch: func.isRequired,
  errors: arrayOf(string),
  warnings: arrayOf(string),
  canCancel: bool,
  canClose: bool,
  canConfirm: bool,
  canDelete: bool,
  canEdit: bool,
  canReject: bool,
  canSave: bool,
  canWithdraw: bool,
  isDeleteDisabled: bool,
  isDisabled: bool,
  isProcessing: bool,
  showErrorAcknowledgement: bool,
  showWarningAcknowledgement: bool,
};
