import React from 'react';

import ApiWrapper from 'api/api-wrapper';
import CompareWrapper from 'components/compare-widget/compare-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

function AppWrapper({ children }) {
  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagWrapper>
          <CompareWrapper>
            {children}
          </CompareWrapper>
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default AppWrapper;
