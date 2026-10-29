import React, { useContext } from 'react';
import { keyframes } from '@emotion/react';
import { Box, Paper } from '@mui/material';
import { node } from 'prop-types';

import ChplCmsDisplay from 'components/cms-widget/cms-display';
import ChplCompareDisplay from 'components/compare-widget/compare-display';
import ChplNavigationBottom from 'navigation/navigation-bottom';
import ChplNavigationTop from 'navigation/navigation-top';
import { CmsContext, CompareContext } from 'shared/contexts';
import { palette } from 'themes';
import theme from 'themes/theme';

const widgetRailIn = keyframes({
  from: {
    opacity: 0,
    transform: 'translateX(8px)',
  },
  to: {
    opacity: 1,
    transform: 'translateX(0)',
  },
});

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      height: 'auto',
      minHeight: '100vh',
      overflow: 'visible',
    },
  },
  workspace: {
    flex: '1 1 auto',
    display: 'flex',
    minHeight: 0,
    minWidth: 0,
    width: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      overflow: 'visible',
    },
  },
  content: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    minWidth: 0,
    overflowY: 'auto', // contain absolutely-positioned descendants (e.g. sr-only spans) so they don't extend the document
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      overflowY: 'visible',
    },
  },
  widgetRail: {
    animation: `${widgetRailIn} 140ms ease-out`,
    backgroundColor: palette.white,
    borderLeft: `.5px solid ${theme.palette.divider}`,
    flex: '0 0 260px',
    transition: theme.transitions.create(['flex-basis', 'opacity', 'transform'], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut,
    }),
    [theme.breakpoints.down('lg')]: {
      flexBasis: '240px',
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  widgetRailPaper: {
    overflowY: 'auto',
    width: '100%',
    height: '100%',
    '& .MuiCardContent-root': {
      padding: `${theme.spacing(2)} !important`,
      maxWidth: '100% !important',
      width: 'auto !important',
    },
    '& .MuiCardContent-root:last-child': {
      paddingBottom: `${theme.spacing(2)} !important`,
    },
    '& .MuiChip-root': {
      maxWidth: '100%',
    },
    '& .MuiDivider-root': {
      margin: `${theme.spacing(1.5)} 0`,
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
  },
};

function ChplWidgetWorkspacePanel() {
  const { isOpen: cmsIsOpen, setIsOpen: setCmsIsOpen } = useContext(CmsContext);
  const { isOpen: compareIsOpen, setIsOpen: setCompareIsOpen } = useContext(CompareContext);

  if (!cmsIsOpen && !compareIsOpen) {
    return null;
  }

  const closeWidgetPanel = () => {
    setCmsIsOpen(false);
    setCompareIsOpen(false);
  };

  return (
    <Box sx={styles.widgetRail}>
      <Paper sx={styles.widgetRailPaper} elevation={0} square>
        { cmsIsOpen && (<ChplCmsDisplay onClose={closeWidgetPanel} />)}
        { compareIsOpen && (<ChplCompareDisplay onClose={closeWidgetPanel} />)}
      </Paper>
    </Box>
  );
}

function ChplAppLayout({ children }) {
  return (
    <Box sx={styles.appContainer}>
      <ChplNavigationTop />
      <Box sx={styles.workspace}>
        <Box sx={styles.content}>
          {children}
        </Box>
        <ChplWidgetWorkspacePanel />
      </Box>
      <ChplNavigationBottom />
    </Box>
  );
}

ChplAppLayout.propTypes = {
  children: node.isRequired,
};

export default ChplAppLayout;
