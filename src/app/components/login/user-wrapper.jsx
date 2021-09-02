import React, { useEffect, useState } from 'react';
import { element } from 'prop-types';

import { getAngularService } from '../../services/angular-react-helper';
import { UserContext } from '../../shared/contexts';

function UserWrapper(props) {
  const authService = getAngularService('authService');
  const { children } = props;
  const [user, setUser] = useState({});
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setImpersonating(authService.isImpersonating());
  }, [authService]);

  const userState = {
    user,
    setUser,
    impersonating,
    setImpersonating,
  };

  return (
    <UserContext.Provider value={userState}>
      { children }
    </UserContext.Provider>
  );
}

export default UserWrapper;

UserWrapper.propTypes = {
  children: element.isRequired,
};
