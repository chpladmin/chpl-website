import React, { useContext } from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ChplLink } from 'components/util';
import { ChangeRequestContext, useAnalyticsContext } from 'shared/contexts';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  detailsContainer: {
    display: 'grid',
    gap: '8px',
  },
});

function ChplChangeRequestListingSbulView() {
  const { analytics } = useAnalyticsContext();
  const { changeRequest } = useContext(ChangeRequestContext);
  const classes = useStyles();

  const getCurrent = () => {
    if (changeRequest.details.listing.certificationResults.find((cr) => cr.criterion.id === 182)?.serviceBaseUrlList) {
      const url = changeRequest.details.listing.certificationResults.find((cr) => cr.criterion.id === 182)?.serviceBaseUrlList;
      return (
        <ChplLink
          href={url}
          analytics={{
            ...analytics,
            event: 'Navigate to Current SBUL',
            label: url,
          }}
        />
      );
    }
    return 'No current URL';
  };

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">
          Current Service Base URL List
        </Typography>
        <Typography>
          { getCurrent() }
        </Typography>
      </div>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">
          Submitted Service Base URL List
        </Typography>
        <Typography>
          <ChplLink
            href={changeRequest.details.url}
            analytics={{
              ...analytics,
              event: 'Navigate to Submitted SBUL',
              label: changeRequest.details.url,
            }}
          />
        </Typography>
      </div>
    </div>
  );
}

export default ChplChangeRequestListingSbulView;

ChplChangeRequestListingSbulView.propTypes = {
};
