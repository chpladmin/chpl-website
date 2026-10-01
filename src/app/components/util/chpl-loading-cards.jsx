import React from 'react';
import { Box, Card, CardContent } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { number } from 'prop-types';

import { theme } from 'themes';

const styles = {
  card: {
    marginBottom: theme.spacing(1.5),
  },
  cardContent: {
    padding: theme.spacing(4, 8),
    '&:last-child': {
      paddingBottom: theme.spacing(4),
    },
  },
  contentBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    flex: 1,
  },
  primaryRow: {
    display: 'flex',
    gap: theme.spacing(1.25, 3.5),
    '@media (min-width: 899px) and (max-width: 1201px)': {
      flexWrap: 'wrap',
    },
  },
  detailsRow: {
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5, 3),
    paddingTop: theme.spacing(1.25),
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.25),
    flex: '1 1 200px',
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing(1.5),
  },
  controlsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
};

function ChplLoadingCards({ cards = 5, fieldsPerRow = 3, rows = 3 }) {
  const renderField = () => (
    <Box sx={styles.field}>
      <Skeleton variant="text" width="45%" height="14px" />
      <Skeleton variant="text" width="70%" height="20px" />
    </Box>
  );

  const renderRow = (isPrimary = true) => (
    <Box sx={isPrimary ? styles.primaryRow : styles.detailsRow}>
      {[...Array(fieldsPerRow)].map((_item, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={idx}>
          {renderField()}
        </React.Fragment>
      ))}
    </Box>
  );

  return (
    <Box>
      <Box sx={styles.controlsHeader}>
        <Skeleton variant="text" width="30%" height="32px" />
        <Skeleton variant="text" width="20%" height="32px" />
      </Box>

      {[...Array(cards)].map((_card, cardIdx) => (
        // eslint-disable-next-line react/no-array-index-key
        <Card key={cardIdx} sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <Box display="flex" gap={theme.spacing(2)}>
              <Box sx={styles.contentBody}>
                {renderRow()}

                {renderRow()}

                {rows > 2 && [...Array(rows - 2)].map((_row, rowIdx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <React.Fragment key={rowIdx}>
                    {renderRow(false)}
                  </React.Fragment>
                ))}
              </Box>

              <Box sx={styles.actionsContainer}>
                <Skeleton variant="rectangular" width="120px" height="36px" style={{ borderRadius: '4px' }} />
                <Skeleton variant="rectangular" width="120px" height="36px" style={{ borderRadius: '4px' }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default ChplLoadingCards;

ChplLoadingCards.propTypes = {
  cards: number,
  fieldsPerRow: number,
  rows: number,
};
