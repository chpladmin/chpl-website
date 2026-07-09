import React from 'react';
import {
  Box,
  Container,
  Typography,
} from '@material-ui/core';
import { node, string } from 'prop-types';

import { palette } from 'themes';

function ChplPageHeader({ text, subtitle }) {
  return (
    <Box position="relative" boxShadow={2} bgcolor={palette.white} p={8}>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
          <Typography variant="h1">
            { text }
          </Typography>
          { subtitle
            && (
              <Button
                size="small"
                color="primary"
                onClick={() => setExpanded((prev) => !prev)}
                endIcon={expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
              >
                { expanded ? 'Hide Details' : 'Show Details' }
              </Button>
            )}
        </Box>
        { subtitle
          && (
            <Collapse in={expanded}>
              <Typography variant="body1" style={{ color: palette.greyDark }} component="div">
                { subtitle }
              </Typography>
            </Collapse>
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
