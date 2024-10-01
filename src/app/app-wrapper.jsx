/* global DEVELOPER_MODE */

import React from 'react';
import { bool, node } from 'prop-types';

import { AnalyticsProvider } from 'shared/contexts';
import ApiWrapper from 'api/api-wrapper';
import BrowserWrapper from 'components/browser/browser-wrapper';
import CmsWrapper from 'components/cms-widget/cms-wrapper';
import CompareWrapper from 'components/compare-widget/compare-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

function AppWrapper({ children, showQueryTools }) {
  return (
    <UserWrapper>
      <ApiWrapper showQueryTools={showQueryTools}>
        <FlagWrapper>
          <CompareWrapper>
            <CmsWrapper>
              <BrowserWrapper>
                <AnalyticsProvider>
                  {children}
                </AnalyticsProvider>
              </BrowserWrapper>
            </CmsWrapper>
          </CompareWrapper>
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default AppWrapper;

AppWrapper.propTypes = {
  children: node.isRequired,
  showQueryTools: bool,
};

AppWrapper.defaultProps = {
  showQueryTools: DEVELOPER_MODE,
};
