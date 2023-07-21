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

const InternalScrollButton = ({ analytics, children, id }) => {
  const $analytics = getAngularService('$analytics');
  const [target, setTarget] = useState('');

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
      id={`${id}-navigation-button`}
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
