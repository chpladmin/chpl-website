import React from 'react';
import { bool, func, number } from 'prop-types';

import { ChplProgress } from 'components/util';

function ChplDemographicsProgress(props) {
  const steps = ['Introduction', 'Listings', 'Service Base URL List', 'Confirmation'];

  return (
    <ChplProgress
      buttonContainerTop="100px"
      steps={steps}
      {...props}
    />
  );
}

export default ChplDemographicsProgress;

ChplDemographicsProgress.propTypes = {
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
