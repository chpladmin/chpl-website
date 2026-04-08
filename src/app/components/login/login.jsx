import React, { useContext, useState } from 'react';
import { func, string } from 'prop-types';

import ChplChangePassword from './components/change-password';
import ChplForceChangePassword from './components/force-change-password';
import ChplForgotPassword from './components/forgot-password';
import ChplLoggedIn from './components/logged-in';
import ChplResetForgottenPassword from './components/reset-forgotten-password';
import ChplSignin from './components/signin';

import { UserContext } from 'shared/contexts';

function ChplLogin({
  dispatch = () => {},
  uuid = '',
}) {
  const { loginWidgetState, setLoginWidgetState } = useContext(UserContext);
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'forceChangePassword':
        setUserName(payload.userName);
        setSessionId(payload.sessionId);
        dispatch('forceChangePassword');
        setLoginWidgetState('FORCECHANGEPASSWORD');
        break;
      case 'forgotPassword':
        setUserName(payload?.userName ?? '');
        setLoginWidgetState('FORGOTPASSWORD');
        break;
      case 'loggedIn':
        setLoginWidgetState('LOGGEDIN');
        dispatch('loggedIn');
        break;
      default:
        console.error(`No action found for ${action}`);
    }
  };

  switch (loginWidgetState) {
    case 'CHANGEPASSWORD':
      return (
        <ChplChangePassword />
      );
    case 'FORCECHANGEPASSWORD':
      return (
        <ChplForceChangePassword
          dispatch={handleDispatch}
          userName={userName}
          sessionId={sessionId}
        />
      );
    case 'FORGOTPASSWORD':
      return (
        <ChplForgotPassword
          userName={userName}
        />
      );
    case 'LOGGEDIN':
      return <ChplLoggedIn />;
    case 'RESETFORGOTTENPASSWORD':
      return (
        <ChplResetForgottenPassword
          uuid={uuid}
        />
      );
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
