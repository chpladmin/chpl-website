import React, {useState} from 'react';
import {arrayOf, bool, func, string} from 'prop-types';

function ChplActionBar (props) {
  const [showMessages, setShowMessages] = useState(true);

  const act = (action) => {
    console.log({type: 'act', action});
    if (props.dispatch) {
      props.dispatch(action);
    }
  };

  const submit = event => {
    event.preventDefault();
  };

  return (
    <form onSubmit={submit}>
      <div className="action-bar">
        { ((props.errors && props.errors.length > 0) || (props.warnings && props.warnings.length > 0)) &&
          <div className="action-bar__error-toggle">
            <span onClick={() => setShowMessages(!showMessages)}>
              { props.errors && props.errors.length > 0 &&
                <>Error{ props.errors.length > 1 && 's'} </>
              }
              { props.errors && props.errors.length > 0 && props.warnings && props.warnings.length > 0 &&
                <>and </>
              }
              { props.warnings && props.warnings.length > 0 &&
                <>Warning{ props.warnings.length > 1 && 's'} </>
              }
              <i className={`fa ${showMessages ? 'fa-caret-down' : 'fa-caret-left'}`}></i>
            </span>
          </div>
        }
        { showMessages &&
          <>
            <div className="action-bar__messages">
              { props.errors && props.errors.length > 0 &&
                <div className="action-bar__errors">
                  <strong>Error{ props.errors.length > 1 && 's'}</strong>
                  <ul className="action-bar__error-messages">
                    {
                      props.errors.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
                        .map(message => (
                          <li key={message}>{message}</li>
                        ))
                    }
                  </ul>
                </div>
              }
              { props.warnings && props.warnings.length > 0 &&
                <>
                  <div className="action-bar__warnings">
                    <strong>Warning{ props.warnings.length > 1 && 's'}</strong>
                    <ul className="action-bar__warning-messages">
                      {
                        props.warnings.sort((a, b) => a < b ? -1 : a > b ? 1 : 0).map(message => (
                          <li key={message}>{message}</li>
                        ))
                      }
                    </ul>
                  </div>
                </>
              }
            </div>
          </>
        }
        <div className="action-bar__buttons">
          <div className="action-bar__button">
            {/*
               Need new component to replace this one
               confirm="Are you sure you wish to cancel? Your changes will not be saved."
               confirm-ok="Yes"
               confirm-cancel="No"
               confirm-settings="{animation: false, keyboard: false, backdrop: 'static'}"
             */}
            <button className="btn btn-default" id="action-bar-cancel"
                    onClick={() => act('cancel')}>Cancel</button>
          </div>
          <div className="action-bar__button">
            <button className="btn btn-primary" id="action-bar-save"
                    onClick={() => act('save')}
                    disabled={props.isDisabled}
                    onMouseOver={() => act('mouseover')}>Save</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export {ChplActionBar};

ChplActionBar.propTypes = {
  errors: arrayOf(string),
  isDisabled: bool,
  dispatch: func,
  warnings: arrayOf(string),
};
