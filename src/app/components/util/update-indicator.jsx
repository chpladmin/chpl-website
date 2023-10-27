import React from 'react';
import {
  Card,
  CardContent,
  Divider,
  IconButton,
  Typography,
} from '@material-ui/core';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import UpdateIcon from '@material-ui/icons/Update';
import * as jsJoda from '@js-joda/core';
import { string } from 'prop-types';

import ChplTooltip from 'components/util/chpl-tooltip';
import { getDisplayDateFormat } from 'services/date-util';

function ChplUpdateIndicator({ requiredDay, endDay, additionalInformation }) {
  if (endDay && jsJoda.LocalDate.now() < endDay) {
    return (
      <ChplTooltip title={(
        <Card>
          <CardContent>
            <Typography variant="h5">
              Update Required by
              {' '}
              { getDisplayDateFormat(endDay) }
            </Typography>
            { additionalInformation
              && (
                <>
                  <Divider />
                  <Typography variant="body1">
                    { additionalInformation }
                  </Typography>
                </>
              )}
          </CardContent>
        </Card>
      )}
      >
        <IconButton>
          <UpdateIcon />
        </IconButton>
      </ChplTooltip>
    );
  }

  if (requiredDay && jsJoda.LocalDate.now() < requiredDay) {
    return (
      <ChplTooltip title={(
        <Card>
          <CardContent>
            <Typography variant="h5">
              Updated before
              {' '}
              { getDisplayDateFormat(requiredDay) }
            </Typography>
            { additionalInformation
              && (
                <>
                  <Divider />
                  <Typography variant="body1">
                    { additionalInformation }
                  </Typography>
                </>
              )}
          </CardContent>
        </Card>
      )}
      >
        <IconButton>
          <NewReleasesIcon />
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
