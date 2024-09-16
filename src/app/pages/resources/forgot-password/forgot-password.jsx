import React, { useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

import ChplCognitoLogin from 'components/login/cognito-login';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
});

function ChplForgotPassword({ uuid }) {
  const [state, setState] = useState('RESETFORGOTTENPASSWORD');
  const classes = useStyles();

  return (
    <Container className={classes.content}>
      <Typography variant="h1">
        Forgot Password
      </Typography>
      <ChplCognitoLogin
        state={state}
        setState={setState}
        uuid={uuid}
      />
    </Container>
  );
}

export default ChplForgotPassword;

ChplForgotPassword.propTypes = {
  uuid: string.isRequired,
};
