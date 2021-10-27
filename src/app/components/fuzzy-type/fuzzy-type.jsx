import React, { useState } from 'react';
import {
  arrayOf, func, shape, string,
} from 'prop-types';
import { getAngularService } from '.';

import { ChplActionBar } from '../action-bar';

const dependencies = {
  getChplLogService: () => require('../../services/services-bridge.jsx').default,
};

function ChplFuzzyType(props) {
  const [choices, setChoices] = useState(props.fuzzyType.choices.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isAdding, setAdding] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [newFuzzyType, setNewFuzzyType] = useState(undefined);
  const [showFormErrors, setShowFormErrors] = useState(false);
  const $log = getAngularService('$log');
  const chplLog = dependencies.getChplLogService();

  const act = (action) => {
    switch (action) {
      case 'cancel':
        cancel();
        break;
      case 'save':
        save();
        break;
      // no default
    }
  };

  const cancel = () => {
    setEditing(false);
    setErrors([]);
    setWarnings([]);
    setChoices(props.fuzzyType.choices.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
    setNewFuzzyType(undefined);
    props.takeAction(props.fuzzyType, 'cancel');
  };

  const cancelAdd = () => {
    setAdding(false);
    setNewFuzzyType(undefined);
    setShowFormErrors(false);
  };

  const edit = () => {
    chplLog.info('edit');
    setEditing(true);
    props.takeAction(props.fuzzyType, 'edit');
  };

  const handleAdd = () => {
    setChoices([].concat(choices).concat(newFuzzyType).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
    setAdding(false);
    setNewFuzzyType(undefined);
  };

  const handleChange = (event) => {
    setNewFuzzyType(event.target.value);
  };

  const isDisabled = () => !newFuzzyType;

  const remove = (choice) => {
    $log.info({ choice });
    setChoices(choices.filter((c) => c !== choice).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
  };

  const save = () => {
    props.takeAction({
      ...props.fuzzyType,
      choices,
    }, 'save');
  };

  const submit = (event) => {
    event.preventDefault();
  };

  return (
    <div id={`fuzzy-type-${props.fuzzyType.fuzzyType}`}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4 className="panel-title">{props.fuzzyType.fuzzyType}</h4>
        </div>
        <div className="panel-body">
          {isEditing ? (
            <>
              <form onSubmit={submit}>
                <div className="manage-list__container">
                  <div className="data-label">Choice</div>
                  {
                choices.map((choice) => (
                  <>
                    <div className="manage-list__item--start">{choice}</div>
                    <div className="manage-list__item--end">
                      <button className="btn btn-link btn-sm" onClick={() => remove(choice)}>
                        <i className="fa fa-times" />
                      </button>
                    </div>
                  </>
                ))
              }
                  {isAdding ? (
                    <>
                      <div className="manage-list__item--start">
                        <label>
                        <span className="sr-only">Add new Fuzzy Type</span>
                        <input type="text" className="input-sm form-control" onChange={handleChange} />
                        { showFormErrors && isDisabled()
                        && 'required'}
                      </label>
                      </div>
                      <div className="manage-list__item--end">
                        <button
                        className="btn btn-link btn-sm"
                        onClick={handleAdd}
                        onMouseOver={() => setShowFormErrors(true)}
                        disabled={isDisabled()}
                      >
                        <i className="fa fa-save" />
                      </button>
                        <button className="btn btn-link btn-sm" onClick={() => cancelAdd()}>
                        <i className="fa fa-times" />
                      </button>
                      </div>
                    </>
                  ) : (
                    <div className="manage-list__item--start">
                      <button className="btn btn-sm btn-link" onClick={() => setAdding(true)}>
                      <i className="fa fa-plus-circle" />
                      {' '}
                      Add Item
                  </button>
                    </div>
                  ) }
                </div>
              </form>
              <ChplActionBar dispatch={act} errors={errors} warnings={warnings} />
            </>
          ) : (
            <>
              <span className="pull-right">
                <button className="btn btn-link btn-small" id={`fuzzy-type-${props.fuzzyType.fuzzyType}-edit`} onClick={() => edit()}>
                  <i className="fa fa-pencil-square-o" />
                  <span className="sr-only"> Edit Fuzzy Type</span>
                </button>
              </span>
              Choices
              <ul>
                {
              choices.map((choice) => (
                <li key={choice}>{choice}</li>
              ))
            }
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { ChplFuzzyType };

ChplFuzzyType.propTypes = {
  fuzzyType: shape({
    fuzzyType: string,
    choices: arrayOf(string),
  }),
  takeAction: func,
};
