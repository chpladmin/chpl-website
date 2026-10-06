/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { bool } from 'prop-types';

import criterionPropType from '../../shared/prop-types/criterion';

import { utilStyles } from 'themes';

function ChplCriterionTitle({
  criterion,
  useRemovedClass = false,
  displayTitle = true,
}) {
  const [removedClass] = useState(useRemovedClass);

  return (
    <Box component="span" sx={criterion.removed && removedClass ? utilStyles.removedText : undefined} data-testid="criterion-title">
      { `${(criterion.removed ? 'Removed | ' : '')} ${criterion.number}  ${(displayTitle && ' : ' && criterion.title)}` }
    </Box>
  );
}

export default ChplCriterionTitle;

ChplCriterionTitle.propTypes = {
  criterion: criterionPropType.isRequired,
  useRemovedClass: bool,
  displayTitle: bool,
};
