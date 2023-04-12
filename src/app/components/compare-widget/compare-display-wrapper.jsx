import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';

import ChplCompareDisplay from './compare-display';
import CompareWrapper from './compare-wrapper';

import BrowserWrapper from 'components/browser/browser-wrapper';
import theme from 'themes/theme';

function ChplCompareDisplayWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <CompareWrapper>
        <BrowserWrapper>
          <ChplCompareDisplay />
        </BrowserWrapper>
      </CompareWrapper>
    </ThemeProvider>
  );
}

export default ChplCompareDisplayWrapper;
