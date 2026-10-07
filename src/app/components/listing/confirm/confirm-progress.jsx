import React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { bool, func, number } from 'prop-types';

import { ChplProgress } from 'components/util';
import theme from 'themes/theme';

function ChplConfirmProgress(props) {
  const steps = ['Developer', 'Product', 'Version', 'Listing'];

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <ChplProgress
          buttonContainerMarginTop="-16px"
          steps={steps}
          {...props}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default ChplConfirmProgress;

ChplConfirmProgress.propTypes = {
  dispatch: func.isRequired,
  value: number.isRequired,
  canNext: bool.isRequired,
  canPrevious: bool.isRequired,
};
