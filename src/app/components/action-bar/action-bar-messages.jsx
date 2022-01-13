import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  Fab,
  Divider,
  Drawer,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import {
  arrayOf, string,
} from 'prop-types';

const useStyles = makeStyles({
  drawer: {
    width: '250px',
  },
  drawerPaper: {
    width: '250px',
    boxShadow: 'rgb(149 157 165 / 30%) -8px 0px 16px 0px',
    alignItems: 'flex-end',
    borderRadius: '4px',
    overflowX:'hidden',
  },
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  toggleDrawer: {
    zIndex: 1299,
    position: 'fixed',
    bottom: '80px',
    right: '0',
    marginRight: '-4px',
    color: '#c44f65',
    borderRadius: '4px 0 0 4px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 10%)',
    backgroundColor: '#fff',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#eee',
      boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    },
  },
  closeDrawer: {
    zIndex: 1400,
    transition: 'all 0.5s ease',
    position: 'fixed',
    bottom: '16px',
    right: '0',
    marginRight: '-4px',
    width:'254px',
    border:'1px solid #eee',
    backgroundColor:'#fff',
    borderRadius: '4px 0 0 4px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#eee',
    },
    },
  errorContainer: {
    color: '#1c1c1c',
    backgroundColor: '#c44f6520',
  },
  warningContainer: {
    color: '#1c1c1c',
    backgroundColor: '#e6ea0b20',
    paddingBottom:'16px',
  },
  iconSpacing: {
    marginLeft: '4px',
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
  },
  warningChip: {
    backgroundColor: '#e6ea0b',
    color: '#1c1c1c',
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
          <Button
            size='sm'
            className={classes.toggleDrawer}
            onClick={toggleDrawer}
          >
            {errors.length > 0
              && (
                <>
                  {errors.length}
                  {' '}
                  Error
                  {errors.length !== 1 ? 's' : ''}
                </>
              )}
            {errors.length > 0 && warnings?.length > 0
              && (
                <>
                  {' & '}
                </>
              )}
            {warnings.length > 0
              && (
                <>
                  {warnings.length}
                  {' '}
                  Warning
                  {warnings.length !== 1 ? 's' : ''}
                </>
              )}
          </Button>
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
          <Button color='default' fullWidth onClick={toggleDrawer}>
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

ChplActionBarMessages.propTypes = {
  errors: arrayOf(string),
  warnings: arrayOf(string),
};

ChplActionBarMessages.defaultProps = {
  errors: [],
  warnings: [],
};
