import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';
import { bool, func, number } from 'prop-types';

import { ChplProgress } from 'components/util';
import theme from 'themes/theme';

function ChplAttestationProgress(props) {
  const steps = ['Introduction', 'Attestations', 'Electronic Signature', 'Confirmation'];

  return (
    <ThemeProvider theme={theme}>
      <ChplProgress
        steps={steps}
        {...props}
      />
    </ThemeProvider>
  );
}

export default ChplAttestationProgress;

ChplAttestationProgress.propTypes = {
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
