import React, { useState } from 'react';
import { arrayOf, func, shape, string } from 'prop-types';
import { getAngularService } from './';

const dependencies = {
    getChplLogService: () => require('../../services/services-bridge.jsx').default,
};

function ChplFuzzyType ({fuzzyType, takeAction}) {
    const [isEditing, setEditing] = useState(false);
    const $log = getAngularService('$log');
    const chplLog = dependencies.getChplLogService();

    const toggle = () => {
        setEditing(!isEditing);
        if (isEditing) {
            $log.info({isEditing});
            takeAction(fuzzyType, 'cancel');
        } else {
            chplLog.info({isEditing});
            takeAction(fuzzyType, 'edit');
        }
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
                    <button className="btn btn-link btn-small" id={ 'fuzzy-type-' + fuzzyType.fuzzyType + '-edit'} onClick={() => toggle()}><i className="fa fa-pencil-square-o"></i><span className="sr-only"> Edit Fuzzy Type</span></button>
                  </span>
                  Choices
                  <ul>
                    {
                        fuzzyType.choices
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
                    <button className="btn btn-link btn-small" id={ 'fuzzy-type-' + fuzzyType.fuzzyType + '-cancel'} onClick={() => toggle()}><i className="fa fa-close"></i><span className="sr-only"> Cancel Edit Fuzzy Type</span></button>
                  </span>
                  Choices (for editing)
                  <ul>
                    {
                        fuzzyType.choices
                        .sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
                        .map(choice => (
                            <li key={ choice }>{ choice }</li>
                        ))
                    }
                  </ul>
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
