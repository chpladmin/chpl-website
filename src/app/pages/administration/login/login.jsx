import React, { useContext } from 'react';
import { func, shape } from 'prop-types';

import { ChplCognitoLogin, ChplLogin } from 'components/login';
import { getAngularService } from 'services/angular-react-helper';
import { FlagContext } from 'shared/contexts';

function ChplLoginPage(props) {
  const { ssoIsOn } = useContext(FlagContext);
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

  if (ssoIsOn) {
    return (
      <ChplCognitoLogin
        dispatch={handleLogin}
      />
    );
  }

  return (
    <ChplLogin
      dispatch={handleLogin}
    />
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
