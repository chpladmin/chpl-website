import React, { useEffect, useState } from 'react';
import {
  makeStyles,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { bool, string } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';
import { analyticsConfig, routerConfig } from 'shared/prop-types';

const useStyles = makeStyles({
  chplLink: {
    display: 'flex',
    overflowWrap: 'anywhere',
    gap: '4px',
    justifyContent: 'space-between',
  },
  disclaimerIcon: {
    marginTop: '4px',
  },
});

const prependLink = (url) => {
  if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://' || url.substring(0, 2) === '#/' || url.substring(0, 5) === '/rest') {
    return url;
  }
  return `http://${url}`;
};

function ChplLink(props) {
  const {
    analytics,
    external,
    inline,
    router,
  } = props;
  const classes = useStyles();
  const [href, setHref] = useState('');
  const [text, setText] = useState('');
  const $analytics = getAngularService('$analytics');
  const $state = getAngularService('$state');

  useEffect(() => {
    setHref(prependLink(props.href));
    setText(props.text || props.href);
  }, [props.href, props.text]); // eslint-disable-line react/destructuring-assignment

  let clicked = false;
  const track = (e) => {
    if (!clicked) {
      e.preventDefault();
      clicked = true;
      if (analytics.event) {
        const params = {};
        if (analytics.category) {
          params.category = analytics.category;
        }
        if (analytics.label) {
          params.label = analytics.label;
        }
        if (analytics.category || analytics.label) {
          $analytics.eventTrack(analytics.event, params);
        } else {
          $analytics.eventTrack(analytics.event);
        }
      }
      if (router.sref) {
        $state.go(router.sref, router.options);
      } else {
        e.target.click();
      }
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

  if (inline && !external) {
    return (
      <a href={href} onClick={track}>
        {text}
      </a>
    );
  }

  return (
    <span className={classes.chplLink}>
      <a href={href} onClick={track}>
        {text}
      </a>
      { external
        && (
          <a href="http://www.hhs.gov/disclaimer.html" onClick={trackDisclaimer} title="Web Site Disclaimers" className={classes.disclaimerIcon}>
            <ExitToAppIcon />
            <span className="sr-only">Web Site Disclaimers</span>
          </a>
        )}
    </span>
  );
}

export default ChplLink;

ChplLink.propTypes = {
  text: string,
  href: string.isRequired,
  analytics: analyticsConfig,
  external: bool,
  inline: bool,
  router: routerConfig,
};

ChplLink.defaultProps = {
  text: '',
  analytics: {},
  external: true,
  inline: false,
  router: {},
};
