import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from '../aws-exports';
import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';
import ChplAnnouncementsDisplay from 'components/announcement/announcements-display';

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  }
})

function ChplNavigationBottom() {
  return (
    <UserWrapper>
      <ApiWrapper showQueryTools={false}>
        <Authenticator>
          {({ signOut, user }) => (
            <div>
              <p>Welcome {user.username}</p>
              <button onClick={signOut}>Sign out</button>
            </div>
          )}
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
        </Authenticator>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplNavigationBottom;

ChplNavigationBottom.propTypes = {
};
