import React, { useState } from 'react';
import { func, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import ChplChangePassword from './components/change-password';
import ChplForceChangePassword from './components/force-change-password';
import ChplForgotPassword from './components/forgot-password';
import ChplLoggedIn from './components/logged-in';
import ChplResetForgottenPassword from './components/reset-forgotten-password';
import ChplSignin from './components/signin';

import { setLoginState } from 'components/login/userInfo.slice';

function ChplLogin({
  dispatch = () => {},
  uuid = '',
}) {
  const loginState = useSelector((s) => s.userInfo.loginState);
  const reduxDispatch = useDispatch();
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'forceChangePassword':
        setUserName(payload.userName);
        setSessionId(payload.sessionId);
        dispatch('forceChangePassword');
        reduxDispatch(setLoginState('FORCECHANGEPASSWORD'));
        break;
      case 'forgotPassword':
        setUserName(payload?.userName ?? '');
        reduxDispatch(setLoginState('FORGOTPASSWORD'));
        break;
      case 'loggedIn':
        reduxDispatch(setLoginState('LOGGEDIN'));
        dispatch('loggedIn');
        break;
      default:
        console.error(`No action found for ${action}`);
    }
  };

  switch (loginState) {
    case 'CHANGEPASSWORD':
      return <ChplChangePassword />;
    case 'FORCECHANGEPASSWORD':
      return (
        <ChplForceChangePassword
          dispatch={handleDispatch}
          userName={userName}
          sessionId={sessionId}
        />
      );
    case 'FORGOTPASSWORD':
      return <ChplForgotPassword userName={userName} />;
    case 'LOGGEDIN':
      return <ChplLoggedIn />;
    case 'RESETFORGOTTENPASSWORD':
      return <ChplResetForgottenPassword uuid={uuid} />;
    case 'SIGNIN':
      return <ChplSignin dispatch={handleDispatch} />;
      // no default
  }
}

export default ChplLogin;

ChplLogin.propTypes = {
  dispatch: func,
  uuid: string,
};
