import React, { useState } from 'react';
import { bool, string } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';
import { analyticsConfig } from 'shared/prop-types';

const prependLink = (url) => {
  if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://' || url.substring(0, 2) === '#/') {
    return url;
  }
  return `http://${url}`;
};

function ChplLink(props) {
  const {
    external,
  } = props;
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

  let disclaimerClicked = false;
  const trackDisclaimer = (e) => {
    if (!disclaimerClicked) {
      e.preventDefault();
      disclaimerClicked = true;
      $analytics.eventTrack('Go to Website Disclaimers', {
        category: 'Navigation',
      });
      e.target.click();
    }
  };

  return (
    <>
      <a href={href} onClick={track}>
        {text}
      </a>
      { external
        && (
        <a href="http://www.hhs.gov/disclaimer.html" onClick={trackDisclaimer} title="Web Site Disclaimers" className="pull-right">
          <i className="fa fa-external-link" />
          <span className="sr-only">Web Site Disclaimers</span>
        </a>
        )}
    </>
  );
}

export default ChplLink;

ChplLink.propTypes = {
  text: string,
  href: string.isRequired,
  analytics: analyticsConfig,
  external: bool,
};

ChplLink.defaultProps = {
  text: '',
  analytics: {},
  external: true,
};
