import React from 'react';
import {
  Box,
  Card,
  CardContent,
  makeStyles,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { number } from 'prop-types';

import { theme } from 'themes';

const useStyles = makeStyles({
  card: {
    marginBottom: theme.spacing(1.5),
  },
  cardContent: {
    padding: theme.spacing(4, 8),
    '&:last-child': {
      paddingBottom: 0,
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
    flexWrap: 'wrap',
    gap: theme.spacing(1.25, 3.5),
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
});

function ChplLoadingCards({ cards = 5, fieldsPerRow = 3, rows = 3 }) {
  const classes = useStyles();

  const renderField = () => (
    <Box className={classes.field}>
      <Skeleton variant="text" width="45%" height={14} />
      <Skeleton variant="text" width="70%" height={20} />
    </Box>
  );

  const renderRow = (isPrimary = true) => (
    <Box className={isPrimary ? classes.primaryRow : classes.detailsRow}>
      {[...Array(fieldsPerRow)].map((_, idx) => (
        <React.Fragment key={idx}>
          {renderField()}
        </React.Fragment>
      ))}
    </Box>
  );

  return (
    <Box>
      {/* Search controls header */}
      <Box className={classes.controlsHeader}>
        <Skeleton variant="text" width="30%" height={32} />
        <Skeleton variant="text" width="20%" height={32} />
      </Box>

      {/* Loading cards */}
      {[...Array(cards)].map((_, cardIdx) => (
        <Card key={cardIdx} className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Box display="flex" gap={theme.spacing(2)}>
              <Box className={classes.contentBody}>
                {/* Row 1: Primary fields (Developer, Product, Version) */}
                {renderRow(true)}

                {/* Row 2: Secondary fields (CHPL ID, Cert Date, Status) */}
                {renderRow(true)}

                {/* Row 3+: Additional details with border */}
                {rows > 2 && [...Array(rows - 2)].map((_, rowIdx) => (
                  <React.Fragment key={rowIdx}>
                    {renderRow(false)}
                  </React.Fragment>
                ))}
              </Box>

              {/* Action buttons */}
              <Box className={classes.actionsContainer}>
                <Skeleton variant="rect" width={120} height={36} style={{ borderRadius: 4 }} />
                <Skeleton variant="rect" width={120} height={36} style={{ borderRadius: 4 }} />
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
