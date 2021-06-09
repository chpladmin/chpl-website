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
  const [showMessages, setShowMessages] = useState(true);
  const classes = useStyles();

  const act = (action) => {
    if (props.dispatch) {
      props.dispatch(action);
    }
  };

  const submit = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={submit}>
        <div className="action-bar">
          { ((props.errors && props.errors.length > 0) || (props.warnings && props.warnings.length > 0))
            && (
              <div className="action-bar__error-toggle">
                <span onClick={() => setShowMessages(!showMessages)}>
                  { props.errors && props.errors.length > 0
                    && (
                      <>
                        Error
                        { props.errors.length > 1 && 's'}
                      </>
                    )}
                  { props.errors && props.errors.length > 0 && props.warnings && props.warnings.length > 0
                    && <>and </>}
                  { props.warnings && props.warnings.length > 0
                    && (
                      <>
                        Warning
                        { props.warnings.length > 1 && 's'}
                      </>
                    )}
                  <i className={`fa ${showMessages ? 'fa-caret-down' : 'fa-caret-left'}`} />
                </span>
              </div>
            )}
          { showMessages
            && (
              <>
                <div className="action-bar__messages">
                  { props.errors && props.errors.length > 0
                    && (
                      <div className="action-bar__errors">
                        <strong>
                          Error
                          { props.errors.length > 1 && 's'}
                        </strong>
                        <ul className="action-bar__error-messages">
                          {
                            props.errors.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
                              .map((message) => (
                                <li key={message}>{message}</li>
                              ))
                          }
                        </ul>
                      </div>
                    )}
                  { props.warnings && props.warnings.length > 0
                    && (
                      <>
                        <div className="action-bar__warnings">
                          <strong>
                            Warning
                            { props.warnings.length > 1 && 's'}
                          </strong>
                          <ul className="action-bar__warning-messages">
                            {
                              props.warnings.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).map((message) => (
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
              { props.canDelete &&
                <Button id="action-bar-delete"
                        className={ classes.deleteButton }
                        onClick={() => act('delete')}>
                  Delete
                </Button>
              }
              <Button id="action-bar-cancel"
                      color="primary"
                      variant="outlined"
                      onClick={() => act('cancel')}>
                Cancel
              </Button>
              <Button id="action-bar-save"
                      color="primary"
                      variant="contained"
                      onClick={() => act('save')}
                      disabled={props.isDisabled}
                      onMouseOver={() => act('mouseover')}>
                Save
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </form>
    </ThemeProvider>
  );
}

export { ChplActionBar };

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
}
