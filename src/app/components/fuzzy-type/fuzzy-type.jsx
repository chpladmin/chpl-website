/* eslint-disable no-console,angular/log */
import React from 'react';
import { arrayOf, func, shape, string } from 'prop-types';

class ChplFuzzyType extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEditing: false,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle () {
        this.setState(state => ({
            isEditing: !state.isEditing,
        }));
        if (this.state.isEditing) {
            this.props.takeAction({
                data: this.props.fuzzyType,
                action: 'edit',
            });
        } else {
            this.props.takeAction({
                data: this.props.fuzzyType,
                action: 'cancel',
            });
        }
    }

    render () {
        /* eslint-disable indent,react/jsx-indent */
        return (
            <div id={ 'fuzzy-type-' + this.props.fuzzyType.fuzzyType }>
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">{ this.props.fuzzyType.fuzzyType }</h4>
                </div>
                <div className="panel-body">
                  { !this.state.isEditing &&
                    <>
                      <span className="pull-right">
                        <button className="btn btn-link btn-small" id={ 'fuzzy-type-' + this.props.fuzzyType.fuzzyType + '-edit'} onClick={ this.toggle }><i className="fa fa-pencil-square-o"></i><span className="sr-only"> Edit Fuzzy Type</span></button>
                      </span>
                      Choices
                      <ul>
                        {
                            this.props.fuzzyType.choices
                            .sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
                            .map(choice => (
                                <li key={ choice }>{ choice }</li>
                            ))
                        }
                      </ul>
                    </>
                  }
                  { this.state.isEditing &&
                    <>
                      <span className="pull-right">
                        <button className="btn btn-link btn-small" id={ 'fuzzy-type-' + this.props.fuzzyType.fuzzyType + '-cancel'} onClick={ this.toggle }><i className="fa fa-close"></i><span className="sr-only"> Cancel Edit Fuzzy Type</span></button>
                      </span>
                      Choices (for editing)
                      <ul>
                        {
                            this.props.fuzzyType.choices
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
}

export { ChplFuzzyType };

ChplFuzzyType.propTypes = {
    fuzzyType: shape({
        fuzzyType: string,
        choices: arrayOf(string),
    }),
    takeAction: func,
};
