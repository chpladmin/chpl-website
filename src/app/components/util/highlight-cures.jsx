import React, { useState } from 'react';
import { string } from 'prop-types';

function ChplHighlightCures(props) {
  /* eslint-disable react/destructuring-assignment */
  const [text] = useState(props.text.replace('(Cures Update)', ''));
  const [isCures] = useState(props.text.indexOf('(Cures Update)') > -1);
  /* eslint-enable react/destructuring-assignment */

  return (
    <>
      {text}
      {isCures
       && (
         <span className="cures-update"> (Cures Update)</span>
       )}
    </>
  );
}

export default ChplHighlightCures;

ChplHighlightCures.propTypes = {
  text: string.isRequired,
};
