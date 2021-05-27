import React, { useState } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { bool } from 'prop-types';

import criterion from '../../shared/prop-types/criterion';

function ChplCriterionTitle(props) {
  const crit = useState(props.criterion)[0];
  const removedClass = useState(props.useRemovedClass)[0];

  return (
    <span className={crit.removed && removedClass ? 'removed' : ''}>
      { `${(crit.removed ? 'Removed | ' : '')} ${crit.number} : ${crit.title}` }
    </span>
  );
}

export default ChplCriterionTitle;

ChplCriterionTitle.propTypes = {
  criterion: criterion.isRequired,
  useRemovedClass: bool,
};

ChplCriterionTitle.defaultProps = {
  useRemovedClass: false,
};
