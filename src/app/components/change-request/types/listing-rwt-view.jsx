import React, { useContext } from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

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

function ChplChangeRequestListingRwtView({ title, value }) {
  const { analytics } = useAnalyticsContext();
  const { changeRequest } = useContext(ChangeRequestContext);
  const classes = useStyles();

  const getCurrent = () => {
    if (changeRequest.details.listing[value]) {
      return (
        <ChplLink
          href={changeRequest.details.listing[value]}
          analytics={{
            ...analytics,
            event: `Navigate to Current RWT ${title} URL`,
            label: changeRequest.details.listing[value],
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
          Current RWT
          {' '}
          { title }
          {' '}
          URL
        </Typography>
        <Typography>
          { getCurrent() }
        </Typography>
        <Typography variant="subtitle2">
          CHPL Product Number
        </Typography>
        <Typography>
          <ChplLink
            href={`#/listing/${changeRequest.details.listing.id}`}
            text={changeRequest.details.listing.chplProductNumber}
            analytics={{
              ...analytics,
              event: 'Navigate to Listing Details Page',
              label: changeRequest.details.listing.chplProductNumber,
              aggregationName: changeRequest.details.listing.product.name,
            }}
            external={false}
            router={{ sref: 'listing', options: { id: changeRequest.details.listing.id } }}
          />
        </Typography>
      </div>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">
          Submitted RWT
          {' '}
          { title }
          {' '}
          URL
        </Typography>
        <Typography>
          <ChplLink
            href={changeRequest.details.url}
            analytics={{
              ...analytics,
              event: `Navigate to Submitted RWT ${title} URL`,
              label: changeRequest.details.url,
            }}
          />
        </Typography>
      </div>
    </div>
  );
}

export default ChplChangeRequestListingRwtView;

ChplChangeRequestListingRwtView.propTypes = {
  title: string.isRequired,
  value: string.isRequired,
};
