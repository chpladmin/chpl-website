import React, { useEffect, useState } from 'react';
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
    cursor: 'pointer',
    padding: '8px 16px 8px 32px',
    color: palette.primary,
    fontSize: '14px',
    '&:hover': {
      backgroundColor: `${palette.secondary} !important`,
    },
    '& a': {
      color: palette.primary,
      textDecoration: 'none',
    },
    '& .MuiSvgIcon-root': {
      color: palette.primary,
    },
  },
  menuItemActive: {
    '& a': {
      color: palette.black,
      fontWeight: 'bold',
      textDecoration: 'none',
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
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const classes = useStyles();

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isActive = href && currentHash === href;

  const handleRowClick = (event) => {
    onClose();
    if (event.target.tagName === 'A') {
      return;
    }
    window.location.href = href;
  };

  return (
    <ListItem
      button
      className={`${classes.menuItem}${isActive ? ` ${classes.menuItemActive}` : ''}`}
      onClick={handleRowClick}
    >
      <ChplLink
        href={href}
        text={text}
        external={external}
        router={router}
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
