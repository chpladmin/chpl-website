import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

import { palette, theme } from 'themes';

const styles = {
  envBanner: {
    backgroundColor: `${palette.error} !important`,
    width: '100%',
    color: '#ffffff !important',
    zIndex: theme.zIndex.drawer + 2,
    '& .MuiToolbar-root': {
      minHeight: '25px',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflow: 'hidden',
    },
  },
  envBannerText: {
    fontWeight: 'bold',
    paddingLeft: '8px',
  },
};

function ChplEnvironmentBanner() {
  const text = 'Do not use | Test Environment | '.repeat(20);

  return (
    <AppBar position="fixed" sx={styles.envBanner}>
      <Toolbar>
        <Typography variant="body2" noWrap sx={styles.envBannerText}>
          {text}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default ChplEnvironmentBanner;

ChplEnvironmentBanner.propTypes = {
};
