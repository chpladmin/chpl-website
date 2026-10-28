import React, { useContext } from 'react';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {
  arrayOf,
  bool,
  node,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types';

import { ChplSkeletonCard, skeletonLineColor } from 'components/util';
import { UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

// Mirrors the System Maintenance Card: its CardHeader and CardContent padding,
// the results header (utilStyles.headerContainer), the filter search bar and
// sidebar layout (ChplFilterSearchBar, ChplFilterLayout) and each
// ChplSearchResultCard, so the skeleton has the shape of the loaded card
const loadingStyles = {
  cardHeader: {
    padding: '16px',
  },
  cardContent: {
    padding: '16px',
    paddingBottom: '24px',
  },
  searchBar: {
    borderRadius: '8px',
    height: '80px',
  },
  filterLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'start',
    margin: '16px 0',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '260px 1fr',
      gap: '24px',
    },
  },
  sidebar: {
    borderRadius: '4px',
    height: '36px',
    [theme.breakpoints.up('md')]: {
      borderRadius: '8px',
      height: '120px',
    },
  },
  resultsHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    padding: '16px 32px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  results: {
    padding: '16px',
  },
  // A ChplSearchResultCard, outlined rather than filled, since it sits inside
  // the skeleton card that stands in for the System Maintenance Card
  resultCard: {
    border: `1px solid ${skeletonLineColor}`,
    borderRadius: '8px',
    marginBottom: theme.spacing(1.5),
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
  resultBody: {
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
  },
};

const defaultField = { flex: '1 1 200px', lines: 1 };
const valueWidths = ['80%', '65%', '70%', '55%'];

// A group is a count of fields, or a list of fields with their own `flex` or `lines`
const toFields = (group) => (Array.isArray(group)
  ? group.map((field) => ({ ...defaultField, ...field }))
  : [...Array(group)].map(() => defaultField));

const renderField = (field, key) => (
  <Box key={key} sx={[loadingStyles.field, { flex: field.flex }]}>
    <Skeleton variant="text" width="45%" height={16} />
    {[...Array(field.lines)].map((_line, lineIdx) => (
      // eslint-disable-next-line react/no-array-index-key
      <Skeleton key={lineIdx} variant="text" width={valueWidths[(key + lineIdx) % valueWidths.length]} height={22} />
    ))}
  </Box>
);

// The results half of a System Maintenance card: the header with its result
// count and controls (sort, history, Add), then a list of result cards.
// Exported for cards that hold more than one list, such as System Jobs.
function ChplSystemMaintenanceResults({
  actions = 0,
  cards = 5,
  controls = 1,
  fieldGroups = [],
}) {
  return (
    <>
      <Box sx={loadingStyles.resultsHeader}>
        <Skeleton variant="text" width="30%" height={28} />
        { controls > 0
          && (
            <Box sx={loadingStyles.controls}>
              {[...Array(controls)].map((_control, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <Skeleton key={idx} variant="rectangular" width={idx === 0 ? 120 : 80} height={36} sx={{ borderRadius: '4px' }} />
              ))}
            </Box>
          )}
      </Box>
      <Box sx={loadingStyles.results}>
        {[...Array(cards)].map((_card, cardIdx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={cardIdx} sx={loadingStyles.resultCard}>
            <Box sx={loadingStyles.resultBody}>
              <Box sx={loadingStyles.primaryRow}>
                <Box sx={[loadingStyles.field, { flex: '1.75 1 320px' }]}>
                  <Skeleton variant="text" width="25%" height={16} />
                  <Skeleton variant="text" width="60%" height={30} />
                </Box>
              </Box>
              { fieldGroups.map((group, groupIdx) => (
                // eslint-disable-next-line react/no-array-index-key
                <Box key={groupIdx} sx={groupIdx < 2 ? loadingStyles.primaryRow : loadingStyles.detailsRow}>
                  { toFields(group).map((field, fieldIdx) => renderField(field, fieldIdx)) }
                </Box>
              ))}
            </Box>
            { actions > 0
              && (
                <Box sx={loadingStyles.actions}>
                  {[...Array(actions)].map((_action, idx) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Skeleton key={idx} variant="rectangular" width={90} height={30} sx={{ borderRadius: '4px', maxWidth: '100%' }} />
                  ))}
                </Box>
              )}
          </Box>
        ))}
      </Box>
    </>
  );
}

// Skeleton for a System Maintenance card while its list loads. Describe the
// loaded card so the skeleton takes its shape:
//   filter      the card has a ChplFilterSearchBar and ChplFilterLayout sidebar
//   controls    the controls in the results header: sort, history, Add
//   fieldGroups one entry per fieldGroups row of its result cards, as for ChplLoadingCards
//   actions     the buttons in each result card's actions column; 0 for none
//   editable    the card has the Add and Edit buttons shown to ONC and admins,
//               so for those users add one control and one action
// Pass `children` to replace the results with a card's own layout.
function ChplSystemMaintenanceLoading({
  actions = 0,
  cards = 5,
  children = null,
  controls = 1,
  editable = false,
  fieldGroups = [],
  filter = false,
  label = 'Loading',
}) {
  const { hasAnyRole } = useContext(UserContext);
  const canEdit = editable && hasAnyRole(['chpl-admin', 'chpl-onc']);
  const results = children || (
    <ChplSystemMaintenanceResults
      actions={actions + (canEdit ? 1 : 0)}
      cards={cards}
      controls={controls + (canEdit ? 1 : 0)}
      fieldGroups={fieldGroups}
    />
  );

  return (
    <Box role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>{ label }</Box>
      <ChplSkeletonCard>
        <Box aria-hidden="true">
          <Box sx={loadingStyles.cardHeader}>
            <Skeleton variant="text" width="25%" height={32} />
          </Box>
          <Box sx={loadingStyles.cardContent}>
            { filter
              ? (
                <>
                  <Skeleton variant="rectangular" sx={loadingStyles.searchBar} />
                  <Box sx={loadingStyles.filterLayout}>
                    <Skeleton variant="rectangular" sx={loadingStyles.sidebar} />
                    <Box>
                      { results }
                    </Box>
                  </Box>
                </>
              ) : results }
          </Box>
        </Box>
      </ChplSkeletonCard>
    </Box>
  );
}

const fieldGroupsType = arrayOf(oneOfType([
  number,
  arrayOf(shape({
    flex: string,
    lines: number,
  })),
]));

export default ChplSystemMaintenanceLoading;
export { ChplSystemMaintenanceResults };

ChplSystemMaintenanceLoading.propTypes = {
  actions: number,
  cards: number,
  children: node,
  controls: number,
  editable: bool,
  fieldGroups: fieldGroupsType,
  filter: bool,
  label: string,
};

ChplSystemMaintenanceResults.propTypes = {
  actions: number,
  cards: number,
  controls: number,
  fieldGroups: fieldGroupsType,
};
