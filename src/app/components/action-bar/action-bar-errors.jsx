import React, { useEffect, useState, } from 'react';
import clsx from 'clsx';
import {
  Drawer,
  Button,
  List,
  ListItem,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import {
  arrayOf, bool, func, string,
} from 'prop-types';

import theme from 'themes/theme';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  compareWidget: {
    zIndex: 1299,
    position: 'fixed',
    bottom: '22vh',
    right: '0',
    marginRight: '-4px',
    borderRadius: '4px 0px 0px 4px',
    boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
    backgroundColor: '#eeeeee',
    "&:hover, &.Mui-focusVisible": {
      backgroundColor: '#fff',
      boxShadow: '0px 4px 8px rgb(149 157 165 / 30%)',
    },
  },
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplActionBarErrors(props) {
  const [errors, setErrors] = useState([]);
  const [state, setState] = useState({
    right: false,
  });
  const classes = useStyles();

  useEffect(() => {
    setErrors(props.errors.sort((a, b) => (a < b ? 1 : -1)));
  }, [props.errors]); // eslint-disable-line react/destructuring-assignment

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'right' || anchor === 'right',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {
          errors.map((message) => (
            <ListItem key={message}>{message}</ListItem>
          ))
        }
      </List>
    </div>
  );

  return (
    <div>
      {['Compare Widget'].map((anchor) => (
        <React.Fragment key={anchor}>
            <Button color="default" variant="outlined" className={classes.compareWidget} onClick={toggleDrawer(anchor, true)}>{anchor}<CompareArrowsIcon className={classes.iconSpacing}/></Button>
          <Drawer
            anchor={'right'}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            variant="persistent"
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}


export default ChplActionBarErrors;

ChplActionBarErrors.propTypes = {
  errors: arrayOf(string),
};

ChplActionBarErrors.defaultProps = {
  errors: [],
};
