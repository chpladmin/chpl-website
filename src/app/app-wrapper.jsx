import React from 'react';
import { bool, node } from 'prop-types';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';

import ApiWrapper from 'api/api-wrapper';
import BrowserWrapper from 'components/browser/browser-wrapper';
import CmsWrapper from 'components/cms-widget/cms-wrapper';
import CompareWrapper from 'components/compare-widget/compare-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

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

function AppWrapper({ children, showQueryTools }) {
  fetchAuthSession().then((result) => {
    const { accessToken, idToken } = result.tokens;
    console.log({ accessToken, idToken });
    console.log(result);
  });

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <p>Welcome {user.username}</p>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
      <UserWrapper>
        <ApiWrapper showQueryTools={showQueryTools}>
          <FlagWrapper>
            <CompareWrapper>
              <CmsWrapper>
                <BrowserWrapper>
                  {children}
                </BrowserWrapper>
              </CmsWrapper>
            </CompareWrapper>
          </FlagWrapper>
        </ApiWrapper>
      </UserWrapper>
    </Authenticator>
  );
}

export default withAuthenticator(AppWrapper);

AppWrapper.propTypes = {
  children: node.isRequired,
  showQueryTools: bool,
};

AppWrapper.defaultProps = {
  showQueryTools: true,
};
