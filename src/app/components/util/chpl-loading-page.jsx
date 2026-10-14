import React from 'react';
import { Box, Container } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {
  bool,
  node,
  number,
  oneOf,
  string,
} from 'prop-types';

import ChplLoadingSection from './chpl-loading-section';
import ChplPageBody from './chpl-page-body';

import { palette, theme, utilStyles } from 'themes';

const styles = {
  // ChplPageHeader's white band. It's the page's own background, not a card, so
  // it stays as it is: without it the header would change colour when the page arrives
  header: {
    position: 'relative',
    boxShadow: 2,
    backgroundColor: palette.white,
    padding: theme.spacing(8),
  },
  subtitle: {
    marginTop: '8px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '40%',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
  },
  sections: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
};

// Skeleton for a whole page: a ChplPageHeader-shaped title bar over a
// ChplPageBody of section skeletons. Rendering the real ChplPageBody keeps the
// skip link's #main-content target present while the page loads. Pass
// `children` to replace the generic sections with a page-specific layout.
// `favorite` adds the star shown beside the title on pages that support it,
// and `subtitle` the lines of a header's description.
function ChplLoadingPage({
  actions = 0,
  children = null,
  columns = 4,
  favorite = false,
  label = 'Loading',
  rows = 4,
  sections = 3,
  subtitle = 0,
  variant = 'text',
}) {
  return (
    <Box role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>{ label }</Box>
      <Box sx={styles.header} aria-hidden="true">
        <Container maxWidth="lg">
          <Box sx={styles.headerRow}>
            <Box sx={styles.title}>
              <Skeleton variant="text" width="100%" height={56} />
              { favorite
                && (
                  <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />
                )}
            </Box>
            { (actions > 0 || subtitle > 0)
              && (
                <Box sx={styles.actions}>
                  {[...Array(actions)].map((_action, idx) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Skeleton key={idx} variant="rectangular" width={110} height={32} style={{ borderRadius: 4 }} />
                  ))}
                  {/* A header with a subtitle has its Hide Details button */}
                  { subtitle > 0
                    && (
                      <Skeleton variant="rectangular" width={130} height={36} style={{ borderRadius: 4 }} />
                    )}
                </Box>
              )}
          </Box>
          { subtitle > 0
            && (
              <Box sx={styles.subtitle}>
                {[...Array(subtitle)].map((_line, idx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Skeleton key={idx} variant="text" width={idx === subtitle - 1 ? '60%' : '100%'} height={22} />
                ))}
              </Box>
            )}
        </Container>
      </Box>
      <ChplPageBody>
        <Box sx={styles.body} aria-hidden="true">
          { children
            || (
              <Box sx={styles.sections}>
                {[...Array(sections)].map((_section, idx) => (
                  <ChplLoadingSection
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    announce={false}
                    columns={columns}
                    rows={rows}
                    variant={variant}
                  />
                ))}
              </Box>
            )}
        </Box>
      </ChplPageBody>
    </Box>
  );
}

export default ChplLoadingPage;

ChplLoadingPage.propTypes = {
  actions: number,
  children: node,
  columns: number,
  favorite: bool,
  label: string,
  rows: number,
  sections: number,
  subtitle: number,
  variant: oneOf(['form', 'table', 'text']),
};
