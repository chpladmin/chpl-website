import React from 'react';
import { func, shape } from 'prop-types';

import ChplLogin from 'components/login/login';
import { ChplPageBody, ChplPageHeader } from 'components/util';
import { goToState } from 'services/navigation.service';

function ChplLoginPage({
  returnTo = {
    state: () => 'search',
    params: () => {},
    options: () => {},
  },
}) {
  const state = returnTo.state();
  const params = returnTo.params();
  const options = { ...returnTo.options(), reload: true };

  const handleLogin = (action) => {
    if (action === 'loggedIn') {
      goToState(state, params, options);
    }
  };

  return (
    <>
      <ChplPageHeader text="Administrator Login" maxWidth="xs" />
      <ChplPageBody maxWidth="xs">
        <ChplLogin
          dispatch={handleLogin}
        />
      </ChplPageBody>
    </>
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
