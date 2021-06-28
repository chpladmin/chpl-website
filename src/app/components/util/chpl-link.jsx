import React, { useState } from 'react';
import { string } from 'prop-types';
import { analyticsConfig } from '../../shared/prop-types';

import { getAngularService } from '../../services/angular-react-helper';

const prependLink = (url) => {
  if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://') {
    return url;
  }
  return `http://${url}`;
};

function ChplLink(props) {
  /* eslint-disable react/destructuring-assignment */
  const [analytics] = useState(props.analytics);
  const [href] = useState(prependLink(props.href));
  const [text] = useState(props.text || props.href);
  const $analytics = getAngularService('$analytics');
  /* eslint-enable react/destructuring-assignment */

  let clicked = false;
  const track = (e) => {
    if (!clicked) {
      e.preventDefault();
      clicked = true;
      $analytics.eventTrack(analytics.event, {
        category: analytics.category || null,
        label: analytics.label || null,
      });
      e.target.click();
    }
  };

  return (
    <>
      <a href={href} onClick={track}>
        {text}
      </a>
      <a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" className="pull-right">
        <i className="fa fa-external-link" />
        <span className="sr-only">Web Site Disclaimers</span>
      </a>
    </>
  );
}

export default ChplLink;

ChplLink.propTypes = {
  text: string,
  href: string.isRequired,
  analytics: analyticsConfig,
};

ChplLink.defaultProps = {
  text: '',
  analytics: {},
};
