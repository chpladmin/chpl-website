/* global DEVELOPER_MODE */

import React from 'react';
import {
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import { bool, node } from 'prop-types';
import { CookiesProvider } from 'react-cookie';

import { AnalyticsProvider } from 'shared/contexts';
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

const useStyles = makeStyles({
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0,
  },
});

function AppWrapper({ children, showQueryTools = DEVELOPER_MODE }) {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <SnackbarWrapper>
        <ApiWrapper showQueryTools={showQueryTools}>
          <UserWrapper>
            <FlagWrapper>
              <CompareWrapper>
                <CmsWrapper>
                  <BrowserWrapper>
                    <AnalyticsProvider>
                      <CookiesProvider defaultSetOptions={{
                        path: '/',
                        expires: new Date(Date.now() + (1000 * 60 * 60 * 10)), // 10 hours
                        domain: '.healthit.gov',
                      }}
                      >
                        <div className={classes.appContainer}>
                          <ChplNavigationTop />
                          <div className={classes.content}>
                            {children}
                          </div>
                          <ChplNavigationBottom />
                        </div>
                      </CookiesProvider>
                    </AnalyticsProvider>
                  </BrowserWrapper>
                </CmsWrapper>
              </CompareWrapper>
            </FlagWrapper>
          </UserWrapper>
        </ApiWrapper>
      </SnackbarWrapper>
    </ThemeProvider>
  );
}

export default AppWrapper;

AppWrapper.propTypes = {
  children: node.isRequired,
  showQueryTools: bool,
};
