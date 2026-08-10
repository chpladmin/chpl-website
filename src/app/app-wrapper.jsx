/* global DEVELOPER_MODE */

import React, { useContext } from 'react';
import {
  Box,
  IconButton,
  Paper,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { bool, node } from 'prop-types';
import { CookiesProvider } from 'react-cookie';

import {
  AnalyticsProvider,
  CmsContext,
  CompareContext,
  HashProvider,
} from 'shared/contexts';
import ApiWrapper from 'api/api-wrapper';
import BrowserWrapper from 'components/browser/browser-wrapper';
import ChplCmsDisplay from 'components/cms-widget/cms-display';
import CmsWrapper from 'components/cms-widget/cms-wrapper';
import ChplCompareDisplay from 'components/compare-widget/compare-display';
import CompareWrapper from 'components/compare-widget/compare-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';
import { SnackbarWrapper } from 'components/util';
import ChplNavigationBottom from 'navigation/navigation-bottom';
import ChplNavigationTop from 'navigation/navigation-top';
import { palette } from 'themes';
import theme from 'themes/theme';

const useStyles = makeStyles({
  '@keyframes widgetRailIn': {
    from: {
      opacity: 0,
      transform: 'translateX(8px)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  workspace: {
    flex: '1 0 auto',
    display: 'flex',
    minWidth: 0,
    width: '100%',
    transition: theme.transitions.create('grid-template-columns', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut,
    }),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  content: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  widgetRail: {
    animation: '$widgetRailIn 140ms ease-out',
    backgroundColor: palette.white,
    borderLeft: `.5px solid ${theme.palette.divider}`,
    flex: '0 0 260px',
    transition: theme.transitions.create(['flex-basis', 'opacity', 'transform'], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut,
    }),
    [theme.breakpoints.down('md')]: {
      flexBasis: '240px',
    },
    [theme.breakpoints.down('sm')]: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      borderLeft: 'none',
      flex: '0 0 auto',
      order: -1,
      width: '100%',
    },
  },
  widgetRailPaper: {
    maxHeight: 'calc(100vh - 96px)',
    overflowY: 'auto',
    position: 'sticky',
    top: theme.spacing(10),
    width: '100%',
    height: '100%',
    backgroundColor: palette.white,
    '& .MuiCardContent-root': {
      padding: `${theme.spacing(2)}px !important`,
      maxWidth: '100% !important',
      width: 'auto !important',
    },
    '& .MuiCardContent-root:last-child': {
      paddingBottom: `${theme.spacing(2)}px !important`,
    },
    '& .MuiChip-root': {
      maxWidth: '100%',
    },
    '& .MuiDivider-root': {
      margin: `${theme.spacing(1.5)}px 0`,
    },
    '& .MuiButton-root': {
      fontSize: '0.8125em',
    },
    '& .MuiTypography-root': {
      wordBreak: 'break-word',
    },
    '& .MuiTypography-h2': {
      fontSize: '1.1em',
      fontWeight: 800,
    },
    '& .MuiTypography-h6': {
      fontSize: '0.9375em',
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: 'none',
      position: 'static',
    },
  },
  widgetRailClose: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0.25),
    borderBottom: `.5px solid ${theme.palette.divider}`,
  },
});

function ChplWidgetWorkspacePanel() {
  const { isOpen: cmsIsOpen, setIsOpen: setCmsIsOpen } = useContext(CmsContext);
  const { isOpen: compareIsOpen, setIsOpen: setCompareIsOpen } = useContext(CompareContext);
  const classes = useStyles();

  if (!cmsIsOpen && !compareIsOpen) {
    return null;
  }

  const closeWidgetPanel = () => {
    setCmsIsOpen(false);
    setCompareIsOpen(false);
  };

  return (
    <Box className={classes.widgetRail}>
      <Paper className={classes.widgetRailPaper} elevation={0} square>
        <Box className={classes.widgetRailClose}>
          <IconButton
            aria-label="Close widget"
            onClick={closeWidgetPanel}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        { cmsIsOpen && (<ChplCmsDisplay />)}
        { compareIsOpen && (<ChplCompareDisplay />)}
      </Paper>
    </Box>
  );
}

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
                      <HashProvider>
                        <CookiesProvider defaultSetOptions={{
                          path: '/',
                          expires: new Date(Date.now() + (1000 * 60 * 60 * 10)), // 10 hours
                          domain: '.healthit.gov',
                        }}
                        >
                          <div className={classes.appContainer}>
                            <ChplNavigationTop />
                            <div className={classes.workspace}>
                              <div className={classes.content}>
                                {children}
                              </div>
                              <ChplWidgetWorkspacePanel />
                            </div>
                            <ChplNavigationBottom />
                          </div>
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
  );
}

export default AppWrapper;

AppWrapper.propTypes = {
  children: node.isRequired,
  showQueryTools: bool,
};
