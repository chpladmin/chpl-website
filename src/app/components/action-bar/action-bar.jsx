import React, {useState} from 'react';
import {arrayOf, bool, func, shape, string} from 'prop-types';

function ChplActionBar (props) {
  const [errors] = useState(props.errors ? props.errors.sort((a, b) => a < b ? -1 : a > b ? 1 : 0) : []);
  const [showMessages, setShowMessages] = useState((props.errors && props.errors.length > 0) || (props.warnings && props.warnings.length > 0));
  const [warnings] = useState(props.warnings ? props.warnings.sort((a, b) => a < b ? -1 : a > b ? 1 : 0) : []);

  const act = (action) => {
    console.log({type: 'act', action});
    if (props.takeAction) {
      props.takeAction(action);
    }
  };

  const submit = event => {
    event.preventDefault();
  };

  return (
    <form onSubmit={submit}>
      <div className="action-bar">
        { ((errors && errors.length > 0) || (warnings && warnings.length > 0)) &&
          <div className="action-bar__error-toggle">
            <span onClick={() => setShowMessages(!showMessages)}>
              Errors and Warnings <i className={`fa ${showMessages ? 'fa-caret-down' : 'fa-caret-left'}`}></i>
            </span>
          </div>
        }
        { showMessages &&
          <>
            <div className="action-bar__messages">
              { errors && errors.length > 0 &&
                <div className="action-bar__errors">
                  <strong>Error(s)</strong>
                  <ul className="action-bar__error-messages">
                    {
                      errors.map(message => (
                        <li key={message}>{message}</li>
                      ))
                    }
                  </ul>
                </div>
              }
              { warnings && warnings.length > 0 &&
                <>
                  <div className="action-bar__warnings">
                    <strong>Warning(s)</strong>
                    <ul className="action-bar__warning-messages">
                      {
                        warnings.map(message => (
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
  takeAction: func,
  warnings: arrayOf(string),
};
