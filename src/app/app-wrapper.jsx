/* global DEVELOPER_MODE */

import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { bool, node } from 'prop-types';

import store from './store';

import { AnalyticsProvider, HashProvider } from 'shared/contexts';
import ApiWrapper from 'api/api-wrapper';
import BrowserWrapper from 'components/browser/browser-wrapper';
import CmsWrapper from 'components/cms-widget/cms-wrapper';
import CompareWrapper from 'components/compare-widget/compare-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';
import { SnackbarWrapper } from 'components/util';
import ChplNavigationBottom from 'navigation/navigation-bottom';
import ChplNavigationTop from 'navigation/navigation-top';
import theme from 'themes/theme';

function AppWrapper({ children, showQueryTools = DEVELOPER_MODE }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarWrapper>
          <ApiWrapper showQueryTools={showQueryTools}>
            <UserWrapper>
              <FlagWrapper>
                <CompareWrapper>
                  <CmsWrapper>
                    <BrowserWrapper>
                      <AnalyticsProvider>
                        <HashProvider>
                          <CookiesProvider defaultSetOptions={{
                            path: '/',
                            expires: new Date(Date.now() + (1000 * 60 * 60 * 10)), // 10 hours
                            domain: '.healthit.gov',
                          }}
                          >
                            <ChplNavigationTop />
                            {children}
                            <ChplNavigationBottom />
                          </CookiesProvider>
                        </HashProvider>
                      </AnalyticsProvider>
                    </BrowserWrapper>
                  </CmsWrapper>
                </CompareWrapper>
              </FlagWrapper>
            </UserWrapper>
          </ApiWrapper>
        </SnackbarWrapper>
      </ThemeProvider>
    </Provider>
  );
}

export default AppWrapper;

AppWrapper.propTypes = {
  children: node.isRequired,
  showQueryTools: bool,
};
