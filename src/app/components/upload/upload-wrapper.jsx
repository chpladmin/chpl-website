import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';

import ChplUploadListings from './upload-listings';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';
import theme from 'themes/theme';

function ChplUploadWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <UserWrapper>
        <ApiWrapper>
          <FlagWrapper>
            <ChplUploadListings />
          </FlagWrapper>
        </ApiWrapper>
      </UserWrapper>
    </ThemeProvider>
  );
}

export default ChplUploadWrapper;

ChplUploadWrapper.propTypes = {
};
