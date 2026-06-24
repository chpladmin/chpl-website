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
import { getAngularService } from 'services/angular-react-helper';
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
      color: `${palette.primary} !important`,
      textDecoration: 'none !important',
    },
    '& .MuiSvgIcon-root': {
      color: palette.primary,
    },
  },
  menuItemActive: {
    '& a': {
      color: `${palette.black} !important`,
      fontWeight: 'bold !important',
      textDecoration: 'none !important',
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
  const $rootScope = getAngularService('$rootScope');
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const classes = useStyles();

  useEffect(() => {
    const deregister = $rootScope.$on('$locationChangeSuccess', () => {
      setCurrentHash(window.location.hash);
    });
    return () => deregister();
  }, [$rootScope]);

  const isActive = href && currentHash === href;

  return (
    <ListItem className={`${classes.menuItem}${isActive ? ` ${classes.menuItemActive}` : ''}`} onClick={onClose}>
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
