import React from 'react';
import { Box } from '@mui/material';
import { UIView } from '@uirouter/react';

const styles = {
  container: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    minHeight: 0,
  },
};

// The `id="main-content"` landmark is the target of the "Skip to main content"
// link, so it has to stay on the route shell. Replaces the AngularJS
// `template: '<div id="main-content" tabindex="-1"><ui-view></ui-view></div>'`.
// It stays a flex column so ChplPageBody can grow to fill the page.
function MainContentView() {
  return (
    <Box sx={styles.container} id="main-content" tabIndex={-1}>
      <UIView />
    </Box>
  );
}

export default MainContentView;
