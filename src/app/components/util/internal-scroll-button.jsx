import React, { useState, useEffect } from 'react';
import {
  Button,
} from '@material-ui/core';
import { string } from 'prop-types';

import { getAngularService } from '../../services/angular-react-helper';
import { analyticsConfig } from '../../shared/prop-types';

const InternalScrollButton = (props) => {
  /* eslint-disable react/destructuring-assignment */
  const $analytics = getAngularService('$analytics');
  const [analytics] = useState(props.analytics);
  const [id] = useState(props.id);
  const [name] = useState(props.name);
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

  return (
    <Button
      onClick={handleClick}
      aria-label={`Scroll display to ${name}`}
    >
      {name}
    </Button>
  );
};

export default InternalScrollButton;

InternalScrollButton.propTypes = {
  name: string.isRequired,
  id: string.isRequired,
  analytics: analyticsConfig,
};

InternalScrollButton.defaultProps = {
  analytics: {},
};
