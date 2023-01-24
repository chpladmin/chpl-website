import React, { useContext } from 'react';
import {
  Button,
  CardContent,
  Chip,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DeleteIcon from '@material-ui/icons/Delete';

import ChplEllipsis from 'components/util/chpl-ellipsis';
import { getAngularService } from 'services/angular-react-helper';
import { CmsContext } from 'shared/contexts';

const useStyles = makeStyles({
  buttonContainer: {
    marginTop: '16px',
    gap: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardcontentPadding: {
    padding: '8px',
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  productChips: {
    justifyContent: 'space-between',
    marginBottom: '8px',
    display: 'flex',
  },
});

function ChplCmsDisplay() {
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const { listings, removeListing } = useContext(CmsContext);
  const classes = useStyles();

  const actOnCertId = () => {
    console.log('acting');
  };

  const compareAll = () => {
    $analytics.eventTrack('Cms Listings', { category: 'Cms Widget' });
    console.log('do compare all');
  };

  const removeAll = () => {
    $analytics.eventTrack('Remove all Listings', { category: 'Cms Widget' });
    $rootScope.$broadcast('removeAll');
  };

  if (!listings || listings.length === 0) {
    return (
      <Typography>No products selected</Typography>
    );
  }

  return (
    <CardContent className={classes.cardcontentPadding}>
      <div className={classes.chipContainer}>
        { listings.sort((a, b) => (a.name < b.name ? -1 : 1))
          .map((listing) => (
            <Chip
              className={classes.productChips}
              color="primary"
              variant="outlined"
              key={listing.id}
              label={<ChplEllipsis text={listing.name} />}
              onDelete={() => removeListing(listing)}
            />
          ))}
      </div>
      <Divider />
      <div className={classes.buttonContainer}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          id="act-on-cert-id"
          onClick={actOnCertId}
          disabled={listings.length === 1}
          endIcon={<CheckIcon />}
        >
          Create Certification ID
        </Button>
        <Button
          fullWidth
          color="primary"
          variant="outlined"
          id="compare-listings"
          onClick={compareAll}
          disabled={listings.length === 1}
          endIcon={<CompareArrowsIcon />}
        >
          Compare Products
        </Button>
        <Button
          className={classes.deleteButton}
          fullWidth
          variant="contained"
          id="remove-listings"
          onClick={removeAll}
          endIcon={<DeleteIcon />}
        >
          Remove All
        </Button>
      </div>
    </CardContent>
  );
}

export default ChplCmsDisplay;
