import React, { useState } from 'react';
import {
  arrayOf, bool, func, string,
} from 'prop-types';
import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import SaveIcon from '@material-ui/icons/Save';

import theme from '../../themes/theme';

import ChplActionBarConfirmation from './action-bar-confirmation';

const useStyles = makeStyles(() => ({
  buttons: {
    minWidth: '15vw',
  },
  rejectButton: {
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

function ChplWizardBar(props) {
  /* eslint-disable react/destructuring-assignment */
  const [pendingAction, setPendingAction] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [warningsAcknowledged, setWarningsAcknowledged] = useState(false);
  const errors = props.errors.sort((a, b) => (a < b ? 1 : -1));
  const warnings = props.warnings.sort((a, b) => (a < b ? 1 : -1));
  const [showMessages, setShowMessages] = useState(true);
  const classes = useStyles();
  const { canConfirm, canNext, canPrevious } = props;
  /* eslint-enable react/destructuring-assignment */

  const act = (action, data) => props.dispatch(action, data);

  const confirmCancel = () => {
    setIsConfirming(true);
    setPendingAction('cancel');
    setPendingMessage('Are you sure you want to cancel?');
  };

  const confirmConfirm = () => {
    setIsConfirming(true);
    setPendingAction('confirm');
    setPendingMessage('Are you sure you want to confirm this?');
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
      <div className="action-bar">
        { isConfirming
          && (
          <ChplActionBarConfirmation
            dispatch={handleConfirmation}
            pendingMessage={pendingMessage}
          />
          )}
        { (errors?.length > 0 || warnings?.length > 0)
          && (
            <>
              <div className="action-bar__error-toggle">
                <span
                  onClick={() => setShowMessages(!showMessages)}
                  onKeyDown={() => setShowMessages(!showMessages)}
                  tabIndex={0}
                  role="button"
                >
                  { errors?.length > 0
                    && (
                      <>
                        Error
                        { errors.length > 1 && 's'}
                      </>
                    )}
                  { errors?.length > 0 && warnings?.length > 0
                    && <> and </>}
                  { warnings?.length > 0
                    && (
                      <>
                        Warning
                        { warnings.length > 1 && 's'}
                      </>
                    )}
                  <i className={`fa ${showMessages ? 'fa-caret-down' : 'fa-caret-left'}`} />
                </span>
              </div>
            </>
          )}
        { showMessages
          && (
            <>
              <div className="action-bar__messages">
                { errors?.length > 0
                  && (
                    <div className="action-bar__errors">
                      <strong>
                        Error
                        { errors.length > 1 && 's'}
                      </strong>
                      <ul className="action-bar__error-messages">
                        {
                          errors.map((message) => (
                            <li key={message}>{message}</li>
                          ))
                        }
                      </ul>
                    </div>
                  )}
                { warnings?.length > 0
                  && (
                    <>
                      <div className="action-bar__warnings">
                        <strong>
                          Warning
                          { warnings.length > 1 && 's'}
                        </strong>
                        <ul className="action-bar__warning-messages">
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
        { warnings?.length > 0
          && (
            <div className="action-bar__acknowledge-warnings">
              <FormControlLabel
                label="I have reviewed the warning(s) and wish to proceed with this update"
                control={(
                  <Checkbox
                    name="acknowledgeWarnings"
                    value="yes"
                    onChange={() => setWarningsAcknowledged(!warningsAcknowledged)}
                    checked={warningsAcknowledged}
                  />
                )}
              />
            </div>
          )}
        <div className="action-bar__buttons">
          <ButtonGroup
            color="primary"
          >
            <Button
              id="action-bar-cancel"
              variant="outlined"
              onClick={() => confirmCancel()}
              className={classes.buttons}
            >
              Cancel
              <CloseOutlinedIcon
                className={classes.iconSpacing}
              />
            </Button>
            <Button
              id="action-bar-previous"
              variant="outlined"
              disabled={!canPrevious}
              onClick={() => act('previous')}
              className={classes.buttons}
            >
              Previous
              <ArrowBackIcon
                className={classes.iconSpacing}
              />
            </Button>
            { canNext
              && (
                <Button
                  id="action-bar-next"
                  variant="contained"
                  onClick={() => act('next')}
                  className={classes.buttons}
                >
                  Next
                  <ArrowForwardIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
            { !canNext
              && (
                <Button
                  id="action-bar-confirm"
                  variant="contained"
                  disabled={!canConfirm}
                  onClick={() => confirmConfirm()}
                  className={classes.buttons}
                >
                  Confirm
                  <SaveIcon
                    className={classes.iconSpacing}
                  />
                </Button>
              )}
            <Button
              id="action-bar-reject"
              variant="contained"
              className={`${classes.buttons} ${classes.rejectButton}`}
              onClick={() => confirmReject()}
            >
              Reject
              <DeleteOutlinedIcon
                className={classes.iconSpacing}
              />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ChplWizardBar;

ChplWizardBar.propTypes = {
  canConfirm: bool,
  canNext: bool,
  canPrevious: bool,
  dispatch: func.isRequired,
  errors: arrayOf(string),
  warnings: arrayOf(string),
};

ChplWizardBar.defaultProps = {
  canConfirm: false,
  canNext: false,
  canPrevious: false,
  errors: [],
  warnings: [],
};
