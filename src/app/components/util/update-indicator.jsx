import React, { useContext } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UpdateIcon from '@mui/icons-material/Update';
import WarningIcon from '@mui/icons-material/Warning';
import * as jsJoda from '@js-joda/core';
import { string } from 'prop-types';

import ChplTooltip from 'components/util/chpl-tooltip';
import { getDisplayDateFormat } from 'services/date-util';
import { isListingActive } from 'services/listing.service';
import { CriterionContext, ListingContext } from 'shared/contexts';
import { palette } from 'themes';

const styles = {
  updateRequired: {
    color: palette.error,
  },
  updateNeeded: {
    color: palette.warningDark,
  },
  alreadyUpdated: {
    color: palette.active,
  },
  additionalInformation: {
    paddingTop: '8px',
  },
};

function ChplUpdateIndicator({
  additionalInformation = undefined,
  endDay = undefined,
  requiredDay = undefined,
}) {
  const { criterion } = useContext(CriterionContext);
  const { listing } = useContext(ListingContext);

  if (listing.chplProductNumber
      && (!isListingActive(listing)
          || criterion.criterion.status === 'REMOVED')) {
    return null;
  }

  if (endDay && jsJoda.LocalDate.now() <= endDay) {
    return (
      <ChplTooltip title={(
        <Box>
          <Typography variant="h5" align="left">
            Update Required by
            {' '}
            { getDisplayDateFormat(endDay) }
          </Typography>
          { additionalInformation
            && (
              <Typography variant="body1" align="left" sx={styles.additionalInformation}>
                { additionalInformation }
              </Typography>
            )}
        </Box>
      )}
      >
        <IconButton size="large">
          <UpdateIcon sx={styles.updateNeeded} />
        </IconButton>
      </ChplTooltip>
    );
  }

  if (endDay && jsJoda.LocalDate.now() > endDay) {
    return (
      <ChplTooltip title={(
        <Box>
          <Typography variant="h5" align="left">
            Requirement not met: Update Required by
            {' '}
            { getDisplayDateFormat(endDay) }
          </Typography>
          { additionalInformation
            && (
              <Typography variant="body1" align="left" sx={styles.additionalInformation}>
                { additionalInformation }
              </Typography>
            )}
        </Box>
      )}
      >
        <IconButton size="large">
          <WarningIcon sx={styles.updateRequired} />
        </IconButton>
      </ChplTooltip>
    );
  }

  if (requiredDay && jsJoda.LocalDate.now() < requiredDay) {
    return (
      <ChplTooltip title={(
        <Box>
          <Typography variant="h5" align="left">
            Requirement met for
            {' '}
            { getDisplayDateFormat(requiredDay).split(', ')[1] }
          </Typography>
          { additionalInformation
            && (
              <Typography variant="body1" align="left" sx={styles.additionalInformation}>
                { additionalInformation }
              </Typography>
            )}
        </Box>
      )}
      >
        <IconButton size="large">
          <CheckCircleIcon sx={styles.alreadyUpdated} />
        </IconButton>
      </ChplTooltip>
    );
  }

  return null;
}

export default ChplUpdateIndicator;

ChplUpdateIndicator.propTypes = {
  additionalInformation: string,
  endDay: string,
  requiredDay: string,
};
