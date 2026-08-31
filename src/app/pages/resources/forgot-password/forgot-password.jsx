import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';
import { useDispatch } from 'react-redux';

import ChplLogin from 'components/login/login';
import { setLoginState } from 'components/login/userInfo.slice';

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
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(setLoginState('RESETFORGOTTENPASSWORD'));
  }, []);

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="xs" className={classes.content}>
        <Typography variant="h1">
          Forgot Password
        </Typography>
      </Container>
      <Container maxWidth="xs">
        <ChplLogin
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
