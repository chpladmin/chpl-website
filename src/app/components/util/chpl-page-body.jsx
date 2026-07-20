import React from 'react';
import { 
    Box, 
    Container, 
    makeStyles,
 } from '@material-ui/core';
import { node, oneOf } from 'prop-types';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  container: {
    padding: theme.spacing(8),
    backgroundColor: palette.backgroundPage,
    minHeight: 'calc(100vh - 150px)',
  },
});

function ChplPageBody({ children, maxWidth = 'lg' }) {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Container id="main-content" tabIndex="-1" maxWidth={maxWidth}>
        {children}
      </Container>
    </Box>
  );
}

export default ChplPageBody;

ChplPageBody.propTypes = {
  children: node.isRequired,
  maxWidth: oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
};
