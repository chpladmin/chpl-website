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

  return (
    <ListItem className={classes.menuItem} onClick={onClose}>
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
