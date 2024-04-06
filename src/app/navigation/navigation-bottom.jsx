import React, { useContext, useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import { Hub } from 'aws-amplify/utils';
import '@aws-amplify/ui-react/styles.css';

import awsExports from '../aws-exports';

import ChplAnnouncementsDisplay from 'components/announcement/announcements-display';
import { FlagContext } from 'shared/contexts';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: awsExports.USER_POOL_ID,
      userPoolClientId: awsExports.USER_POOL_CLIENT_ID,
      allowGuestAccess: false, // maybe change this
      loginWith: {
        oauth: {
          domain: awsExports.DOMAIN,
          redirectSignIn: [awsExports.REDIRECT_LOCAL],
          redirectSignOut: [awsExports.REDIRECT_LOCAL],
          responseType: 'token',
          scopes: [
            'aws.cognito.signin.user.admin',
            'email',
            'openid',
            'phone',
            'profile',
          ],
        },
      },
    },
  },
});

Hub.listen('auth', ({ payload }) => {
  switch (payload.event) {
    case 'signedIn':
      console.log('user have been signedIn successfully.');
      fetchAuthSession().then((result) => {
        const { idToken } = result.tokens ?? {};
        console.log({ idToken });
        console.log(idToken?.toString());
        // window.localStorage.setItem('ngStorage-jwtToken', '' + idToken?.toString());
      });
      break;
    case 'signedOut':
      console.log('user have been signedOut successfully.');
      break;
    case 'tokenRefresh':
      console.log('auth tokens have been refreshed.');
      break;
    case 'tokenRefresh_failure':
      console.log('failure while refreshing auth tokens.');
      break;
    case 'signInWithRedirect':
      console.log('signInWithRedirect API has successfully been resolved.');
      break;
    case 'signInWithRedirect_failure':
      console.log('failure while trying to resolve signInWithRedirect API.');
      break;
    case 'customOAuthState':
      console.log('custom state returned from CognitoHosted UI');
      break;
    default:
      console.log(payload);
  }
});

function ChplNavigationBottom() {
  const { isOn } = useContext(FlagContext);
  const [ssoIsOn, setSsoIsOn] = useState(false);

  useEffect(() => {
    setSsoIsOn(isOn('sso'));
  }, [isOn]);

  if (ssoIsOn) {
    return (
      <Authenticator>
        {({ signOut, user }) => (
          <footer>
            <nav className="navbar navbar-default navbar-fixed-bottom">
              <div className="container-fluid">
                <p className="navbar-left nav-text spaced-out">
                  <a href="#/search">Home</a>
                  {' | '}
                  <a href="http://www.hhs.gov/privacy.html">Privacy Policy</a>
                  {' | '}
                  <a href="http://www.hhs.gov/disclaimer.html">Disclaimer</a>
                  {' | '}
                  <a href="https://www.whitehouse.gov/">White House</a>
                  {' | '}
                  <a href="http://www.hhs.gov/">HHS</a>
                  {' | '}
                  <a href="https://www.usa.gov/">USA.gov</a>
                  {' | '}
                  <a href="http://www.hhs.gov/plugins.html">Viewers &amp; Players</a>
                  {' | '}
                  <a href="https://gobierno.usa.gov/">GobiernoUSA.gov</a>
                </p>
                <div className="navbar-nav navbar-right">
                  <ChplAnnouncementsDisplay />
                </div>
                <h1>
                  Hello
                  {user.username}
                </h1>
                <button onClick={signOut}>Sign out</button>
              </div>
            </nav>
          </footer>
        )}
      </Authenticator>
    );
  }

  return (
    <footer>
      <nav className="navbar navbar-default navbar-fixed-bottom">
        <div className="container-fluid">
          <p className="navbar-left nav-text spaced-out">
            <a href="#/search">Home</a>
            {' | '}
            <a href="http://www.hhs.gov/privacy.html">Privacy Policy</a>
            {' | '}
            <a href="http://www.hhs.gov/disclaimer.html">Disclaimer</a>
            {' | '}
            <a href="https://www.whitehouse.gov/">White House</a>
            {' | '}
            <a href="http://www.hhs.gov/">HHS</a>
            {' | '}
            <a href="https://www.usa.gov/">USA.gov</a>
            {' | '}
            <a href="http://www.hhs.gov/plugins.html">Viewers &amp; Players</a>
            {' | '}
            <a href="https://gobierno.usa.gov/">GobiernoUSA.gov</a>
          </p>
          <div className="navbar-nav navbar-right">
            <ChplAnnouncementsDisplay />
          </div>
        </div>
      </nav>
    </footer>
  );
}

export default ChplNavigationBottom;

ChplNavigationBottom.propTypes = {
};
