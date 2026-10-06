import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { string } from 'prop-types';
import { useDispatch } from 'react-redux';

import ChplLogin from 'components/login/login';
import { setLoginState } from 'components/login/userInfo.slice';

const styles = {
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
    padding: '16px',
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 136px)',
  },
};

function ChplForgotPassword({ uuid }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoginState('RESETFORGOTTENPASSWORD'));
  }, []);

  return (
    <Box sx={styles.fixFooterSpacing}>
      <Container maxWidth="xs" sx={styles.content}>
        <Typography variant="h1">
          Forgot Password
        </Typography>
      </Container>
      <Container maxWidth="xs">
        <ChplLogin
          uuid={uuid}
        />
      </Container>
    </Box>
  );
}

export default ChplForgotPassword;

ChplForgotPassword.propTypes = {
  uuid: string.isRequired,
};
