/* eslint-disable no-console,angular/log */
import React from 'react';
import { arrayOf, func, shape, string } from 'prop-types';

class ChplFuzzyType extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
          <span>
            { this.props.fuzzyType.fuzzyType }
          </span>
        );
    }
}

export { ChplFuzzyType };

ChplFuzzyType.propTypes = {
    fuzzyType: shape({
        fuzzyType: string,
        choices: arrayOf(string),
    }),
    takeAction: func,
};
