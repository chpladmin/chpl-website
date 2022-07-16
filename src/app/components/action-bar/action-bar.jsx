import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  ThemeProvider,
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

import theme from 'themes/theme';

const useStyles = makeStyles({
  actionBar: {
    backgroundColor: '#fff',
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
  },
  actionBarAcknowledgement: {
    color: '#c44f65',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
    padding: '16px',
    boxShadow: '0 -8px 8px -4px rgba(149, 157, 165, .1)',
  },
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplActionBar(props) {
  const {
    canCancel,
    canClose,
    canConfirm,
    canDelete,
    canEdit,
    canReject,
    canSave,
    canWithdraw,
  } = props;
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [pendingAction, setPendingAction] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [showAcknowledgement, setShowAcknowledgement] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setErrors(props.errors);
  }, [props.errors]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setWarnings(props.warnings);
  }, [props.warnings]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setShowAcknowledgement(props.showAcknowledgement);
  }, [props.showAcknowledgement]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setIsDisabled(props.isDisabled);
  }, [props.isDisabled]); // eslint-disable-line react/destructuring-assignment

  const act = (action) => {
    if (props.dispatch) {
      props.dispatch(action);
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

  const toggleAcknowledgement = () => {
    setAcknowledged(!acknowledged);
    act('toggleAcknowledgement');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.actionBar}>
        { isConfirming
          && (
          <ChplActionBarConfirmation
            dispatch={handleConfirmation}
            pendingMessage={pendingMessage}
          />
          )}
        { showAcknowledgement
          && (
            <div
              className={classes.actionBarAcknowledgement}
            >
              <FormControlLabel
                label={`I have reviewed the warning${warnings.length !== 1 ? 's' : ''} and wish to proceed with this update`}
                control={(
                  <Checkbox
                    name="acknowledge"
                    value="acknowledge"
                    onChange={() => toggleAcknowledgement()}
                    checked={acknowledged}
                  />
                )}
              />
            </div>
          )}
        <div className={classes.actionBarButtons}>
          <ButtonGroup
            color="primary"
          >
            { canCancel
              && (
                <Button
                  id="action-bar-cancel"
                  variant="outlined"
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
                  color="primary"
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
                  onClick={() => act('confirm')}
                  disabled={isDisabled}
                  className={classes.actionBarButton}
                >
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
                  variant="contained"
                  onClick={() => act('save')}
                  disabled={isDisabled}
                  onMouseOver={() => act('mouseover')}
                  className={classes.actionBarButton}
                >
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
                  variant="contained"
                  className={`${classes.actionBarButton} ${classes.deleteButton}`}
                  onClick={() => confirmDelete()}
                >
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
                  variant="contained"
                  className={`${classes.actionBarButton} ${classes.deleteButton}`}
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
                  variant="contained"
                  className={`${classes.actionBarButton} ${classes.deleteButton}`}
                  onClick={() => confirmWithdraw()}
                >
                  Withdraw
                  <DeleteOutlinedIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
          </ButtonGroup>
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
  isDisabled: bool,
  showAcknowledgement: bool,
};

ChplActionBar.defaultProps = {
  errors: [],
  warnings: [],
  canCancel: true,
  canClose: false,
  canConfirm: false,
  canDelete: false,
  canEdit: false,
  canReject: false,
  canSave: true,
  canWithdraw: false,
  isDisabled: false,
  showAcknowledgement: false,
};
