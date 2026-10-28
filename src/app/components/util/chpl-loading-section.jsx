import React from 'react';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {
  bool,
  number,
  oneOf,
  string,
} from 'prop-types';

import ChplSkeletonCard from './chpl-skeleton-card';
import ChplLoadingTable from './loading-table';

import { theme, utilStyles } from 'themes';

const styles = {
  // Same padding as the CardHeader and CardContent of the card this stands in for
  header: {
    padding: '16px',
  },
  body: {
    padding: '16px',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2, 4),
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
};

const lineWidths = ['90%', '75%', '85%', '60%', '80%'];

// Skeleton for a single block of content: a card of text, a form or a table.
// Its shapes sit in a ChplSkeletonCard, laid out where the real card's content
// goes, so it fills the space of the component it stands in for. Set `title`
// false when it fills an area that is already open, such as a dialog, and
// `announce` false when an enclosing skeleton already reports the loading
// status to assistive technology.
function ChplLoadingSection({
  announce = true,
  columns = 4,
  label = 'Loading',
  rows = 4,
  title = true,
  variant = 'text',
}) {
  const renderBody = () => {
    switch (variant) {
      case 'form':
        return (
          <Box sx={styles.form}>
            {[...Array(rows)].map((_row, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={idx} sx={styles.field}>
                <Skeleton variant="text" width="35%" height={16} />
                <Skeleton variant="rectangular" height={40} style={{ borderRadius: 4 }} />
              </Box>
            ))}
          </Box>
        );
      case 'table':
        return (
          <ChplLoadingTable columns={columns} rows={rows} showControls={false} framed={!title} />
        );
      default:
        return (
          <Box sx={styles.text}>
            {[...Array(rows)].map((_row, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={idx} variant="text" width={lineWidths[idx % lineWidths.length]} height={24} />
            ))}
          </Box>
        );
    }
  };

  return (
    <Box role={announce ? 'status' : undefined} aria-live={announce ? 'polite' : undefined}>
      { announce
        && (
          <Box component="span" sx={utilStyles.visuallyHidden}>{ label }</Box>
        )}
      { title
        ? (
          <ChplSkeletonCard>
            <Box aria-hidden="true">
              <Box sx={styles.header}>
                <Skeleton variant="text" width="30%" height={32} />
              </Box>
              <Box sx={styles.body}>
                { renderBody() }
              </Box>
            </Box>
          </ChplSkeletonCard>
        ) : (
          <Box aria-hidden="true">
            { renderBody() }
          </Box>
        )}
    </Box>
  );
}

export default ChplLoadingSection;

ChplLoadingSection.propTypes = {
  announce: bool,
  columns: number,
  label: string,
  rows: number,
  title: bool,
  variant: oneOf(['form', 'table', 'text']),
};
