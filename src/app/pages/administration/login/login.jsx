import React from 'react';
import {
  Box,
  Container,
  makeStyles,
} from '@material-ui/core';
import { func, shape } from 'prop-types';

import ChplLogin from 'components/login/login';
import { goToState } from 'services/navigation.service';
import { palette } from 'themes';

const useStyles = makeStyles({
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 100px)',
  },
});

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
  const classes = useStyles();

  const handleLogin = (action) => {
    if (action === 'loggedIn') {
      goToState(state, params, options);
    }
  };

  return (
    <Container disableGutters maxWidth={false} id="login-component">
      <Box py="4vh" bgcolor={palette.background}>
        <Container className={classes.fixFooterSpacing} maxWidth="xs">
          <ChplLogin
            dispatch={handleLogin}
          />
        </Container>
      </Box>
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
