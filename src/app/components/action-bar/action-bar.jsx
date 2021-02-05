import React, {useState} from 'react';
import {arrayOf, bool, func, shape, string} from 'prop-types';
//import {getAngularService} from './';

const dependencies = {
  getChplLogService: () => require('../../services/services-bridge.jsx').default,
};

function ChplActionBar ({
  canAct,
  errorMessages,
  isDisabled,
  //options,
  takeAction,
  warningMessages,
}) {
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState(false);
  const [errors/*, setErrors*/] = useState(errorMessages.sort((a, b) => a < b ? -1 : a > b ? 1 : 0));
  const [showMessages, setShowMessages] = useState(false);
  const [warnings/*, setWarnings*/] = useState(warningMessages.sort((a, b) => a < b ? -1 : a > b ? 1 : 0));
  const $log = dependencies.getChplLogService();

  const act = (action) => {
    $log.info({type: 'act', action});
    if (takeAction) {
      takeAction(action);
    }
  };

  const can = (action) => {
    $log.info({type: 'can', action});
    if (canAct) {
      return canAct(action);
    }
    return false;
  };

  const handleAcknowledgement = event => {
    setAcknowledgeWarnings(event.target.value);
    if (takeAction) {
      takeAction('updateAcknowledgement', acknowledgeWarnings);
    }
    $log.info({type: 'updateAcknowledgeWarnings', acknowledgeWarnings});
  };

  return (
    <div className="action-bar">
      { ((errors && errors.length > 0) || (warnings && warnings.length > 0)) &&
        <div className="action-bar__error-toggle">
          <span onClick={() => setShowMessages(!showMessages)}>
            Errors and Warnings <i className={`fa ${showMessages ? 'fa-caret-down' : 'fa-caret-left'}`}></i>
          </span>
        </div>
      }
      { showMessages &&
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
              <div className="action-bar__acknowledge-warnings">
                <input type="checkbox" id="acknowledge-warnings" name="acknowledgeWarnings" className="edit-listing__acknowledge-warning-checkbox" onChange={handleAcknowledgement} />
                <label htmlFor="acknowledge-warnings" className="action-bar__acknowledge-warning-label">I have reviewed the warning(s) and wish to proceed with this update</label>
              </div>
            </>
          }
        </div>
      }
      <div className="action-bar__buttons">
        { can('delete') &&
          <div className="action-bar__button">
            <button className="btn btn-danger" id="action-bar-delete"
                    confirm="Are you sure you wish to delete?"
                    confirm-ok="Yes"
                    confirm-cancel="No"
                    confirm-settings="{animation: false, keyboard: false, backdrop: 'static'}"
                    onClick={() => can('delete')}>Delete</button>
          </div>
        }
        <div className="action-bar__button">
          <button className="btn btn-default" id="action-bar-cancel"
                  confirm="Are you sure you wish to cancel? Your changes will not be saved."
                  confirm-ok="Yes"
                  confirm-cancel="No"
                  confirm-settings="{animation: false, keyboard: false, backdrop: 'static'}"
                  onClick={() => act('cancel')}>Cancel</button>
        </div>
        <div className="action-bar__button">
          <button className="btn btn-primary" id="action-bar-save"
                  onClick={() => act('save')}
                  disabled={isDisabled}
                  onMouseOver={() => act('mouseover')}>Save</button>
        </div>
      </div>
      <button onClick={() => can('fake')}>Can</button>
    </div>
  );
}

export {ChplActionBar};

ChplActionBar.propTypes = {
  canAct: func,
  errorMessages: arrayOf(string),
  isDisabled: bool,
  options: shape({
    isWizard: bool,
  }),
  takeAction: func,
  warningMessages: arrayOf(string),
};

/*
  /*
  <div className="action-bar__buttons" ng-if="!$ctrl.isWizard">
  <div className="action-bar__button" ng-if="$ctrl.can('delete')">
  <button className="btn btn-danger" id="action-bar-delete"
  confirm="Are you sure you wish to delete?"
  confirm-ok="Yes"
  confirm-cancel="No"
  confirm-settings="{animation: false, keyboard: false, backdrop: 'static'}"
  ng-click="$ctrl.act('delete')">Delete</button>
  </div>
  <div className="action-bar__button">
  <button className="btn btn-default" id="action-bar-cancel"
  confirm="Are you sure you wish to cancel? Your changes will not be saved."
  confirm-ok="Yes"
  confirm-cancel="No"
  confirm-settings="{animation: false, keyboard: false, backdrop: 'static'}"
  ng-click="$ctrl.act('cancel')">Cancel</button>
  </div>
  <div className="action-bar__button">
  <button className="btn btn-primary" id="action-bar-save"
  ng-click="$ctrl.act('save')"
  ng-disabled="$ctrl.isDisabled"
  ng-mouseover="$ctrl.act('mouseover')">Save</button>
  </div>
  </div>
  <div className="action-bar__buttons" ng-if="$ctrl.isWizard" ng-mouseover="$ctrl.act('mouseover')">
  <div className="action-bar__button">
  <button className="btn btn-secondary" id="action-bar-cancel"
  confirm="Are you sure you wish to cancel? Your changes will not be saved."
  confirm-ok="Yes"
  confirm-cancel="No"
  confirm-settings="{animation: false, keyboard: false, backdrop: 'static'}"
  ng-click="$ctrl.act('cancel')">Cancel</button>
  </div>
  <div className="action-bar__button">
  <button className="btn btn-secondary" id="action-bar-previous"
  ng-click="$ctrl.act('previous')"
  ng-disabled="!$ctrl.can('previous')"><i className="fa fa-caret-left"></i> Previous</button>
  </div>
  <div className="action-bar__button" ng-if="!$ctrl.can('confirm')">
  <button className="btn btn-primary" id="action-bar-next"
  ng-click="$ctrl.act('next')"
  ng-disabled="!$ctrl.can('next')">Next <i className="fa fa-caret-right"></i></button>
  </div>
  <div className="action-bar__button" ng-if="$ctrl.can('confirm')">
  <button className="btn btn-primary" id="action-bar-confirm"
  ng-click="$ctrl.act('confirm')">Confirm</button>
  </div>
  <div className="action-bar__button">
  <button className="btn btn-danger" id="action-bar-reject"
  confirm="Are you sure you wish to reject?"
  confirm-ok="Yes"
  confirm-cancel="No"
  confirm-settings="{animation: false, keyboard: false, backdrop: 'static'}"
  ng-click="$ctrl.act('reject')">Reject</button>
  </div>
  </div>
  </div>
*/
