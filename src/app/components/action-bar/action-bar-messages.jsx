import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  Fab,
  Divider,
  Drawer,
  IconButton,
  ToolTip,
  Typography,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import theme from 'themes/theme';
import {
  arrayOf, string,
} from 'prop-types';

const useStyles = makeStyles({
  drawer: {
    width: '250px',
  },
  drawerPaper: {
    alignItems: 'flex-end',
    borderRadius: '4px',
    boxShadow: 'rgb(149 157 165 / 30%) -8px 0px 16px 0px',
    height:'95%',
    overflowX: 'hidden',
    width: '250px',
  },
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  closeDrawer: {
    zIndex: 1400,
    transition: 'all 0.5s ease',
    position: 'fixed',
    bottom: '16px',
    right: '0',
    marginRight: '-4px',
    width: '254px',
    border: '1px solid #eee',
    backgroundColor: '#fff',
    borderRadius: '4px 4px',
    boxShadow: '0 -4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#eee',
      boxShadow: '0 -4px 8px rgb(149 157 165 / 50%)',
    },
  },
  errorContainer: {
    color: '#1c1c1c',
    backgroundColor: '#c44f6520',
  },
  warningContainer: {
    color: '#1c1c1c',
    backgroundColor: '#e6ea0b20',
    paddingBottom: '16px',
  },
  toggleError: {
    width:'32px',
    height:'32px',
    backgroundColor: '#c44f65',
    color: '#ffffff',
    fontWeight: '600',
    zIndex: 1299,
    position: 'fixed',
    bottom: '125px',
    right: '0',
    marginRight: '8px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#853544',
      boxShadow: '0 4px 8px rgb(149 157 165 / 50%)',
    },
  },
  toggleWarning: {
    width:'32px',
    height:'32px',
    backgroundColor: '#e6ea0b',
    color: '#1c1c1c',
    fontWeight: '600',
    zIndex: 1299,
    position: 'fixed',
    bottom: '80px',
    right: '0',
    marginRight: '8px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#b9bc0c',
      boxShadow: '0 4px 8px rgb(149 157 165 / 50%)',
    },
  },
  errorHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    padding: '8px 16px',
    fontWeight: '600',
  },
  warningHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    padding: '8px 16px',
    fontWeight: '600',
  },
  errorChip: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    width:'32px',
    height:'32px',
  },
  warningChip: {
    backgroundColor: '#e6ea0b',
    color: '#1c1c1c',
    width:'32px',
    height:'32px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  noMargin: {
    margin: '0',
  },
  list: {
    margin: '0px 0px 0px 16px',
    padding: '8px 16px',
  }
});

function ChplActionBarMessages(props) {
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [open, setOpen] = useState(false);
  const [anchorRight, setAnchorRight] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    setErrors(props.errors.sort((a, b) => (a < b ? 1 : -1)));
    if (props.errors.length > 0) {
      setOpen(true);
    }
  }, [props.errors]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setWarnings(props.warnings.sort((a, b) => (a < b ? 1 : -1)));
    if (props.warnings.length > 0) {
      setOpen(true);
    }
  }, [props.warnings]); // eslint-disable-line react/destructuring-assignment

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const toggleAnchor = () => {
    setAnchorRight(!anchorRight);
  };

  return (
    <>
      {!open
        && (
          <Tooltip title="Error">
            <IconButton
              size='medium'
              onClick={toggleDrawer}
              className={classes.toggleError}
            >
              {errors.length > 0
                && (
                  <>
                    {errors.length}
                  </>
                )}
            </IconButton>
          </Tooltip>
        )}

      {!open
        && (
          <Tooltip title="Warning">
            <IconButton
              size='medium'
              onClick={toggleDrawer}
              className={classes.toggleWarning}
            >
              {warnings.length > 0
                && (
                  <>
                    {warnings.length}
                  </>
                )}
            </IconButton>
          </Tooltip>
        )}
      <Drawer
        id='action-bar-messages'
        anchor={anchorRight ? 'right' : 'left'}
        open={open}
        onClose={toggleDrawer}
        variant='persistent'
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <div className={classes.messageContainer}>
            {errors.length > 0
              && (
                <div className={classes.errorContainer} id='action-bar-errors'>
                  <div className={classes.errorHeader}>
                    Error
                    {errors.length !== 1 ? 's' : ''}
                    <Chip size='small' className={classes.errorChip} label={errors.length}></Chip>
                  </div>
                  <Divider className={classes.noMargin} />
                  <ul className={classes.list}>
                    {errors.map((message) => (
                      <li key={message}><Typography gutterBottom variant='body2'>{message}</Typography></li>
                    ))}
                  </ul>
                </div>
              )}
            {warnings.length > 0
              && (
                <div className={classes.warningContainer} id='action-bar-warnings'>
                  <Divider className={classes.noMargin} />
                  <div className={classes.warningHeader}>
                    Warning
                    {warnings.length !== 1 ? 's' : ''}
                    <Chip size='small' className={classes.warningChip} label={warnings.length}></Chip>
                  </div>
                  <Divider className={classes.noMargin} />
                  <div>
                    <ul className={classes.list}>
                      {warnings.map((message) => (
                        <li key={message}><Typography gutterBottom variant='body2'>{message}</Typography></li>
                      ))}
                    </ul>
                  </div>
                </div>

              )}
          </div>
          <Divider className={classes.noMargin} />

          <div className={classes.closeDrawer}>
            <Button color='primary' fullWidth onClick={toggleDrawer}>
              Close <CloseIcon className={classes.iconSpacing} />
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default ChplActionBarMessages;

//<Checkbox name='side' onChange={toggleAnchor} checked={anchorRight}/> //
//{errors.length !== 1 ? 's' : ''}//
//{warnings.length !== 1 ? 's' : ''}"//

ChplActionBarMessages.propTypes = {
  errors: arrayOf(string),
  warnings: arrayOf(string),
};

ChplActionBarMessages.defaultProps = {
  errors: [],
  warnings: [],
};
