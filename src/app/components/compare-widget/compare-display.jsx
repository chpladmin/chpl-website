import React, { useContext } from 'react';
import {
  Button,
  CardContent,
  Chip,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DeleteIcon from '@material-ui/icons/Delete';
import ReactGA from 'react-ga4';

import ChplEllipsis from 'components/util/chpl-ellipsis';
import { getAngularService } from 'services/angular-react-helper';
import { CompareContext } from 'shared/contexts';

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

function ChplCompareDisplay() {
  const $location = getAngularService('$location');
  const $rootScope = getAngularService('$rootScope');
  const { listings, removeListing } = useContext(CompareContext);
  const classes = useStyles();

  const compareAll = () => {
    ReactGA.event({
      category: 'Compare Widget',
      action: 'Compare Listings',
      label: 'test',
    });
    $location.url(`/compare/${listings.map((listing) => listing.id).join('&')}`);
    $rootScope.$broadcast('HideCompareWidget');
    $rootScope.$digest();
  };

  const removeAll = () => {
    ReactGA.event({
      category: 'Compare Widget',
      action: 'Remove all Listings',
    }); 
    $rootScope.$broadcast('compare.removeAll');
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
          id="compare-listings"
          onClick={compareAll}
          disabled={listings.length === 1}
          endIcon={<CompareArrowsIcon />}
        >
          Compare products
        </Button>
        <Button
          className={classes.deleteButton}
          fullWidth
          variant="contained"
          id="remove-listings"
          onClick={removeAll}
          endIcon={<DeleteIcon />}
        >
          Remove all products
        </Button>
      </div>
    </CardContent>
  );
}

export default ChplCompareDisplay;
