import React, { useEffect, useState } from 'react';
import {
  Box, Button, Chip, Divider, Drawer, IconButton, Typography,
} from '@mui/material';
import {
  arrayOf, string,
} from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';

import { ChplTooltip } from 'components/util';

const styles = {
  closeDrawer: {
    border: '1px solid #eee',
    backgroundColor: '#fff',
    borderRadius: '4px 4px',
    boxShadow: '0 -4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#eee',
      boxShadow: '0 -4px 8px rgb(149 157 165 / 50%)',
    },
  },
  drawerPaper: {
    borderRadius: '4px',
    boxShadow: 'rgb(149 157 165 / 30%) -8px 0px 16px 0px',
    width: '250px',
    zIndex: 1298,
  },
  toggle: {
    width: '32px',
    height: '32px',
    fontWeight: '600',
    zIndex: 1299,
    position: 'fixed',
    right: '0',
    marginRight: '8px',
  },
  toggleError: {
    bottom: '125px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#853544',
      boxShadow: '0 4px 8px rgb(149 157 165 / 50%)',
    },
  },
  toggleWarning: {
    bottom: '80px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#b9bc0c',
      boxShadow: '0 4px 8px rgb(149 157 165 / 50%)',
    },
  },
  messageContainer: {
    overflowY: 'auto',
    flexGrow: 1,
  },
  errorContainer: {
    backgroundColor: '#c44f6520',
    color: '#1c1c1c',
  },
  warningContainer: {
    backgroundColor: '#e6ea0b20',
    color: '#1c1c1c',
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
    backgroundColor: '#c44f65',
    color: '#ffffff',
  },
  warningTheme: {
    backgroundColor: '#e6ea0b',
    color: '#1c1c1c',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  list: {
    margin: '0 0 0 16px',
    padding: '8px 16px',
  },
  noMargin: {
    margin: '0',
  },
};

const fixMessages = (msgs) => ([...new Set(msgs)].sort((a, b) => (a < b ? 1 : -1)));

function ChplActionBarMessages({ errors = [], warnings = [] }) {
  const [open, setOpen] = useState(false);

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
                sx={{ ...styles.toggle, ...styles.toggleError, ...styles.errorTheme }}
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
                sx={{ ...styles.toggle, ...styles.toggleWarning, ...styles.warningTheme }}
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
        PaperProps={{ sx: styles.drawerPaper }}
      >
        <Box sx={styles.messageContainer}>
          {fixMessages(errors).length > 0
           && (
             <Box sx={styles.errorContainer} id="action-bar-errors">
               <Box sx={styles.messageHeader}>
                 Error
                 {fixMessages(errors).length !== 1 ? 's' : ''}
                 <Chip
                   size="small"
                   sx={{ ...styles.messageChip, ...styles.errorTheme }}
                   label={fixMessages(errors).length}
                 />
               </Box>
               <Divider sx={styles.noMargin} />
               <Box component="ul" sx={styles.list}>
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
               </Box>
             </Box>
           )}
          {errors.length > 0 && warnings.length > 0
           && (
             <Divider sx={styles.noMargin} />
           )}
          {warnings.length > 0
           && (
             <Box sx={styles.warningContainer} id="action-bar-warnings">
               <Box sx={styles.messageHeader}>
                 Warning
                 {fixMessages(warnings).length !== 1 ? 's' : ''}
                 <Chip
                   size="small"
                   sx={{ ...styles.messageChip, ...styles.warningTheme }}
                   label={fixMessages(warnings).length}
                 />
               </Box>
               <Divider sx={styles.noMargin} />
               <Box component="ul" sx={styles.list}>
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
               </Box>
             </Box>
           )}
        </Box>
        <Box sx={styles.closeDrawer}>
          <Button
            color="primary"
            fullWidth
            onClick={toggleDrawer}
            id="action-bar-messages-close"
          >
            Close
            <CloseIcon sx={styles.iconSpacing} />
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default ChplActionBarMessages;

ChplActionBarMessages.propTypes = {
  errors: arrayOf(string),
  warnings: arrayOf(string),
};
