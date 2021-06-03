/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { bool } from 'prop-types';

import criterionPropType from '../../shared/prop-types/criterion';

function ChplCriterionTitle(props) {
  /* eslint-disable react/destructuring-assignment */
  const [criterion] = useState(props.criterion);
  const [removedClass] = useState(props.useRemovedClass);
  const [displayTitle] = useState(props.displayTitle);
  /* eslint-enable react/destructuring-assignment */

  return (
    <span className={criterion.removed && removedClass ? 'removed' : ''} data-testid="criterion-title">
      { `${(criterion.removed && 'Removed | ')} ${criterion.number}  ${(displayTitle && ' : ' && criterion.title)}` }
    </span>
  );
}

export default ChplCriterionTitle;

ChplCriterionTitle.propTypes = {
  criterion: criterionPropType.isRequired,
  useRemovedClass: bool,
  displayTitle: bool,
};

ChplCriterionTitle.defaultProps = {
  useRemovedClass: false,
  displayTitle: true,
};
