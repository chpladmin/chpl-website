import React from 'react';
import {
  ThemeProvider,
  createMuiTheme,
  Typography,
} from '@material-ui/core';

import SgCompareWidget from './sg-compare-widget';
import SgCmsWidget from './sg-cms-widget';
import SgBackToTop from './sg-back-to-the-top';
import Elements from './elements';
import theme from '../../../themes/theme';

const defaultTheme = createMuiTheme({});

function ChplStyleGuide() {
  
  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
      <div>
        <Typography variant='h1'>CHPL Material UI</Typography>
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
      <SgCompareWidget/>
      <SgCmsWidget/>
      <SgBackToTop/>  
      </ThemeProvider>
    </div>
  );
}

export default ChplStyleGuide;