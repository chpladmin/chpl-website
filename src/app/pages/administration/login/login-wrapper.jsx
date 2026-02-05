import React from 'react';
import { func, shape } from 'prop-types';
import {
  Container,
} from '@material-ui/core';

import ChplLoginPage from './login';

import AppWrapper from 'app-wrapper';

function ChplLoginWrapper(props = {
  returnTo: {
    state: () => 'search',
    params: () => {},
    options: () => {},
  },
}) {
  return (
    <AppWrapper>
      <Container disableGutters maxWidth={false} id="login-component">
        <ChplLoginPage
          {...props}
        />
      </Container>
    </AppWrapper>
  );
}

export default ChplLoginWrapper;

ChplLoginWrapper.propTypes = {
  returnTo: shape({
    state: func.isRequired,
    params: func.isRequired,
    options: func.isRequired,
  }),
};
