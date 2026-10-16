import React from 'react';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {
  arrayOf,
  bool,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types';

import ChplSkeletonCard, { skeletonLineColor } from './chpl-skeleton-card';

import { theme, utilStyles } from 'themes';

// Mirrors ChplSearchResultCard and ChplSearchResultControls: the same padding,
// row and column switch at lg, field widths and dividers, so a page's skeleton
// is the shape of that page's own results
const styles = {
  controlsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
    padding: '16px 32px',
  },
  controls: {
    display: 'flex',
    gap: '8px',
  },
  card: {
    marginBottom: theme.spacing(1.5),
  },
  cardContent: {
    padding: theme.spacing(4, 8),
    paddingBottom: '16px',
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'stretch',
    flexDirection: 'column',
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  },
  contentBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    flex: 1,
  },
  primaryRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1.25, 3.5),
    minWidth: 0,
  },
  detailsRow: {
    borderTop: `1px solid ${skeletonLineColor}`,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: theme.spacing(1.5, 3),
    paddingTop: theme.spacing(1.25),
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.25),
    minWidth: 0,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    [theme.breakpoints.down('lg')]: {
      alignItems: 'stretch',
      width: '100%',
    },
    '@media (min-width: 800px) and (max-width: 1199.95px)': {
      flexDirection: 'row',
      borderTop: `1px solid ${skeletonLineColor}`,
      paddingTop: theme.spacing(1.5),
      '& > *': {
        flex: 1,
      },
    },
  },
};

// The first field of a primary row is the wide one (Developer, CHPL ID, Email...)
const wideField = { flex: '2 1 320px' };
const defaultField = { flex: '1 1 200px' };
const valueWidths = ['80%', '65%', '70%', '55%'];

// A group is a count of ordinary fields, or a list of fields that need their own
// width (`flex`, as the real field's style.flex) or height (`lines` of value)
const toFields = (group, groupIndex) => {
  if (Array.isArray(group)) { return group.map((field) => ({ ...defaultField, lines: 1, ...field })); }
  return [...Array(group)].map((_field, idx) => ({
    ...(idx === 0 && groupIndex < 2 ? wideField : defaultField),
    lines: 1,
  }));
};

// Loading results for a ChplSearchResultCard page. Describe the page's own card
// so the skeleton has its shape:
//   title       the card has a cardTitle/cardTitleValue row
//   fieldGroups one entry per fieldGroups row, e.g. [3, 3, 1] or
//               [3, 3, [{ flex: '1 1 100%', lines: 3 }]]
//   actions     the buttons in the actions column; 0 for none
//   controls    the controls beside the result count, such as sort and download
function ChplLoadingCards({
  actions = 2,
  cards = 5,
  controls = 2,
  fieldGroups = [3, 3],
  title = false,
}) {
  const renderField = (field, key) => (
    <Box key={key} sx={[styles.field, { flex: field.flex }]}>
      <Skeleton variant="text" width="45%" height={16} />
      {[...Array(field.lines)].map((_line, lineIdx) => (
        // eslint-disable-next-line react/no-array-index-key
        <Skeleton key={lineIdx} variant="text" width={valueWidths[(key + lineIdx) % valueWidths.length]} height={22} />
      ))}
    </Box>
  );

  return (
    <Box role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>Loading results</Box>
      <Box aria-hidden="true">
        <Box sx={styles.controlsHeader}>
          <Skeleton variant="text" width="30%" height={28} />
          { controls > 0
            && (
              <Box sx={styles.controls}>
                {[...Array(controls)].map((_control, idx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Skeleton key={idx} variant="rectangular" width={idx === 0 ? 120 : 200} height={36} sx={{ borderRadius: '4px' }} />
                ))}
              </Box>
            )}
        </Box>
        {[...Array(cards)].map((_card, cardIdx) => (
          // eslint-disable-next-line react/no-array-index-key
          <ChplSkeletonCard key={cardIdx} sx={styles.card}>
            <Box sx={styles.cardContent}>
              <Box sx={styles.contentBody}>
                { title
                  && (
                    <Box sx={styles.primaryRow}>
                      <Box sx={[styles.field, { flex: '1.75 1 320px' }]}>
                        <Skeleton variant="text" width="25%" height={16} />
                        <Skeleton variant="text" width="60%" height={30} />
                      </Box>
                    </Box>
                  )}
                { fieldGroups.map((group, groupIdx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Box key={groupIdx} sx={groupIdx < 2 ? styles.primaryRow : styles.detailsRow}>
                    { toFields(group, groupIdx).map((field, fieldIdx) => renderField(field, fieldIdx)) }
                  </Box>
                ))}
              </Box>
              { actions > 0
                && (
                  <Box sx={styles.actions}>
                    {[...Array(actions)].map((_action, idx) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <Skeleton key={idx} variant="rectangular" width={160} height={36} sx={{ borderRadius: '4px', maxWidth: '100%' }} />
                    ))}
                  </Box>
                )}
            </Box>
          </ChplSkeletonCard>
        ))}
      </Box>
    </Box>
  );
}

export default ChplLoadingCards;

ChplLoadingCards.propTypes = {
  actions: number,
  cards: number,
  controls: number,
  fieldGroups: arrayOf(oneOfType([
    number,
    arrayOf(shape({
      flex: string,
      lines: number,
    })),
  ])),
  title: bool,
};
