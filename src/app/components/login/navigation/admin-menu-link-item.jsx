import React from 'react';
import {
  ListItem,
  makeStyles,
} from '@material-ui/core';
import {
  bool,
  func,
  shape,
  string,
} from 'prop-types';

import { ChplLink } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { palette } from 'themes';

const useStyles = makeStyles({
  menuItem: {
    padding: '8px 16px 8px 32px',
    color: palette.primary,
    fontSize: '14px',
    '& a': {
      color: `${palette.primary} !important`,
    },
    '& .MuiSvgIcon-root': {
      color: palette.primary,
    },
  },
});

function ChplAdminMenuLinkItem({
  external = false,
  href,
  onClose,
  router = undefined,
  text,
}) {
  const classes = useStyles();
  const { analytics } = useAnalyticsContext();

  const handleClick = () => {
    eventTrack({
      ...analytics,
      event: `Navigate to ${text} Page`,
      label: text,
      category: 'Navigation',
    });
    onClose();
  };

  return (
    <ListItem className={classes.menuItem} onClick={handleClick}>
      <ChplLink
        href={href}
        text={text}
        external={external}
        router={router}
        indicateOnHover
      />
    </ListItem>
  );
}

export default ChplAdminMenuLinkItem;

ChplAdminMenuLinkItem.propTypes = {
  external: bool,
  href: string.isRequired,
  onClose: func.isRequired,
  router: shape({
    sref: string,
  }),
  text: string.isRequired,
};
