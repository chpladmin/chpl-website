import React, { useState } from 'react';
import { bool, number, string } from 'prop-types';

import { ChplTooltip } from './chpl-tooltip';

function ChplEllipsis(props) {
  const [isShortened, setShortened] = useState(true);

  if (props.text.length <= props.maxLength) {
    return <span>{props.text}</span>;
  }

  let display = props.text.substr(0, props.maxLength).trim();
  if (props.wordBoundaries) {
    const parts = display.split(' ');
    if (parts.length > 1) {
      parts.splice(parts.length - 1, 1);
    }
    display = parts.join(' ');
  }

  return (
    <span>
      {isShortened ? display : props.text}
      {display !== props.text && isShortened
       && (
       <ChplTooltip title={props.text}>
         <button className="btn btn-link btn-xs" onClick={() => setShortened(false)}>
           <i className="fa fa-ellipsis-h" />
           <span className="sr-only">Expand description</span>
         </button>
       </ChplTooltip>
       )}
      {display !== props.text && !isShortened
       && (
       <button className="btn btn-link btn-xs" onClick={() => setShortened(true)}>
         <i className="fa fa-arrow-left" />
         <span className="sr-only">Minimize description</span>
       </button>
       )}
    </span>
  );
}

export { ChplEllipsis };

ChplEllipsis.propTypes = {
  text: string,
  maxLength: number,
  wordBoundaries: bool,
};
