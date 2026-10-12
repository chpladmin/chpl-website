/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { bool } from 'prop-types';

import criterionPropType from '../../shared/prop-types/criterion';

import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplCriterionTitle({
  criterion,
  useRemovedClass = false,
  displayTitle = true,
}) {
  const [removedClass] = useState(useRemovedClass);
  const classes = useStyles();

  return (
    <span className={criterion.removed && removedClass ? classes.removedText : ''} data-testid="criterion-title">
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
