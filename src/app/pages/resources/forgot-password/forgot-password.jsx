import React, { useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

import ChplLogin from 'components/login/login';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
    padding: '16px',
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 136px)',
  },
});

function ChplForgotPassword({ uuid }) {
  const [state, setState] = useState('RESETFORGOTTENPASSWORD');
  const classes = useStyles();

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="xs" className={classes.content}>
        <Typography variant="h1">
          Forgot Password
        </Typography>
      </Container>
      <Container maxWidth="xs">
        <ChplLogin
          setState={setState}
          state={state}
          uuid={uuid}
        />
      </Container>
    </div>
  );
}

export default ChplForgotPassword;

ChplForgotPassword.propTypes = {
  uuid: string.isRequired,
};
