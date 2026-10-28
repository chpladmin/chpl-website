import React from 'react';
import { Box, Container } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { bool, number, string } from 'prop-types';

import { ChplSkeletonCard, skeletonLineColor } from 'components/util';
import { utilStyles } from 'themes';

// Same layout as the Developer, Product and Version steps: the use-existing and
// create choices side by side, a divider, then the card for the chosen one
const loadingStyles = {
  stepConfirm: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
    padding: '32px 0',
    alignItems: 'start',
  },
  stepSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'self-start',
    gap: '32px',
  },
  choice: {
    borderRadius: '4px',
  },
  orContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    paddingTop: '32px',
  },
  divider: {
    borderTop: `1px solid ${skeletonLineColor}`,
  },
  header: {
    padding: '16px',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
  },
  field: {
    borderRadius: '4px',
  },
};

// Skeleton for one step of the confirm wizard while the developers, products or
// versions it offers are loading. `fields` is the number of inputs in the card
// below the choices: one for a select, more for a create form. Set `announce`
// false when an enclosing skeleton already reports the loading status.
function ChplConfirmStepLoading({
  announce = true,
  fields = 1,
  label = 'Loading',
}) {
  return (
    <Box role={announce ? 'status' : undefined} aria-live={announce ? 'polite' : undefined}>
      { announce
        && (
          <Box component="span" sx={utilStyles.visuallyHidden}>{ label }</Box>
        )}
      <Container maxWidth="md" aria-hidden="true">
        <Box sx={loadingStyles.stepConfirm}>
          <Box sx={loadingStyles.stepSubContainer}>
            <Skeleton variant="rectangular" height={124} sx={loadingStyles.choice} />
            <Box sx={loadingStyles.orContainer}>
              <Skeleton variant="text" width={24} height={24} />
            </Box>
            <Skeleton variant="rectangular" height={124} sx={loadingStyles.choice} />
          </Box>
          <Box sx={loadingStyles.divider} />
          <ChplSkeletonCard>
            <Box sx={loadingStyles.header}>
              <Skeleton variant="text" width="35%" height={32} />
            </Box>
            <Box sx={loadingStyles.body}>
              {[...Array(fields)].map((_field, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <Skeleton key={idx} variant="rectangular" height={56} sx={loadingStyles.field} />
              ))}
            </Box>
          </ChplSkeletonCard>
        </Box>
      </Container>
    </Box>
  );
}

export default ChplConfirmStepLoading;

ChplConfirmStepLoading.propTypes = {
  announce: bool,
  fields: number,
  label: string,
};
