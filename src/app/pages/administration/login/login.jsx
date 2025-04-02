import React from 'react';
import {
  Box,
  Container,
  makeStyles,
} from '@material-ui/core';
import { func, shape } from 'prop-types';

import ChplLogin from 'components/login/login';
import { getAngularService } from 'services/angular-react-helper';
import { palette } from 'themes';

const useStyles = makeStyles({
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 100px)',
  },
});

function ChplLoginPage(props) {
  const $state = getAngularService('$state');
  /* eslint-disable react/destructuring-assignment */
  const state = props.returnTo.state();
  const params = props.returnTo.params();
  const options = { ...props.returnTo.options(), reload: true };
  /* eslint-enable react/destructuring-assignment */
  const classes = useStyles();

  const handleLogin = (action) => {
    if (action === 'loggedIn') {
      $state.go(state, params, options);
    }
  };

  return (
    <Box py="4vh" bgcolor={palette.background}>
      <Container className={classes.fixFooterSpacing} maxWidth="xs">
        <ChplLogin
          dispatch={handleLogin}
        />
      </Container>
    </Box>
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
