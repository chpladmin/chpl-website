import React, { useState } from 'react';
import { string } from 'prop-types';

import ChplLogin from 'components/login/login';
import ChplResetForgottenPassword from 'components/login/components/reset-forgotten-password';
import { ChplPageBody, ChplPageHeader } from 'components/util';
import { goToState } from 'services/navigation.service';

function ChplForgotPassword({ uuid }) {
  // the reset step is local to this page; the global login state also drives the header login panel
  const [isReset, setIsReset] = useState(false);

  // the reset form hands off to sign in; once signed in, leave the reset page for the home page
  const handleLogin = (action) => {
    if (action === 'loggedIn') {
      goToState('search');
    }
  };

  return (
    <>
      <ChplPageHeader text="Forgot Password" maxWidth="xs" />
      <ChplPageBody maxWidth="xs">
        { isReset
          ? (
            <ChplLogin
              dispatch={handleLogin}
            />
          ) : (
            <ChplResetForgottenPassword
              onReset={() => setIsReset(true)}
              uuid={uuid}
            />
          )}
      </ChplPageBody>
    </>
  );
}

export default ChplForgotPassword;

ChplForgotPassword.propTypes = {
  uuid: string.isRequired,
};
