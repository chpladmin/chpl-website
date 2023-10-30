import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import UpdateIcon from '@material-ui/icons/Update';
import * as jsJoda from '@js-joda/core';
import { string } from 'prop-types';

import ChplTooltip from 'components/util/chpl-tooltip';
import { getDisplayDateFormat } from 'services/date-util';
import { palette } from 'themes';

const useStyles = makeStyles({
  updateRequired: {
    color: palette.error,
  },
  alreadyUpdated: {
    color: palette.active,
  },
  additionalInformation: {
    paddingTop: '8px',
  },
});

function ChplUpdateIndicator({ requiredDay, endDay, additionalInformation }) {
  const classes = useStyles();

  if (endDay && jsJoda.LocalDate.now() < endDay) {
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
          <UpdateIcon className={classes.updateRequired} />
        </IconButton>
      </ChplTooltip>
    );
  }

  if (requiredDay && jsJoda.LocalDate.now() < requiredDay) {
    return (
      <ChplTooltip title={(
        <Box>
          <Typography variant="h5" align="left">
            Updated before
            {' '}
            { getDisplayDateFormat(requiredDay) }
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
          <NewReleasesIcon className={classes.alreadyUpdated} />
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
