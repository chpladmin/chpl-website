import React from 'react';
import {
  ThemeProvider,
  createTheme,
  Typography,
} from '@material-ui/core';

import theme from '../../../themes/theme';

import SgCompareWidget from './sg-compare-widget';
import SgCmsWidget from './sg-cms-widget';
import SgBackToTop from './sg-back-to-the-top';
import Elements from './elements';

const defaultTheme = createTheme({});

function ChplStyleGuide() {
  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <div>
          <Typography variant="h1">CHPL Material UI</Typography>
          <ThemeProvider theme={theme}>
            <Elements />
          </ThemeProvider>
        </div>
        {/*
      <div>
        <Typography variant='h1'>Default Material UI</Typography>
        <Elements />
      </div>
      */}
        <SgCompareWidget />
        <SgCmsWidget />
        <SgBackToTop />
      </ThemeProvider>
    </div>
  );
}

export default ChplStyleGuide;
