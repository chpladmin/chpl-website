import React, { useContext } from 'react';
import {
  Button,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DeleteIcon from '@material-ui/icons/Delete';
import { func } from 'prop-types';

import ChplEllipsis from 'components/util/chpl-ellipsis';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { CompareContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  stickyWidgetHeader: {
    position: 'sticky',
    top: '24px',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    backgroundColor: palette.white,
    marginLeft: '-8px',
    marginRight: '-8px',
    marginBottom: '4px',
    padding: '4px 4px 4px 8px',
  },
  buttonContainer: {
    marginTop: '8px',
    gap: '6px',
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

function ChplCompareDisplay({ onClose }) {
  const $location = getAngularService('$location');
  const $rootScope = getAngularService('$rootScope');
  const { listings, removeListing } = useContext(CompareContext);
  const classes = useStyles();

  const compareAll = () => {
    $location.url(`/compare/${listings.map((listing) => listing.id).join('&')}`);
    $rootScope.$digest();
  };

  const removeAll = () => {
    eventTrack({
      event: 'Remove all Listings',
      category: 'Compare Widget',
    });
    listings.forEach((l) => removeListing(l));
  };

  if (!listings || listings.length === 0) {
    return (
      <CardContent id="no-products-selected">
        <div className={classes.stickyWidgetHeader}>
          <Typography variant="h6"><strong>No products selected.</strong></Typography>
          <IconButton aria-label="Close widget" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="body2" className={classes.wordWrap}>Please select products to compare using the button found on either search results or product detail pages.</Typography>
      </CardContent>
    );
  }

  return (
    <CardContent className={classes.cardcontentPadding}>
      <div className={classes.stickyWidgetHeader}>
        <Typography variant="h2">
          Compare Products
        </Typography>
        <IconButton aria-label="Close widget" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </div>
      <Divider />
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

ChplCompareDisplay.propTypes = {
  onClose: func.isRequired,
};
