import React, { useContext } from 'react';
import {
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';

import ChplUrlChecker from 'components/url-checker/url-checker';
import { ChplLink } from 'components/util';
import { ChangeRequestContext, UserContext, useAnalyticsContext } from 'shared/contexts';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #DDD',
    paddingRight: '16px',
    marginRight: '8px',
    gap: '16px',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailsSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
});

function ChplChangeRequestListingSbulEdit() {
  const { analytics } = useAnalyticsContext();
  const { changeRequest, setChangeRequest } = useContext(ChangeRequestContext);
  const { hasAnyRole } = useContext(UserContext);
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

  const handleDispatch = ({ action, url: submittedUrl }) => {
    switch (action) {
      case 'complete':
        setChangeRequest((prev) => ({
          ...prev,
          details: {
            ...prev.details,
            url: submittedUrl,
          },
        }));
        break;
      case 'update':
        setChangeRequest((prev) => ({
          ...prev,
          details: {
            ...prev.details,
            url: submittedUrl,
          },
        }));
        break;
        // no default
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Current details</Typography>
        <Typography>
          { getCurrent() }
        </Typography>
      </div>
      <Divider />
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Submitted details</Typography>
        { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])
          && (
            <Typography>
              { changeRequest.details.url }
            </Typography>
          )}
        { hasAnyRole(['chpl-developer'])
          && (
            <ChplUrlChecker
              dispatch={handleDispatch}
              url={changeRequest.details.url}
            />
          )}
      </div>
    </div>
  );
}

export default ChplChangeRequestListingSbulEdit;

ChplChangeRequestListingSbulEdit.propTypes = {
};
