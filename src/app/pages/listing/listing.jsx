import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Star, StarOutline, Edit, CloudDownload,
} from '@material-ui/icons';
import { number, oneOfType, string } from 'prop-types';

import { useFetchListing } from 'api/listing';
import ChplActionButton from 'components/action-widget/action-button';
import ChplBrowserViewedWidget from 'components/browser/browser-viewed-widget';
import ChplListingView from 'components/listing/listing-view';
import ChplListingHistory from 'pages/listing/history/listing-history';
import ChplSurveillanceEdit from 'components/listing/details/compliance/surveillance-edit';
import ChplTooltip from 'components/util/chpl-tooltip';
import { getAngularService } from 'services/angular-react-helper';
import { eventTrack } from 'services/analytics.service';
import { useLocalStorage } from 'services/storage.service';
import {
  AnalyticsContext,
  ListingContext,
  UserContext,
  useAnalyticsContext,
} from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    padding: '32px 0',
    backgroundColor: palette.background,
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  favoriteContainer: {
    display: 'flex',
    alignItems: 'baseline',
  },
  listingHeaderBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gridGap: '16px',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
      gridGap: 'none',
    },
  },
  loadingScreen: {
    height: '100vh',
  },
  pageHeader: {
    padding: '32px 0',
    backgroundColor: palette.white,
  },
});

function ChplListingPage({ id }) {
  const $state = getAngularService('$state');
  const API = getAngularService('API');
  const { getApiKey, getToken } = getAngularService('authService');
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole, user } = useContext(UserContext);
  const { data, isLoading, isSuccess } = useFetchListing({ id });
  const [activeSurveillance, setActiveSurveillance] = useState(undefined);
  const [listing, setListing] = useState(undefined);
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const classes = useStyles();
  let analyticsData;

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setListing(data);
  }, [data, isLoading, isSuccess]);

  const canEdit = () => {
    if (hasAnyRole(['chpl-admin'])) { return true; }
    if (!['Active', 'Suspended by ONC', 'Suspended by ONC-ACB'].includes(listing.currentStatus.status.name)) { return false; }
    if (hasAnyRole(['chpl-onc'])) { return true; }
    if (hasAnyRole(['chpl-onc-acb']) && user.organizations.some((o) => o.id === listing.certifyingBody.id)) { return true; }
    return false;
  };

  const canGetCurrentCsv = () => {
    if (listing.edition !== null && listing.edition.name !== '2015') { return false; }
    if (hasAnyRole(['chpl-admin', 'chpl-onc'])) { return true; }
    if (hasAnyRole(['chpl-onc-acb']) && user.organizations.some((o) => o.id === listing.certifyingBody.id)) { return true; }
    return false;
  };

  const downloadOriginalCsv = () => {
    eventTrack({
      ...analyticsData.analytics,
      event: 'Download Original CSV',
    });
    const downloadLink = `${API}/listings/${listing.id}/uploaded-file?api_key=${getApiKey()}&authorization=Bearer%20${getToken()}`;
    window.open(downloadLink);
  };

  const downloadCurrentCsv = () => {
    eventTrack({
      ...analyticsData.analytics,
      event: 'Download Current CSV',
    });
    const downloadLink = `${API}/certified_products/${listing.id}/download?api_key=${getApiKey()}&authorization=Bearer%20${getToken()}`;
    window.open(downloadLink);
  };

  const edit = () => {
    eventTrack({
      ...analyticsData.analytics,
      event: 'Edit',
    });
    $state.go('listing.edit');
  };

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveSurveillance(undefined);
        break;
      case 'edit':
        setActiveSurveillance(payload);
        break;
        // no default
    }
  };

  const isFavorited = favorites.some((fav) => fav && fav.id === listing?.id);

  const toggleFavorite = () => {
    setFavorites((prevFavorites) => {
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav && fav.id !== listing?.id);
      }
      return [...prevFavorites, listing];
    });
  };

  if (isLoading || !isSuccess || !listing) {
    return (
      <div className={classes.loadingScreen}>
        <CircularProgress />
      </div>
    );
  }

  const listingState = {
    listing,
    setListing,
  };

  analyticsData = {
    analytics: {
      ...analytics,
      category: 'Listing Details',
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
    },
  };

  if (activeSurveillance) {
    return (
      <AnalyticsContext.Provider value={analyticsData}>
        <ListingContext.Provider value={listingState}>
          <ChplSurveillanceEdit
            surveillance={activeSurveillance}
            dispatch={handleDispatch}
          />
        </ListingContext.Provider>
      </AnalyticsContext.Provider>
    );
  }

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <Box bgcolor={palette.background}>
        <ChplBrowserViewedWidget
          listing={listing}
        />
        <div className={classes.pageHeader}>
          <Container maxWidth="lg">
            <Box className={classes.listingHeaderBox}>
              <Box display="flex" alignItems="center" gridGap="4px">
                <Typography
                  variant="h1"
                >
                  {listing.product.name}
                </Typography>
                <Box className={classes.favoriteContainer}>
                  <ChplTooltip
                    title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    placement="top"
                  >
                    <IconButton
                      onClick={toggleFavorite}
                      style={{ color: '#e3bf00' }}
                      aria-label={isFavorited ? 'Unfavorite' : 'Favorite'}
                    >
                      {isFavorited ? <Star /> : <StarOutline />}
                    </IconButton>
                  </ChplTooltip>
                  <Fade in={isFavorited} timeout={{ enter: 500, exit: 500 }}>
                    <Typography variant="body1">
                      {isFavorited ? 'This listing is in your favorites!' : ''}
                    </Typography>
                  </Fade>
                </Box>
              </Box>
              <Box>
                <ChplActionButton
                  listing={listing}
                  horizontal
                >
                  { canEdit()
                    && (
                      <Button
                        endIcon={<Edit />}
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={edit}
                      >
                        Edit
                      </Button>
                    )}
                  <ChplListingHistory
                    listing={listing}
                  />
                  { hasAnyRole(['chpl-admin']) && listing.id >= 10912
                    && (
                      <Button
                        color="secondary"
                        variant="contained"
                        size="small"
                        id={`download-original-csv-${listing.id}`}
                        onClick={downloadOriginalCsv}
                        endIcon={<CloudDownload />}
                      >
                        Original CSV
                      </Button>
                    )}
                  { canGetCurrentCsv()
                    && (
                      <Button
                        color="secondary"
                        variant="contained"
                        size="small"
                        id={`download-current-csv-${listing.id}`}
                        onClick={downloadCurrentCsv}
                        endIcon={<CloudDownload />}
                      >
                        Current CSV
                      </Button>
                    )}
                </ChplActionButton>
              </Box>
            </Box>
          </Container>
        </div>
        <Container maxWidth="lg">
          <div className={classes.container} id="main-content" tabIndex="-1">
            <ListingContext.Provider value={listingState}>
              <ChplListingView
                listing={listing}
                dispatch={handleDispatch}
              />
            </ListingContext.Provider>
          </div>
        </Container>
      </Box>
    </AnalyticsContext.Provider>
  );
}

export default ChplListingPage;

ChplListingPage.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
