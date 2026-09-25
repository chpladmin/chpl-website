import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { node, string } from 'prop-types';

import { eventTrack } from 'services/analytics.service';
import { analyticsConfig } from 'shared/prop-types';
import palette from 'themes/palette';

const useStyles = makeStyles({
  noButtonWrap: {
    whiteSpace: 'nowrap',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: palette.white,
    color: palette.primary,
    padding: '8px 16px',
    minWidth: 'min-content',
    '&:hover': {
      backgroundColor: palette.white,
      color: palette.black,
    },
    '&:focus': {
      backgroundColor: palette.secondary,
      color: palette.black,
      fontWeight: 900,
    },
  },
});

const InternalScrollButton = ({
  analytics = {}, children, id,
}) => {
  const [target, setTarget] = useState('');
  const classes = useStyles();

  useEffect(() => {
    setTarget(document.getElementById(id));
  }, [id]);

  const handleClick = (event) => {
    event.preventDefault();
    if (analytics.event) {
      eventTrack(analytics);
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
