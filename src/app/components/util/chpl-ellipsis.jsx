import React, { useState } from 'react';
import { bool, number, string } from 'prop-types';

import ChplTooltip from './chpl-tooltip';

function ChplEllipsis(props) {
  const [isShortened, setShortened] = useState(true);
  const { text } = props;
  const { wordBoundaries } = props;
  const { maxLength } = props;

  if (!text) {
    return null;
  }

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  let display = text.substr(0, maxLength).trim();
  if (wordBoundaries) {
    const parts = display.split(' ');
    if (parts.length > 1) {
      parts.splice(parts.length - 1, 1);
    }
    display = parts.join(' ');
  }

  return (
    <span>
      {isShortened ? display : text}
      {display !== text && isShortened
       && (
         <ChplTooltip title={text}>
           <button type="button" className="btn btn-link btn-xs" onClick={() => setShortened(false)}>
             <i className="fa fa-ellipsis-h" />
             <span className="sr-only">Expand description</span>
           </button>
         </ChplTooltip>
       )}
      {display !== text && !isShortened
       && (
         <button type="button" className="btn btn-link btn-xs" onClick={() => setShortened(true)}>
           <i className="fa fa-arrow-left" />
           <span className="sr-only">Minimize description</span>
         </button>
       )}
    </span>
  );
}

export default ChplEllipsis;

ChplEllipsis.propTypes = {
  text: string.isRequired,
  maxLength: number,
  wordBoundaries: bool,
};

ChplEllipsis.defaultProps = {
  maxLength: 80,
  wordBoundaries: false,
};
