import React from 'react';

import ApiWrapper from 'api/api-wrapper';
import CmsWrapper from 'components/cms-widget/cms-wrapper';
import CompareWrapper from 'components/compare-widget/compare-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

function AppWrapper({ children }) {
  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagWrapper>
          <CompareWrapper>
            <CmsWrapper>
              {children}
            </CmsWrapper>
          </CompareWrapper>
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default AppWrapper;
