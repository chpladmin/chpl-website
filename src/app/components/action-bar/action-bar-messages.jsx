import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Drawer,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
  arrayOf, string,
} from 'prop-types';

const useStyles = makeStyles({
  drawer: {
    width: '250px',
    flexShrink: 0,
  },
  drawerPaper: {
    width: '250px',
  },
  toggleDrawer: {
    zIndex: 1299,
    position: 'fixed',
    bottom: '22vh',
    right: '0',
    marginRight: '-4px',
    borderRadius: '4px 0 0px 4px',
    boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    backgroundColor: '#eeeeee',
    '&:hover, &.Mui-focusVisible': {
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgb(149 157 165 / 30%)',
    },
  },
  errors: {
    color: '#1c1c1c',
    backgroundColor: '#c44f6530',
    padding: '16px',
    boxShadow: '1px 4px 8px 1px rgba(149, 157, 165, .1)',
  },
  warnings: {
    color: '#1c1c1c',
    backgroundColor: '#F7E9BB30',
    padding: '16px',
    boxShadow: '1px 4px 8px 1px rgba(149, 157, 165, .1)',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
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
      { !open
        && (
          <Button
            color="default"
            variant="outlined"
            className={classes.toggleDrawer}
            onClick={toggleDrawer}
          >
            { errors.length > 0
              && (
                <>
                  { errors.length }
                  {' '}
                  Error
                  {errors.length !== 1 ? 's' : ''}
                </>
              )}
            { errors.length > 0 && warnings?.length > 0
              && (
                <>
                  {' & '}
                </>
              )}
            { warnings.length > 0
              && (
                <>
                  { warnings.length }
                  {' '}
                  Warning
                  {warnings.length !== 1 ? 's' : ''}
                </>
              )}
            <CompareArrowsIcon className={classes.iconSpacing} />
          </Button>
        )}
      <Drawer
        id="action-bar-messages"
        anchor={anchorRight ? 'right' : 'left'}
        open={open}
        onClose={toggleDrawer}
        variant="persistent"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronRightIcon />
        </IconButton>
        <Divider />
        { errors.length > 0
          && (
            <div className={classes.errors} id="action-bar-errors">
              <Typography>
                Error
                {errors.length !== 1 ? 's' : ''}
              </Typography>
              <ul>
                { errors.map((message) => (
                  <li key={message}>{ message }</li>
                ))}
              </ul>
            </div>
          )}
        { warnings.length > 0
          && (
            <div className={classes.warnings} id="action-bar-warnings">
              <Typography>
                Warning
                {warnings.length !== 1 ? 's' : ''}
              </Typography>
              <ul>
                { warnings.map((message) => (
                  <li key={message}>{ message }</li>
                ))}
              </ul>
            </div>
          )}
        <Checkbox
          name="side"
          onChange={toggleAnchor}
          checked={anchorRight}
        />
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
