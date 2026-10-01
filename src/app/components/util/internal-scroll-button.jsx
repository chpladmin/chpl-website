import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { node, string } from 'prop-types';

import { eventTrack } from 'services/analytics.service';
import { analyticsConfig } from 'shared/prop-types';
import palette from 'themes/palette';

const styles = {
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
};

const InternalScrollButton = ({
  analytics = {}, children, id,
}) => {
  const [target, setTarget] = useState('');

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
      sx={styles.noButtonWrap}
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
