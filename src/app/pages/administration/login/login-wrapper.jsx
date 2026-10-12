import React from 'react';
import { func, shape } from 'prop-types';
import {
  Container,
} from '@material-ui/core';

import ChplLoginPage from './login';

// `returnTo` is a ui-router TargetState resolved by the login state. It is
// absent when this renders as /administration's default content, in which case
// ChplLoginPage's own default sends the user to search after logging in.
function ChplLoginWrapper({ returnTo }) {
  return (
    <Container disableGutters maxWidth={false} id="login-component">
      <ChplLoginPage returnTo={returnTo} />
    </Container>
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
