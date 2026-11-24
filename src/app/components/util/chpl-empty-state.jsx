import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { elementType, node, shape } from 'prop-types';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const styles = {
  card: {
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  icon: {
    fontSize: '2rem',
  },
};

// The one visual for "nothing to show": an icon above a short message. Use it
// wherever a list, search or filter comes back empty so every page looks alike.
function ChplEmptyState({
  action = undefined,
  children,
  icon: Icon = SearchOffIcon,
  sx = undefined,
}) {
  return (
    <Card sx={[styles.card, sx]}>
      <CardContent sx={styles.content}>
        <Icon sx={styles.icon} />
        <Typography variant="body2">
          { children }
        </Typography>
        { action }
      </CardContent>
    </Card>
  );
}

export default ChplEmptyState;

ChplEmptyState.propTypes = {
  action: node,
  children: node.isRequired,
  icon: elementType,
  sx: shape({}),
};
