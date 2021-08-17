import React, { useState, useEffect } from 'react';
import { string } from 'prop-types';
import { analyticsConfig } from '../../../shared/prop-types';

const ScrollingNavigationLink = (props) => {
  const [analytics] = useState(props.analytics);
  const [id] = useState(props.id);
  const [name] = useState(props.name);
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

  return (
    <a href={`#${name}`}
       onClick={handleClick}
       aria-label={`Scroll display to ${name}`}>
      {name}
    </a>
  );
};

export default ScrollingNavigationLink;

ScrollingNavigationLink.propTypes = {
  name: string.isRequired,
  id: string.isRequired,
  analytics: analyticsConfig,
};

ScrollingNavigationLink.defaultProps = {
  analytics: {},
}
