import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';

import ChplCmsDisplay from './cms-display';
import CmsWrapper from './cms-wrapper';

import theme from 'themes/theme';

function ChplCmsDisplayWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <CmsWrapper>
        <ChplCmsDisplay />
      </CmsWrapper>
    </ThemeProvider>
  );
}

export default ChplCmsDisplayWrapper;
