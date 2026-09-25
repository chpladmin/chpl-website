import React, { useEffect, useState } from 'react';
import {
  CardContent,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf, string,
} from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';

import { ChplTooltip } from 'components/util';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  cardcontentPadding: {
    padding: '8px',
  },
  mainCardContent: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  stickyWidgetHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    backgroundColor: palette.white,
    marginLeft: '-8px',
    marginRight: '-8px',
    marginBottom: '16px',
    minHeight: '52px', // matches the CMS and compare widget headers
    padding: '4px 4px 4px 8px',
    borderBottom: `1px solid ${palette.divider}`,
  },
  drawerPaper: {
    borderRadius: '4px',
    boxShadow: 'rgb(149 157 165 / 30%) -8px 0px 16px 0px',
    width: '90vw',
    [theme.breakpoints.up('md')]: {
      width: '350px',
    },
    zIndex: 1298,
  },
  toggle: {
    width: '32px',
    height: '32px',
    fontWeight: '600',
    zIndex: 1299,
    position: 'fixed',
    right: '16px',
    marginRight: '16px',
  },
  toggleError: {
    bottom: '125px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: palette.errorDark,
      boxShadow: '0 4px 8px rgb(149 157 165 / 50%)',
    },
  },
  toggleWarning: {
    bottom: '80px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: palette.warningDark,
      boxShadow: '0 4px 8px rgb(149 157 165 / 50%)',
    },
  },
  errorContainer: {
    backgroundColor: palette.errorLight,
    color: palette.greyDark,
    borderRadius: '4px',
    padding: '8px',
  },
  warningContainer: {
    backgroundColor: palette.warningLight,
    color: palette.greyDark,
    borderRadius: '4px',
    padding: '8px',
  },
  messageHeader: {
    alignItems: 'center',
    display: 'flex',
    fontWeight: '600',
    justifyContent: 'space-between',
    padding: '8px 16px',
  },
  messageChip: {
    height: '32px',
    width: '32px',
  },
  errorTheme: {
    backgroundColor: palette.error,
    color: palette.white,
  },
  warningTheme: {
    backgroundColor: palette.warning,
    color: palette.greyDark,
  },
  list: {
    margin: '0 0 0 16px',
    padding: '8px 16px',
  },
  noMargin: {
    margin: '0',
  },
});

const fixMessages = (msgs) => ([...new Set(msgs)].sort((a, b) => (a < b ? 1 : -1)));

function ChplActionBarMessages({ errors = [], warnings = [] }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (errors.length > 0 || warnings.length > 0) {
      setOpen(true);
    }
  }, [errors, warnings]);

  const toggleDrawer = () => {
    setOpen((p) => !p);
  };

  if (errors.length === 0 && warnings.length === 0) {
    return null;
  }

  return (
    <>
      { !open && (errors.length > 0 || warnings.length > 0)
        && (
          <>
            <ChplTooltip
              placement="left"
              title={`Error${fixMessages(errors).length !== 1 ? 's' : ''}`}
            >
              <IconButton
                size="medium"
                onClick={toggleDrawer}
                className={`${classes.toggle} ${classes.toggleError} ${classes.errorTheme}`}
                id="action-bar-messages-toggle-errors"
              >
                {fixMessages(errors).length}
              </IconButton>
            </ChplTooltip>
            <ChplTooltip
              placement="left"
              title={`Warning${fixMessages(warnings).length !== 1 ? 's' : ''}`}
            >
              <IconButton
                size="medium"
                onClick={toggleDrawer}
                className={`${classes.toggle} ${classes.toggleWarning} ${classes.warningTheme}`}
                id="action-bar-messages-toggle-warnings"
              >
                {fixMessages(warnings).length}
              </IconButton>
            </ChplTooltip>
          </>
        )}
      <Drawer
        id="action-bar-messages"
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        variant="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <CardContent className={`${classes.cardcontentPadding} ${classes.mainCardContent}`}>
          <div className={classes.stickyWidgetHeader}>
            <Typography variant="h2">
              Messages
            </Typography>
            <ChplTooltip placement="bottom" title="Close Messages">
              <IconButton aria-label="Close widget" onClick={toggleDrawer} size="small">
                <CloseIcon />
              </IconButton>
            </ChplTooltip>
          </div>
          {fixMessages(errors).length > 0
           && (
             <div className={classes.errorContainer} id="action-bar-errors">
               <div className={classes.messageHeader}>
                 Error
                 {fixMessages(errors).length !== 1 ? 's' : ''}
                 <Chip
                   size="small"
                   className={`${classes.messageChip} ${classes.errorTheme}`}
                   label={fixMessages(errors).length}
                 />
               </div>
               <Divider className={classes.noMargin} />
               <ul className={classes.list}>
                 {fixMessages(errors).map((message) => (
                   <li key={message}>
                     <Typography
                       gutterBottom
                       variant="body2"
                     >
                       {message}
                     </Typography>
                   </li>
                 ))}
               </ul>
             </div>
           )}
          {errors.length > 0 && warnings.length > 0
           && (
             <Divider className={classes.noMargin} />
           )}
          {warnings.length > 0
           && (
             <div className={classes.warningContainer} id="action-bar-warnings">
               <div className={classes.messageHeader}>
                 Warning
                 {fixMessages(warnings).length !== 1 ? 's' : ''}
                 <Chip
                   size="small"
                   className={`${classes.messageChip} ${classes.warningTheme}`}
                   label={fixMessages(warnings).length}
                 />
               </div>
               <Divider className={classes.noMargin} />
               <ul className={classes.list}>
                 {fixMessages(warnings).map((message) => (
                   <li key={message}>
                     <Typography
                       gutterBottom
                       variant="body2"
                     >
                       {message}
                     </Typography>
                   </li>
                 ))}
               </ul>
             </div>
           )}
        </CardContent>
      </Drawer>
    </>
  );
}

export default ChplActionBarMessages;

ChplActionBarMessages.propTypes = {
  errors: arrayOf(string),
  warnings: arrayOf(string),
};
