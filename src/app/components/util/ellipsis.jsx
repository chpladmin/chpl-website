import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { bool, number, string } from 'prop-types';

function ChplEllipsis ({text, maxLength, wordBoundaries}) {
    const [isShortened, setShortened] = useState(true);

    if (text.length <= maxLength) {
        return <span>{ text }</span>;
    }

    let display = text.substr(0, maxLength).trim();
    if (wordBoundaries) {
        let parts = display.split(' ');
        parts.splice(parts.length - 1, 1);
        display = parts.join(' ');
    }

    return (
      <span>
        { isShortened ? display : text }
        { isShortened ? (
          <button className="btn btn-link btn-xs" data-tip data-for="ellipsis" onClick={() => setShortened(false)}>
            <ReactTooltip id="ellipsis" effect="solid">{ text }</ReactTooltip>
            <i className="fa fa-ellipsis-h"></i><span className="sr-only">Expand description</span>
          </button>
        ) : (
          <button className="btn btn-link btn-xs" onClick={() => setShortened(true)}>
            <i className="fa fa-arrow-left"></i><span className="sr-only">Minimize description</span>
          </button>
        ) }
      </span>
    );
}

export { ChplEllipsis };

ChplEllipsis.propTypes = {
    text: string,
    maxLength: number,
    wordBoundaries: bool,
};
