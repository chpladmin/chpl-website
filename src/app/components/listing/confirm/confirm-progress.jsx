import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';
import { bool, func, number } from 'prop-types';

import { ChplProgress } from 'components/util';
import theme from 'themes/theme';

function ChplConfirmProgress(props) {
  const steps = ['Developer', 'Product', 'Version', 'Listing'];

  return (
    <ThemeProvider theme={theme}>
      <ChplProgress
        steps={steps}
        {...props}
      />
    </ThemeProvider>
  );
}

export default ChplConfirmProgress;

ChplConfirmProgress.propTypes = {
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
