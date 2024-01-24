import React, { useContext } from 'react';
import {
  Box,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import UpdateIcon from '@material-ui/icons/Update';
import WarningIcon from '@material-ui/icons/Warning';
import * as jsJoda from '@js-joda/core';
import { string } from 'prop-types';

import ChplTooltip from 'components/util/chpl-tooltip';
import { getDisplayDateFormat } from 'services/date-util';
import { isListingActive } from 'services/listing.service';
import { CriterionContext, ListingContext } from 'shared/contexts';
import { palette } from 'themes';

const useStyles = makeStyles({
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
});

function ChplUpdateIndicator({ requiredDay, endDay, additionalInformation }) {
  const { criterion } = useContext(CriterionContext);
  const { listing } = useContext(ListingContext);
  const classes = useStyles();

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
              <Typography variant="body1" align="left" className={classes.additionalInformation}>
                { additionalInformation }
              </Typography>
            )}
        </Box>
      )}
      >
        <IconButton>
          <UpdateIcon className={classes.updateNeeded} />
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
              <Typography variant="body1" align="left" className={classes.additionalInformation}>
                { additionalInformation }
              </Typography>
            )}
        </Box>
      )}
      >
        <IconButton>
          <WarningIcon className={classes.updateRequired} />
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
              <Typography variant="body1" align="left" className={classes.additionalInformation}>
                { additionalInformation }
              </Typography>
            )}
        </Box>
      )}
      >
        <IconButton>
          <CheckCircleIcon className={classes.alreadyUpdated} />
        </IconButton>
      </ChplTooltip>
    );
  }

  return null;
}

export default ChplUpdateIndicator;

ChplUpdateIndicator.propTypes = {
  requiredDay: string,
  endDay: string,
  additionalInformation: string,
};

ChplUpdateIndicator.defaultProps = {
  requiredDay: undefined,
  endDay: undefined,
  additionalInformation: undefined,
};
