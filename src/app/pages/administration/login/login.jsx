import React from 'react';
import { func, shape } from 'prop-types';
import {
  Container,
} from '@material-ui/core';

import AppWrapper from 'app-wrapper';
import { ChplLogin } from 'components/login';
import { getAngularService } from 'services/angular-react-helper';

function ChplLoginPage(props) {
  /* eslint-disable react/destructuring-assignment */
  const $state = getAngularService('$state');
  const state = props.returnTo.state();
  const params = props.returnTo.params();
  const options = { ...props.returnTo.options(), reload: true };
  /* eslint-enable react/destructuring-assignment */

  const handleLogin = (action) => {
    if (action === 'loggedIn') {
      $state.go(state, params, options);
    }
  };

  return (
    <AppWrapper>
      <Container id="login-component">
        <ChplLogin
          dispatch={handleLogin}
        />
      </Container>
    </AppWrapper>
  );
}

export default ChplLoginPage;

ChplLoginPage.propTypes = {
  returnTo: shape({
    state: func.isRequired,
    params: func.isRequired,
    options: func.isRequired,
  }),
};

ChplLoginPage.defaultProps = {
  returnTo: {
    state: () => 'search',
    params: () => {},
    options: () => {},
  },
};
