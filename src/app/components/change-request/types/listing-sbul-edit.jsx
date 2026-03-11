import React, { useContext, useState } from 'react';
import {
  CircularProgress,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';

import ChplUrlChecker from 'components/url-checker/url-checker';
import ChplUrlCheckerResponse from 'components/url-checker/url-checker-response';
import { ChplLink } from 'components/util';
import { ChangeRequestContext, useAnalyticsContext } from 'shared/contexts';

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
  const [isLoading, setIsLoading] = useState(false);
  const [urlCheckResponse, setUrlCheckResponse] = useState(undefined);
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

  const handleDispatch = ({ action, payload, url: submittedUrl }) => {
    switch (action) {
      case 'loading':
        setIsLoading(true);
        setUrlCheckResponse(undefined);
        break;
      case 'complete':
        setIsLoading(false);
        setChangeRequest((prev) => ({
          ...prev,
          details: {
            ...prev.details,
            url: submittedUrl,
          },
        }));
        setUrlCheckResponse(payload);
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
        <ChplUrlChecker
          dispatch={handleDispatch}
          url={changeRequest.details.url}
        />
        { isLoading && <CircularProgress /> }
        { urlCheckResponse
          && (
            <ChplUrlCheckerResponse
              response={urlCheckResponse}
            />
          )}
      </div>
    </div>
  );
}

export default ChplChangeRequestListingSbulEdit;

ChplChangeRequestListingSbulEdit.propTypes = {
};
