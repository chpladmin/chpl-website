import React from 'react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Box } from '@mui/material';
import { bool, node, string } from 'prop-types';

import { eventTrack } from 'services/analytics.service';
import { goToState } from 'services/navigation.service';
import { analyticsConfig, routerConfig } from 'shared/prop-types';
import { utilStyles } from 'themes';

const styles = {
  chplLink: {
    display: 'flex',
    overflowWrap: 'anywhere',
    gap: '4px',
    justifyContent: 'space-between',
  },
  chplLinkInline: {
    display: 'inline-flex',
  },
  inlineLink: {
    overflowWrap: 'anywhere',
  },
  indicateOnHover: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  disclaimerIcon: {
    marginTop: '4px',
  },
};

const prependLink = (url) => {
  if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://' || url.substring(0, 2) === '#/' || url.substring(0, 5) === '/rest') {
    return url;
  }
  return `http://${url}`;
};

function ChplLink({
  analytics = {},
  external = true,
  href: initialHref,
  indicateOnHover = false,
  inline = false,
  router = {},
  text: initialText = '',
  icon = undefined,
}) {
  const href = prependLink(initialHref);
  const text = initialText || initialHref;

  let clicked = false;
  const track = (e) => {
    if (!clicked) {
      e.preventDefault();
      clicked = true;
      if (analytics.event) {
        eventTrack(analytics);
      }
      if (router.sref) {
        goToState(router.sref, router.params);
      } else {
        e.target.click();
      }
    }
  };

  if (inline && !external) {
    return (
      <Box
        component="a"
        href={href}
        onClick={track}
        sx={{ ...styles.inlineLink, ...(indicateOnHover ? styles.indicateOnHover : {}) }}
      >
        {text}
      </Box>
    );
  }

  return (
    <Box component="span" sx={inline ? { ...styles.chplLink, ...styles.chplLinkInline } : styles.chplLink}>
      <Box component="a" href={href} onClick={track} sx={indicateOnHover ? styles.indicateOnHover : undefined}>
        {text}
      </Box>
      { icon }
      { external
        && (
          <Box component="a" href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" sx={styles.disclaimerIcon}>
            <ExitToAppIcon />
            <Box component="span" sx={utilStyles.srOnly}>Web Site Disclaimers</Box>
          </Box>
        )}
    </Box>
  );
}

export default ChplLink;

ChplLink.propTypes = {
  text: string,
  href: string.isRequired,
  analytics: analyticsConfig,
  external: bool,
  indicateOnHover: bool,
  inline: bool,
  router: routerConfig,
  icon: node,
};
