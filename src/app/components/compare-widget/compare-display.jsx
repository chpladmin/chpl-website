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

import ChplEllipsis from 'components/util/chpl-ellipsis';
import { getAngularService } from 'services/angular-react-helper';
import { CompareContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  buttonContainer: {
    marginTop: '16px',
    gap: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardcontentPadding: {
    padding: '8px',
    width: '400px',
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
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
    $location.url(`/compare/${listings.map((listing) => listing.id).join('&')}`);
    $rootScope.$broadcast('HideCompareWidget');
    $rootScope.$digest();
  };

  const removeAll = () => {
    $rootScope.$broadcast('compare.removeAll');
  };

  if (!listings || listings.length === 0) {
    return (
      <CardContent id="no-products-selected">
        <Typography gutterBottom variant="h6"><strong>No products selected.</strong></Typography>
        <Typography variant="body2" className={classes.wordWrap}>Please select products to compare using the button found on either search results or product detail pages.</Typography>
      </CardContent>
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
          className={classes.deleteButtonOutlined}
          fullWidth
          variant="outlined"
          id="remove-listings"
          onClick={removeAll}
          endIcon={<DeleteIcon color="error" />}
        >
          Remove all products
        </Button>
      </div>
    </CardContent>
  );
}

export default ChplCompareDisplay;
