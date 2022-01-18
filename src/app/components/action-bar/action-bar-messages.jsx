import React, { useEffect, useState } from 'react';
import {
  Button,
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

const useStyles = makeStyles({
  closeDrawer: {
    border: '1px solid #eee',
    backgroundColor: '#fff',
    borderRadius: '4px 4px',
    bottom: '16px',
    boxShadow: '0 -4px 8px rgb(149 157 165 / 30%)',
    marginRight: '-4px',
    position: 'fixed',
    right: '0',
    width: '254px',
    zIndex: 1400,
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#eee',
      boxShadow: '0 -4px 8px rgb(149 157 165 / 50%)',
    },
  },
  drawer: {
    width: '250px',
  },
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  drawerPaper: {
    alignItems: 'flex-end',
    borderRadius: '4px',
    boxShadow: 'rgb(149 157 165 / 30%) -8px 0px 16px 0px',
    height: '95%',
    overflowX: 'hidden',
    width: '250px',
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
    backgroundColor: '#c44f65',
    color: '#ffffff',
    bottom: '125px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#853544',
      boxShadow: '0 4px 8px rgb(149 157 165 / 50%)',
    },
  },
  toggleWarning: {
    backgroundColor: '#e6ea0b',
    color: '#1c1c1c',
    bottom: '80px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#b9bc0c',
      boxShadow: '0 4px 8px rgb(149 157 165 / 50%)',
    },
  },
  errorChip: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    height: '32px',
    width: '32px',
  },
  errorContainer: {
    backgroundColor: '#c44f6520',
    color: '#1c1c1c',
  },
  errorHeader: {
    alignItems: 'center',
    display: 'flex',
    fontWeight: '600',
    justifyContent: 'space-between',
    padding: '8px 16px',
  },
  warningChip: {
    backgroundColor: '#e6ea0b',
    color: '#1c1c1c',
    height: '32px',
    width: '32px',
  },
  warningContainer: {
    backgroundColor: '#e6ea0b20',
    color: '#1c1c1c',
    paddingBottom: '16px',
  },
  warningHeader: {
    alignItems: 'center',
    display: 'flex',
    fontWeight: '600',
    justifyContent: 'space-between',
    padding: '8px 16px',
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
});

function ChplActionBarMessages(props) {
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [open, setOpen] = useState(false);
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

  return (
    <>
      { !open && (errors.length > 0 || warnings.length > 0)
        && (
          <>
            <ChplTooltip
              placement="left"
              title={`Error${errors.length !== 1 ? 's' : ''}`}
            >
              <IconButton
                size="medium"
                onClick={toggleDrawer}
                className={`${classes.toggle} ${classes.toggleError}`}
              >
                {errors.length}
              </IconButton>
            </ChplTooltip>
            <ChplTooltip
              placement="left"
              title={`Warning${warnings.length !== 1 ? 's' : ''}`}
            >
              <IconButton
                size="medium"
                onClick={toggleDrawer}
                className={`${classes.toggle} ${classes.toggleWarning}`}
              >
                {warnings.length}
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
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <div className={classes.messageContainer}>
            {errors.length > 0
              && (
                <div className={classes.errorContainer} id="action-bar-errors">
                  <div className={classes.errorHeader}>
                    Error
                    {errors.length !== 1 ? 's' : ''}
                    <Chip
                      size="small"
                      className={classes.errorChip}
                      label={errors.length}
                    />
                  </div>
                  <Divider className={classes.noMargin} />
                  <ul className={classes.list}>
                    {errors.map((message) => (
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
            {warnings.length > 0
              && (
                <div className={classes.warningContainer} id="action-bar-warnings">
                  <Divider className={classes.noMargin} />
                  <div className={classes.warningHeader}>
                    Warning
                    {warnings.length !== 1 ? 's' : ''}
                    <Chip
                      size="small"
                      className={classes.warningChip}
                      label={warnings.length}
                    />
                  </div>
                  <Divider className={classes.noMargin} />
                  <div>
                    <ul className={classes.list}>
                      {warnings.map((message) => (
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
                </div>
              )}
          </div>
          <Divider className={classes.noMargin} />
          <div className={classes.closeDrawer}>
            <Button
              color="primary"
              fullWidth
              onClick={toggleDrawer}
            >
              Close
              <CloseIcon className={classes.iconSpacing} />
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default ChplActionBarMessages;

ChplActionBarMessages.propTypes = {
  errors: arrayOf(string),
  warnings: arrayOf(string),
};

ChplActionBarMessages.defaultProps = {
  errors: [],
  warnings: [],
};
