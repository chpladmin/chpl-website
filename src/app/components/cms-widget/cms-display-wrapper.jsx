import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';

import ChplCmsDisplay from './cms-display';
import CmsWrapper from './cms-wrapper';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import theme from 'themes/theme';

function ChplCmsDisplayWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <ApiWrapper showQueryTools={false}>
        <FlagWrapper>
          <CmsWrapper>
            <ChplCmsDisplay />
          </CmsWrapper>
        </FlagWrapper>
      </ApiWrapper>
    </ThemeProvider>
  );
}

export default ChplCmsDisplayWrapper;
