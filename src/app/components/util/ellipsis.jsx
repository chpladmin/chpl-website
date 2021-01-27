import React from 'react';
import ReactTooltip from 'react-tooltip';
import { bool, number, string } from 'prop-types';

class ChplEllipsis extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            displayText: props.text,
            isShortened: false,
            maxLength: props.maxLength || 80,
        };
        let displayText = this.state.displayText;
        let isShortened = this.state.isShortened;
        let maxLength = this.state.maxLength;
        if (displayText.length > maxLength) {
            displayText = props.text.substring(0, maxLength);
            isShortened = true;
            if (props.wordBoundaries) {
                let parts = displayText.split(' ');
                parts.splice(parts.length - 1, 1);
                if (parts.length > 0) {
                    displayText = parts.join(' ');
                }
            }
        }
        if (isShortened) {
            this.state.canShorten = true;
        }
        this.state.isShortened = isShortened;
        this.state.displayText = displayText;
        this.toggle = this.toggle.bind(this);
    }

    toggle () {
        this.setState(state => ({
            isShortened: !state.isShortened,
        }));
    }

    render () {
        /* eslint-disable indent */
        return (
            <span>
              { this.state.isShortened ? this.state.displayText : this.props.text }
              { this.state.isShortened &&
                <button className="btn btn-link btn-xs" data-tip data-for="ellipsis" onClick={ this.toggle }>
                  <ReactTooltip id="ellipsis" effect="solid">{ this.props.text }</ReactTooltip>
                  <i className="fa fa-ellipsis-h"></i><span className="sr-only">Expand description</span>
                </button>
              }
              { !this.state.isShortened && this.state.canShorten &&
                <button className="btn btn-link btn-xs" onClick={ this.toggle }>
                  <i className="fa fa-arrow-left"></i><span className="sr-only">Minimize description</span>
                </button>
              }
            </span>
        );
        /* eslint-enable indent */
    }
}

export { ChplEllipsis };

ChplEllipsis.propTypes = {
    text: string,
    maxLength: number,
    wordBoundaries: bool,
};
