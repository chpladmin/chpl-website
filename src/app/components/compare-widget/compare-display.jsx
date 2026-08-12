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
import { func, objectOf, string } from 'prop-types';

import { ChplEllipsis, ChplLink } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { CompareContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

function ChplCompareEmptyStateIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" fill={palette.secondary} />
      <rect x="14" y="18" width="20" height="28" rx="3" fill={palette.white} stroke={palette.grey} strokeWidth="2" />
      <rect x="30" y="18" width="20" height="28" rx="3" fill={palette.white} stroke={palette.primary} strokeWidth="2" />
      <line x1="19" y1="26" x2="29" y2="26" stroke={palette.grey} strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="32" x2="29" y2="32" stroke={palette.grey} strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="26" x2="45" y2="26" stroke={palette.primaryLight} strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="32" x2="45" y2="32" stroke={palette.primaryLight} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChplCompareWidgetHelpFooter({ classes }) {
  return (
    <div className={classes.widgetHelpFooter}>
      <Typography variant="caption" color="textPrimary">
        For assistance, view the
        {' '}
        <ChplLink
          href="https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf"
          text="CHPL Public User Guide"
          analytics={{ event: 'Open CHPL Public User Guide', category: 'Compare Widget' }}
          external={false}
          inline
        />
        .
      </Typography>
    </div>
  );
}

ChplCompareWidgetHelpFooter.propTypes = {
  classes: objectOf(string).isRequired,
};

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
    marginBottom: '16px',
    padding: '4px 4px 4px 8px',
    borderBottom: `1px solid ${palette.divider}`,
  },
  sectionLabelFontWeight800: {
    fontWeight: '800 !important',
  },
  emptyStateBody: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '8px',
    padding: '16px 8px',
  },
  buttonContainer: {
    marginTop: '8px',
    gap: '6px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardcontentPadding: {
    padding: '8px',
    maxWidth: '400px',
  },
  mainCardContent: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  widgetHelpFooter: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '4px',
    paddingTop: '8px',
  },
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '4px',
    marginTop: '8px',
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
      <CardContent id="no-products-selected" className={`${classes.cardcontentPadding} ${classes.mainCardContent}`}>
        <div className={classes.stickyWidgetHeader}>
          <Typography variant="h2">
            Compare Products
          </Typography>
          <IconButton aria-label="Close widget" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.emptyStateBody}>
          <ChplCompareEmptyStateIcon />
          <Typography variant="h6"><strong>No products selected.</strong></Typography>
          <Typography variant="body2" color="textPrimary">
            Please select products to compare using the button found on either search results or product detail pages.
          </Typography>
        </div>
        <ChplCompareWidgetHelpFooter classes={classes} />
      </CardContent>
    );
  }

  return (
    <CardContent className={`${classes.cardcontentPadding} ${classes.mainCardContent}`}>
      <div className={classes.stickyWidgetHeader}>
        <Typography variant="h2">
          Compare Products
        </Typography>
        <IconButton aria-label="Close widget" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </div>
      <Typography className={classes.sectionLabelFontWeight800}>Products Selected</Typography>
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
      <ChplCompareWidgetHelpFooter classes={classes} />
    </CardContent>
  );
}

export default ChplCompareDisplay;

ChplCompareDisplay.propTypes = {
  onClose: func.isRequired,
};
