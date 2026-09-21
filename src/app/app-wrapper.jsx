/* global DEVELOPER_MODE */

import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { bool, node } from 'prop-types';

import ChplAppLayout from './app-layout';
import store from './store';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import CmsWrapper from 'components/cms-widget/cms-wrapper';
import CompareWrapper from 'components/compare-widget/compare-wrapper';
import { UserWrapper } from 'components/login';
import { SnackbarWrapper } from 'components/util';
import { AnalyticsProvider, HashProvider } from 'shared/contexts';
import theme from 'themes/theme';

function AppWrapper({ children, showQueryTools = DEVELOPER_MODE }) {
  return (
    <Provider store={store}>
      <CookiesProvider defaultSetOptions={{
        path: '/',
        expires: new Date(Date.now() + (1000 * 60 * 60 * 10)), // 10 hours
        domain: '.healthit.gov',
      }}
      >
        <ThemeProvider theme={theme}>
          <SnackbarWrapper>
            <ApiWrapper showQueryTools={showQueryTools}>
              <UserWrapper>
                <FlagWrapper>
                  <CompareWrapper>
                    <CmsWrapper>
                      <AnalyticsProvider>
                        <HashProvider>
                          <ChplAppLayout>
                            {children}
                          </ChplAppLayout>
                        </HashProvider>
                      </AnalyticsProvider>
                    </CmsWrapper>
                  </CompareWrapper>
                </FlagWrapper>
              </UserWrapper>
            </ApiWrapper>
          </SnackbarWrapper>
        </ThemeProvider>
      </CookiesProvider>
    </Provider>
  );
}

export default AppWrapper;

AppWrapper.propTypes = {
  children: node.isRequired,
  showQueryTools: bool,
};
