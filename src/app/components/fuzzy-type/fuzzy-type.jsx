import React, { useState } from 'react';
import { arrayOf, func, shape, string } from 'prop-types';
import { getAngularService } from './';

const dependencies = {
    getChplLogService: () => require('../../services/services-bridge.jsx').default,
};

function ChplFuzzyType ({fuzzyType, takeAction}) {
    const [isEditing, setEditing] = useState(false);
    const [choices, setChoices] = useState(fuzzyType.choices);
    const $log = getAngularService('$log');
    const chplLog = dependencies.getChplLogService();

    const cancel = () => {
        setEditing(false);
        setChoices(fuzzyType.choices);
        takeAction(fuzzyType, 'cancel');
    };

    const edit = () => {
        chplLog.info('edit');
        setEditing(true);
        takeAction(fuzzyType, 'edit');
    };

    const remove = choice => {
        $log.info({choice});
        setChoices(choices.filter(c => c !== choice));
    };

    return (
        /* eslint-disable indent,react/jsx-indent */
        <div id={ 'fuzzy-type-' + fuzzyType.fuzzyType }>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4 className="panel-title">{ fuzzyType.fuzzyType }</h4>
            </div>
            <div className="panel-body">
              { !isEditing &&
                <>
                  <span className="pull-right">
                    <button className="btn btn-link btn-small" id={ 'fuzzy-type-' + fuzzyType.fuzzyType + '-edit'} onClick={() => edit()}><i className="fa fa-pencil-square-o"></i><span className="sr-only"> Edit Fuzzy Type</span></button>
                  </span>
                  Choices
                  <ul>
                    {
                        choices
                        .sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
                        .map(choice => (
                            <li key={ choice }>{ choice }</li>
                        ))
                    }
                  </ul>
                </>
              }
              { isEditing &&
                <>
                  <span className="pull-right">
                    <button className="btn btn-link btn-small" id={ 'fuzzy-type-' + fuzzyType.fuzzyType + '-cancel'} onClick={() => cancel()}><i className="fa fa-close"></i><span className="sr-only"> Cancel Edit Fuzzy Type</span></button>
                  </span>
                  Choices (for editing)
                  <form>
                    <ul>
                      {
                          choices
                          .sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
                          .map(choice => (
                              <>
                                <input type="text" key={choice} id={choice} value={choice} readOnly />
                                <button onClick={() => remove(choice)}><i className="fa fa-trash"></i></button>
                              </>
                          ))
                      }
                    </ul>
                </form>
                </>
              }
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
