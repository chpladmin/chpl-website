/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { bool } from 'prop-types';

import criterionPropType from '../../shared/prop-types/criterion';

function ChplCriterionTitle({
  criterion,
  useRemovedClass = false,
  displayTitle = true,
}) {
  const [removedClass] = useState(useRemovedClass);

  return (
    <span className={criterion.removed && removedClass ? 'removed' : ''} data-testid="criterion-title">
      { `${(criterion.removed ? 'Removed | ' : '')} ${criterion.number}  ${(displayTitle && ' : ' && criterion.title)}` }
    </span>
  );
}

export default ChplCriterionTitle;

ChplCriterionTitle.propTypes = {
  criterion: criterionPropType.isRequired,
  useRemovedClass: bool,
  displayTitle: bool,
};
