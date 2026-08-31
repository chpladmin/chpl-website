import React from 'react';
import { bool, func, number } from 'prop-types';

import { ChplProgress } from 'components/util';

function ChplRwtResultsProgress(props) {
  const steps = ['Introduction', 'Listings', 'Real World Testing Results URL', 'Confirmation'];

  return (
    <ChplProgress
      buttonContainerTop="0px"
      steps={steps}
      {...props}
    />
  );
}

export default ChplRwtResultsProgress;

ChplRwtResultsProgress.propTypes = {
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
