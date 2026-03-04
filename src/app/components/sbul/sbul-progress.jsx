import React from 'react';
import { bool, func, number } from 'prop-types';

import { ChplProgress } from 'components/util';
import theme from 'themes/theme';

function ChplSbulProgress(props) {
  const steps = ['Introduction', 'Listings', 'Service Base URL List', 'Confirmation'];

  return (
    <ChplProgress
      steps={steps}
      {...props}
    />
  );
}

export default ChplSbulProgress;

ChplSbulProgress.propTypes = {
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
