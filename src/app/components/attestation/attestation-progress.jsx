import React from 'react';
import { bool, func, number } from 'prop-types';

import { ChplProgress } from 'components/util';

function ChplAttestationProgress({
  canNext,
  canPrevious,
  dispatch,
  value,
}) {
  const steps = ['Introduction', 'Attestations', 'Electronic Signature', 'Confirmation'];

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

export default ChplAttestationProgress;

ChplAttestationProgress.propTypes = {
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
