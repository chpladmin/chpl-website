import React from 'react';
import { Box, Container, Typography } from '@material-ui/core';
import { node, string } from 'prop-types';

import { palette } from 'themes';

function ChplPageHeader({ text, subtitle }) {
  return (
    <Box position="relative" boxShadow={2} bgcolor={palette.white} p={8}>
      <Container maxWidth="lg">
        <Typography variant="h1">
          {text}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
}

export default ChplPageHeader;

ChplPageHeader.propTypes = {
  text: string.isRequired,
  subtitle: node,
};
