import React from 'react';
import { Container } from '@mui/material';
import { func, shape } from 'prop-types';

import ChplLogin from 'components/login/login';
import { ChplPageBody, ChplPageHeader } from 'components/util';
import { goToState } from 'services/navigation.service';

const styles = {
  // lets the page body grow to push the footer down, as it does when it sits directly in the layout
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
};

// `returnTo` is a ui-router TargetState resolved by the login state. It is
// absent when this renders as /administration's default content, in which case
// the default here sends the user to search after logging in.
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
    <Container disableGutters maxWidth={false} id="login-component" sx={styles.container}>
      <ChplPageHeader text="Administrator Login" maxWidth="xs" />
      <ChplPageBody maxWidth="xs">
        <ChplLogin
          dispatch={handleLogin}
        />
      </ChplPageBody>
    </Container>
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
