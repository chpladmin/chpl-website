import React, { useContext } from 'react';
import {
  Box,
  Paper,
  makeStyles,
} from '@material-ui/core';
import { node } from 'prop-types';

import { CmsContext, CompareContext } from 'shared/contexts';
import ChplCmsDisplay from 'components/cms-widget/cms-display';
import ChplCompareDisplay from 'components/compare-widget/compare-display';
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
  appContainerWidgetOpen: {
    height: '100vh',
    minHeight: '100vh',
    overflow: 'hidden',
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
  workspaceWidgetOpen: {
    flex: '1 1 auto',
    minHeight: 0,
    overflow: 'hidden',
  },
  content: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  contentWidgetOpen: {
    overflowY: 'auto',
    '& > *': {
      flexShrink: 0,
    },
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
      display: 'none',
    },
  },
  widgetRailPaper: {
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
    position: 'sticky',
    top: theme.spacing(16),
    width: '100%',
    height: '100%',
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
        { cmsIsOpen && (<ChplCmsDisplay onClose={closeWidgetPanel} />)}
        { compareIsOpen && (<ChplCompareDisplay onClose={closeWidgetPanel} />)}
      </Paper>
    </Box>
  );
}

function ChplAppLayout({ children }) {
  const { isOpen: cmsIsOpen } = useContext(CmsContext);
  const { isOpen: compareIsOpen } = useContext(CompareContext);
  const classes = useStyles();
  const widgetOpen = cmsIsOpen || compareIsOpen;

  const appContainerClass = `${classes.appContainer} ${widgetOpen ? classes.appContainerWidgetOpen : ''}`.trim();
  const workspaceClass = `${classes.workspace} ${widgetOpen ? classes.workspaceWidgetOpen : ''}`.trim();
  const contentClass = `${classes.content} ${widgetOpen ? classes.contentWidgetOpen : ''}`.trim();

  return (
    <div className={appContainerClass}>
      <ChplNavigationTop />
      <div className={workspaceClass}>
        <div className={contentClass}>
          {children}
        </div>
        <ChplWidgetWorkspacePanel />
      </div>
      <ChplNavigationBottom />
    </div>
  );
}

ChplAppLayout.propTypes = {
  children: node.isRequired,
};

export default ChplAppLayout;
