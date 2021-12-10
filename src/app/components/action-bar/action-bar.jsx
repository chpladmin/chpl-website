import React, { useEffect, useState } from 'react';
import {
  arrayOf, bool, func, string,
} from 'prop-types';
import {
  Button,
  ButtonGroup,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import SaveIcon from '@material-ui/icons/Save';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import ChplActionBarConfirmation from './action-bar-confirmation';

import theme from 'themes/theme';

const useStyles = makeStyles(() => ({
  actionBar: {
    backgroundColor: '#fff',
    position: 'fixed',
    bottom: '0',
    right: '0',
    left: '0',
    minHeight: '50px',
    zIndex: '1035',
    marginBottom: '0',
    boxShadow: '1px 4px 8px 1px rgba(149, 157, 165, .1)',
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
  actionBarError: {
    color: '#1c1c1c',
    backgroundColor: '#c44f6530',
    maxHeight: '30vh',
    padding: '16px',
    boxShadow: '1px 4px 8px 1px rgba(149, 157, 165, .1)',
    overflowY: 'auto',
  },
  actionBarErrorToggle: {
    color: '#c44f65',
    textAlign: 'center',
    textTransform: 'uppercase',
    borderBottom: '1px solid #ddd',
    padding: '16px',
    boxShadow: '0 -8px 8px -4px rgba(149, 157, 165, .1)',
  },
  actionBarMessages: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  },
  actionBarWarnings: {
    color: '#1c1c1c',
    backgroundColor: '#F7E9BB30',
    maxHeight: '30vh',
    padding: '16px',
    boxShadow: '1px 4px 8px 1px rgba(149, 157, 165, .1)',
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
}));

function ChplActionBar(props) {
  /* eslint-disable react/destructuring-assignment */
  const [pendingAction, setPendingAction] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [canDelete] = useState(props.canDelete);
  const [canConfirm] = useState(props.canConfirm);
  const [canReject] = useState(props.canReject);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const errors = props.errors.sort((a, b) => (a < b ? 1 : -1));
  const warnings = props.warnings.sort((a, b) => (a < b ? 1 : -1));
  const [showMessages, setShowMessages] = useState(true);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

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

  const handleConfirmation = (response) => {
    if (response === 'yes' && pendingAction) {
      act(pendingAction);
    }
    setIsConfirming(false);
    setPendingAction('');
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
        { ((errors && errors.length > 0) || (warnings && warnings.length > 0))
          && (
            <>
              <div
                onClick={() => setShowMessages(!showMessages)}
                onKeyDown={() => setShowMessages(!showMessages)}
                tabIndex={0}
                role="button"
                className={classes.actionBarErrorToggle}
              >
                { errors && errors.length > 0
                  && (
                    <>
                      Error
                      { errors.length > 1 && 's'}
                    </>
                  )}
                { errors && errors.length > 0 && warnings && warnings.length > 0
                  && <> and </>}
                { warnings && warnings.length > 0
                  && (
                    <>
                      Warning
                      { warnings.length > 1 && 's'}
                    </>
                  )}
                { showMessages
                  ? (
                    <ExpandMoreIcon
                      className={classes.iconSpacing}
                    />
                  ) : (
                    <ExpandLessIcon
                      className={classes.iconSpacing}
                    />
                  )}
              </div>
            </>
          )}
        { showMessages
          && (
            <>
              <div id="action-bar-messages" className={classes.actionBarMessages}>
                { errors && errors.length > 0
                  && (
                    <div className={classes.actionBarError}>
                      <strong>
                        Error
                        { errors.length > 1 && 's'}
                      </strong>
                      <ul id="action-bar-errors">
                        {
                          errors.map((message) => (
                            <li key={message}>{message}</li>
                          ))
                        }
                      </ul>
                    </div>
                  )}
                { warnings && warnings.length > 0
                  && (
                    <>
                      <div className={classes.actionBarWarnings}>
                        <strong>
                          Warning
                          { warnings.length > 1 && 's'}
                        </strong>
                        <ul id="action-bar-warnings">
                          {
                            warnings.map((message) => (
                              <li key={message}>{message}</li>
                            ))
                          }
                        </ul>
                      </div>
                    </>
                  )}
              </div>
            </>
          )}
        <div className={classes.actionBarButtons}>
          <ButtonGroup
            color="primary"
          >
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
            { canConfirm
              ? (
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
              ) : (
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
          </ButtonGroup>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ChplActionBar;

ChplActionBar.propTypes = {
  dispatch: func.isRequired,
  errors: arrayOf(string),
  warnings: arrayOf(string),
  canConfirm: bool,
  canDelete: bool,
  canReject: bool,
  isDisabled: bool,
};

ChplActionBar.defaultProps = {
  errors: [],
  warnings: [],
  canConfirm: false,
  canDelete: false,
  canReject: false,
  isDisabled: false,
};
