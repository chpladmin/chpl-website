import React, {useState} from 'react';
import {arrayOf, bool, func, shape, string} from 'prop-types';
//import {getAngularService} from './';

//const dependencies = {
//  getChplLogService: () => require('../../services/services-bridge.jsx').default,
//};

function ChplActionBar ({
  errorMessages,
  isDisabled,
  takeAction,
  warningMessages,
}) {
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState(false);
  const [errors] = useState(errorMessages ? errorMessages.sort((a, b) => a < b ? -1 : a > b ? 1 : 0) : []);
  const [showMessages, setShowMessages] = useState(false);
  const [warnings] = useState(warningMessages ? warningMessages.sort((a, b) => a < b ? -1 : a > b ? 1 : 0) : []);
  //const $log = dependencies.getChplLogService();
  const $log = () => {};

  const act = (action) => {
    $log.info({type: 'act', action});
    if (takeAction) {
      takeAction(action);
    }
  };

  const handleAcknowledgement = event => {
    setAcknowledgeWarnings(event.target.value);
    if (takeAction) {
      takeAction('updateAcknowledgement', acknowledgeWarnings);
    }
    $log.info({type: 'updateAcknowledgeWarnings', acknowledgeWarnings});
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
            { warnings && warnings.length > 0 &&
              <div className="action-bar__acknowledge-warnings">
                <input type="checkbox" id="acknowledge-warnings" name="acknowledgeWarnings" className="edit-listing__acknowledge-warning-checkbox" onChange={handleAcknowledgement} />
                <label htmlFor="acknowledge-warnings" className="action-bar__acknowledge-warning-label">I have reviewed the warning(s) and wish to proceed with this update</label>
              </div>
            }
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
                    disabled={isDisabled}
                    onMouseOver={() => act('mouseover')}>Save</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export {ChplActionBar};

ChplActionBar.propTypes = {
  errorMessages: arrayOf(string),
  isDisabled: bool,
  options: shape({
    isWizard: bool,
  }),
  takeAction: func,
  warningMessages: arrayOf(string),
};
