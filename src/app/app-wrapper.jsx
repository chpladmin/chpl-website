import React from 'react';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

function AppWrapper({ children }) {
  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagWrapper>
          {children}
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default AppWrapper;
