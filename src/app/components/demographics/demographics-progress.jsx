import React from 'react';
import { bool, func, number } from 'prop-types';

import { ChplProgress } from 'components/util';

function ChplDemographicsProgress(props) {
  const steps = ['Introduction', 'Demographics', 'Confirmation'];

  return (
    <ChplProgress
      buttonContainerTop="0px"
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
