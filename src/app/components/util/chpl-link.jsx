import React, { useEffect, useState } from 'react';
import {
  makeStyles,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { bool, string } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';
import { eventTrack } from 'services/analytics.service';
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

function ChplLink({
  analytics,
  external,
  href: initialHref,
  inline,
  router,
  text: initialText,
}) {
  const classes = useStyles();
  const [href, setHref] = useState('');
  const [text, setText] = useState('');
  const $state = getAngularService('$state');

  useEffect(() => {
    setHref(prependLink(initialHref));
    setText(initialText || initialHref);
  }, [initialHref, initialText]);

  let clicked = false;
  const track = (e) => {
    if (!clicked) {
      e.preventDefault();
      clicked = true;
      if (analytics.event) {
        eventTrack(analytics);
      }
      if (router.sref) {
        $state.go(router.sref, router.options);
      } else {
        e.target.click();
      }
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
          <a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" className={classes.disclaimerIcon}>
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
