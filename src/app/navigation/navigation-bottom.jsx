import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';

import awsExports from '../aws-exports';

import AppWrapper from 'app-wrapper';
import ChplAnnouncementsDisplay from 'components/announcement/announcements-display';

function ChplNavigationBottom() {
  useEffect(() => {
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
    fetchAuthSession().then((result) => {
      const { accessToken, idToken } = result.tokens ?? {};
      console.log({ accessToken, idToken });
      console.log(result);
      console.log(accessToken.toString());
      console.log(idToken.toString());
    });
  }, []);

  return (
    <Authenticator>
    <AppWrapper showQueryTools={false}>
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
    </AppWrapper>
    </Authenticator>
  );
}

export default ChplNavigationBottom;

ChplNavigationBottom.propTypes = {
};
