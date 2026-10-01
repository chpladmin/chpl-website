import React from 'react';
import { bool, func, number } from 'prop-types';

import { ChplProgress } from 'components/util';

function ChplConfirmProgress({
  canNext,
  canPrevious,
  dispatch,
  value,
}) {
  const steps = ['Developer', 'Product', 'Version', 'Listing'];

  return (
    <ChplProgress
      steps={steps}
      canNext={canNext}
      canPrevious={canPrevious}
      dispatch={dispatch}
      value={value}
    />
  );
}

export default ChplConfirmProgress;

ChplConfirmProgress.propTypes = {
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
