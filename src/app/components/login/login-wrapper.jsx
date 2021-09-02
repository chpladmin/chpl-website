import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';

import theme from '../../themes/theme';
import ChplLogin from './login';
import UserWrapper from './user-wrapper';

function LoginWrapper() {
  return (
    <UserWrapper>
      <ThemeProvider theme={theme}>
        <ChplLogin />
      </ThemeProvider>
    </UserWrapper>
  );
}

export default LoginWrapper;
