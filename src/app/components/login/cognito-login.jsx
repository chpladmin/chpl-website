import React, { useState } from 'react';
import { func, string } from 'prop-types';

import ChplChangePassword from './components/change-password';
import ChplForceChangePassword from './components/force-change-password';
import ChplForgotPassword from './components/forgot-password';
import ChplLoggedIn from './components/logged-in';
import ChplResetForgottenPassword from './components/reset-forgotten-password';
import ChplSignin from './components/signin';

function ChplCognitoLogin({
  dispatch,
  setState,
  state,
  uuid,
}) {
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'changePassword':
        setState('CHANGEPASSWORD');
        break;
      case 'forceChangePassword':
        setUserName(payload.userName);
        setSessionId(payload.sessionId);
        dispatch('forceChangePassword');
        setState('FORCECHANGEPASSWORD');
        break;
      case 'forgotPassword':
        setState('FORGOTPASSWORD');
        break;
      case 'isLoggedIn':
        setState('LOGGEDIN');
        break;
      case 'loggedIn':
        setState('LOGGEDIN');
        dispatch('loggedIn');
        break;
      case 'loggedOut':
        setState('SIGNIN');
        break;
      default:
        console.error(`No action found for ${action}`);
    }
  };

  switch (state) {
    case 'CHANGEPASSWORD':
      return (
        <ChplChangePassword dispatch={handleDispatch} />
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
      return <ChplForgotPassword dispatch={handleDispatch} />;
    case 'LOGGEDIN':
      return <ChplLoggedIn dispatch={handleDispatch} />;
    case 'RESETFORGOTTENPASSWORD':
      return (
        <ChplResetForgottenPassword
          dispatch={handleDispatch}
          uuid={uuid}
        />
      );
    case 'SIGNIN':
      return <ChplSignin dispatch={handleDispatch} />;
      // no default
  }
}

export default ChplCognitoLogin;

ChplCognitoLogin.propTypes = {
  dispatch: func,
  setState: func,
  state: string,
  uuid: string,
};

ChplCognitoLogin.defaultProps = {
  dispatch: () => {},
  setState: () => {},
  state: 'SIGNIN',
  uuid: '',
};
