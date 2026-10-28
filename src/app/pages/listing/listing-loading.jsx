import React from 'react';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { ChplLoadingPage, ChplSkeletonCard } from 'components/util';
import { theme } from 'themes';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  leftSideContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  navigation: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    padding: theme.spacing(1, 2),
    overflowX: 'hidden',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'column',
      gap: theme.spacing(1),
      padding: theme.spacing(2),
    },
  },
  navigationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flex: '0 0 auto',
  },
  subscribe: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: '16px',
  },
  // Same padding as each section's header and CardContent
  sectionHeader: {
    padding: '16px',
  },
  sectionContent: {
    padding: '16px',
  },
  informationGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2, 4),
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  criterionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 0),
  },
};

// Listing information, Certification Criteria, Clinical Quality Measures,
// Safety Enhanced Design, G1/G2, Compliance and Additional Information
const navigationWidths = ['75%', '85%', '90%', '80%', '60%', '80%', '85%'];

// A ChplSkeletonCard around the shapes of a section's header and content
const renderSection = (headerWidth, body) => (
  <ChplSkeletonCard>
    <Box sx={styles.sectionHeader}>
      <Skeleton variant="text" width={headerWidth} height={36} />
    </Box>
    <Box sx={styles.sectionContent}>
      { body }
    </Box>
  </ChplSkeletonCard>
);

const renderRows = (count) => [...Array(count)].map((_row, idx) => (
  // eslint-disable-next-line react/no-array-index-key
  <Box key={idx} sx={styles.criterionRow}>
    <Skeleton variant="circular" width={24} height={24} />
    <Skeleton variant="text" width="15%" height={24} />
    <Skeleton variant="text" width="55%" height={24} />
  </Box>
));

function ChplListingLoading() {
  return (
    <ChplLoadingPage actions={3} favorite label="Loading listing">
      <Box sx={styles.container}>
        <Box sx={styles.leftSideContent}>
          <ChplSkeletonCard sx={styles.navigation}>
            { navigationWidths.map((width, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={idx} sx={styles.navigationItem}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={width} height={32} sx={{ flex: 1, minWidth: 80 }} />
              </Box>
            ))}
          </ChplSkeletonCard>
          <Box sx={styles.subscribe}>
            <Skeleton variant="rectangular" height={96} style={{ borderRadius: 8 }} />
          </Box>
        </Box>
        <Box sx={styles.content}>
          { renderSection('30%', (
            <Box sx={styles.informationGrid}>
              {[...Array(8)].map((_field, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <Box key={idx} sx={styles.field}>
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="70%" height={24} />
                </Box>
              ))}
            </Box>
          ))}
          { renderSection('35%', renderRows(6)) }
          { renderSection('40%', renderRows(3)) }
        </Box>
      </Box>
    </ChplLoadingPage>
  );
}

export default ChplListingLoading;
