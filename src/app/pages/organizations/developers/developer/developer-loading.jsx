import React from 'react';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { ChplLoadingPage, ChplSkeletonCard } from 'components/util';
import { theme } from 'themes';

const styles = {
  mainContent: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '16px',
    gap: '32px',
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
    },
  },
  lefthandContainer: {
    width: '33%',
    minWidth: '33%',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
      minWidth: '100%',
    },
  },
  righthandColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    width: '100%',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  buttons: {
    display: 'flex',
    gap: theme.spacing(1),
    gridColumn: '1 / -1',
  },
  lines: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  // Same padding as the CardHeader and CardContent of each card it stands in for
  cardHeader: {
    padding: '16px',
  },
  cardContent: {
    padding: '16px',
  },
};

// A ChplSkeletonCard around the shapes of a card's title and content
const renderCard = (titleWidth, body) => (
  <ChplSkeletonCard>
    <Box sx={styles.cardHeader}>
      <Skeleton variant="text" width={titleWidth} height={32} />
    </Box>
    <Box sx={styles.cardContent}>
      { body }
    </Box>
  </ChplSkeletonCard>
);

const renderLines = (widths) => (
  <Box sx={styles.lines}>
    { widths.map((width, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <Skeleton key={idx} variant="text" width={width} height={24} />
    ))}
  </Box>
);

function ChplDeveloperLoading() {
  return (
    <ChplLoadingPage label="Loading developer">
      <Box sx={styles.mainContent}>
        <Box sx={styles.lefthandContainer}>
          { renderCard('60%', (
            <Box sx={styles.detailsGrid}>
              {[...Array(6)].map((_field, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <Box key={idx} sx={styles.field}>
                  <Skeleton variant="text" width="55%" height={20} />
                  <Skeleton variant="text" width="85%" height={24} />
                </Box>
              ))}
              <Box sx={styles.buttons}>
                <Skeleton variant="rectangular" width={80} height={32} style={{ borderRadius: 4 }} />
                <Skeleton variant="rectangular" width={80} height={32} style={{ borderRadius: 4 }} />
              </Box>
            </Box>
          ))}
          { renderCard('45%', renderLines(['90%', '70%', '80%'])) }
          { renderCard('55%', renderLines(['85%', '65%'])) }
          { renderCard('50%', renderLines(['80%', '60%'])) }
        </Box>
        <Box sx={styles.righthandColumn}>
          { renderCard('40%', renderLines(['95%', '75%'])) }
          { renderCard('20%', (
            <>
              <Box sx={styles.resultsHeader}>
                <Skeleton variant="text" width="25%" height={24} />
                <Skeleton variant="text" width="15%" height={24} />
              </Box>
              {[...Array(4)].map((_product, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <Box key={idx} sx={styles.productRow}>
                  <Skeleton variant="text" width="35%" height={28} />
                  <Skeleton variant="text" width="20%" height={24} />
                  <Skeleton variant="text" width="15%" height={24} />
                  <Skeleton variant="circular" width={24} height={24} />
                </Box>
              ))}
            </>
          ))}
          { renderCard('30%', renderLines(['70%', '60%', '65%'])) }
        </Box>
      </Box>
    </ChplLoadingPage>
  );
}

export default ChplDeveloperLoading;
