import React, { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Container,
  Typography,
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { node, string } from 'prop-types';

import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { palette } from 'themes';

function ChplPageHeader({
  text, subtitle, actions, titleAdornment,
}) {
  const [expanded, setExpanded] = useState(true);
  const { analytics } = useAnalyticsContext();

  return (
    <Box position="relative" boxShadow={2} bgcolor={palette.white} p={8}>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gridGap={16}>
          <Box display="flex" alignItems="center" gridGap={4}>
            <Typography variant="h1">
              { text }
            </Typography>
            { titleAdornment }
          </Box>
          { (actions || subtitle)
            && (
              <Box display="flex" alignItems="center" flexWrap="wrap" gridGap={8}>
                { actions }
                { subtitle
                  && (
                    <Button
                      color="primary"
                      style={{ fontSize: '1rem' }}
                      onClick={() => {
                        const next = !expanded;
                        setExpanded(next);
                        eventTrack({
                          ...analytics,
                          event: next ? 'Show Page Header Information' : 'Hide Page Header Information',
                        });
                      }}
                      endIcon={expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                    >
                      { expanded ? 'Hide Details' : 'Show Details' }
                    </Button>
                  )}
              </Box>
            )}
        </Box>
        { subtitle
          && (
            <Collapse in={expanded}>
              <Box mt={2}>
                <Typography variant="body1" style={{ color: palette.greyDark }} component="div">
                  { subtitle }
                </Typography>
              </Box>
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
  actions: node,
  titleAdornment: node,
};

ChplPageHeader.defaultProps = {
  subtitle: null,
  actions: null,
  titleAdornment: null,
};
