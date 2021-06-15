import React, { useState } from 'react';
import {
  arrayOf, bool, func, string,
} from 'prop-types';
import {
  Button,
  ButtonGroup,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';

import theme from '../../themes/theme';

const useStyles = makeStyles(() => ({
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
}));

function ChplActionBar(props) {
  /* eslint-disable react/destructuring-assignment */
  const [canDelete] = useState(props.canDelete);
  const [isDisabled] = useState(props.isDisabled);
  const errors = props.errors.sort((a, b) => (a < b ? 1 : -1));
  const warnings = props.warnings.sort((a, b) => (a < b ? 1 : -1));
  const [showMessages, setShowMessages] = useState(true);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  const act = (action) => {
    if (props.dispatch) {
      props.dispatch(action);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="action-bar">
        { ((errors && errors.length > 0) || (warnings && warnings.length > 0))
          && (
            <>
              <div className="action-bar__error-toggle">
                <span
                  onClick={() => setShowMessages(!showMessages)}
                  onKeyDown={() => setShowMessages(!showMessages)}
                  tabIndex={0}
                  role="button"
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
                  <i className={`fa ${showMessages ? 'fa-caret-down' : 'fa-caret-left'}`} />
                </span>
              </div>
            </>
          )}
        { showMessages
          && (
            <>
              <div className="action-bar__messages">
                { errors && errors.length > 0
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
                { warnings && warnings.length > 0
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
        <div className="action-bar__buttons">
          <ButtonGroup>
            { canDelete
              && (
                <Button
                  id="action-bar-delete"
                  className={classes.deleteButton}
                  onClick={() => act('delete')}
                >
                  Delete
                </Button>
              )}
            <Button
              id="action-bar-cancel"
              color="primary"
              variant="outlined"
              onClick={() => act('cancel')}
            >
              Cancel
            </Button>
            <Button
              id="action-bar-save"
              color="primary"
              variant="contained"
              onClick={() => act('save')}
              disabled={isDisabled}
              onMouseOver={() => act('mouseover')}
            >
              Save
            </Button>
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
  canDelete: bool,
  isDisabled: bool,
};

ChplActionBar.defaultProps = {
  errors: [],
  warnings: [],
  canDelete: false,
  isDisabled: false,
};
