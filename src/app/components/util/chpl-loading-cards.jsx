import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { number } from 'prop-types';

function ChplLoadingCards({ cards = 5, fieldsPerRow = 4, rows = 2 }) {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={4}>
        <Skeleton variant="text" width="30%" height={32} />
        <Skeleton variant="text" width="20%" height={32} />
      </Box>
      {[...Array(cards)].map((_, cardIdx) => (
        // eslint-disable-next-line react/no-array-index-key
        <Card key={cardIdx} style={{ marginBottom: '12px' }}>
          <CardContent style={{ padding: '16px 32px', display: 'flex', gridGap: '8px' }}>
            <Box display="flex" flexDirection="column" flex={1} gridGap={16}>
              <Skeleton variant="text" width="20%" height={28} />
              <Skeleton variant="text" width="40%" height={24} />
              {[...Array(rows)].map((__, rowIdx) => (
                // eslint-disable-next-line react/no-array-index-key
                <Grid container spacing={2} key={rowIdx}>
                  {[...Array(fieldsPerRow)].map((___, fieldIdx) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Grid item xs={12} sm={Math.floor(12 / fieldsPerRow)} key={fieldIdx}>
                      <Skeleton variant="text" width="50%" height={18} />
                      <Skeleton variant="text" width="80%" height={24} />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end" gridGap={8}>
              <Skeleton variant="rect" width={120} height={36} style={{ borderRadius: 4 }} />
              <Skeleton variant="rect" width={120} height={36} style={{ borderRadius: 4 }} />
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
