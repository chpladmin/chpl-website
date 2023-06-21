import React, { useState, useEffect } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';
import { node, string } from 'prop-types';

import { getAngularService } from '../../services/angular-react-helper';
import { analyticsConfig } from '../../shared/prop-types';

const useStyles = makeStyles({
  noButtonWrap: {
    whiteSpace: 'nowrap',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
});

const InternalScrollButton = (props) => {
  /* eslint-disable react/destructuring-assignment */
  const $analytics = getAngularService('$analytics');
  const [analytics] = useState(props.analytics);
  const { children } = props;
  const [id] = useState(props.id);
  const [target, setTarget] = useState('');
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setTarget(document.getElementById(id));
  }, [id]);

  const handleClick = (event) => {
    event.preventDefault();
    if (analytics.event) {
      $analytics.eventTrack(analytics.event, {
        category: analytics.category || null,
        label: analytics.label || null,
      });
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const classes = useStyles();

  return (
    <Button
      onClick={handleClick}
      color="primary"
      className={classes.noButtonWrap}
    >
      {children}
    </Button>
  );
};

export default InternalScrollButton;

InternalScrollButton.propTypes = {
  id: string.isRequired,
  children: node.isRequired,
  analytics: analyticsConfig,
};

InternalScrollButton.defaultProps = {
  analytics: {},
};
