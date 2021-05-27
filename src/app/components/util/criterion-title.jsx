/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { bool } from 'prop-types';

import criterionPropType from '../../shared/prop-types/criterion';

function ChplCriterionTitle({ criterion, useRemovedClass }) {
  const currentCriterion = useState(criterion)[0];
  const removedClass = useState(useRemovedClass)[0];

  return (
    <span className={currentCriterion.removed && removedClass ? 'removed' : ''}>
      { `${(currentCriterion.removed ? 'Removed | ' : '')} ${currentCriterion.number} : ${currentCriterion.title}` }
    </span>
  );
}

export default ChplCriterionTitle;

ChplCriterionTitle.propTypes = {
  criterion: criterionPropType.isRequired,
  useRemovedClass: bool,
};

ChplCriterionTitle.defaultProps = {
  useRemovedClass: false,
};
