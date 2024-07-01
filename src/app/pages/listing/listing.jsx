import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { number, oneOfType, string } from 'prop-types';

import ChplListingHistory from './history/listing-history';

import { useFetchListing } from 'api/listing';
import ChplActionButton from 'components/action-widget/action-button';
import ChplBrowserViewedWidget from 'components/browser/browser-viewed-widget';
import ChplListingView from 'components/listing/listing-view';
import { getAngularService } from 'services/angular-react-helper';
import { FlagContext, ListingContext, UserContext } from 'shared/contexts';
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
  pageHeader: {
    padding: '32px 0',
    backgroundColor: palette.white,
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
});

function ChplListingPage({ id }) {
  const $state = getAngularService('$state');
  const { data, isLoading, isSuccess } = useFetchListing({ id });
  const { isOn } = useContext(FlagContext);
  const { hasAnyRole, user } = useContext(UserContext);
  const [listing, setListing] = useState(undefined);
  const [uiUpgradeEdit, setUiUpgradeEdit] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setUiUpgradeEdit(isOn('ui-upgrade-edit'));
  }, [isOn]);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setListing(data);
  }, [data, isLoading, isSuccess]);

  const canEdit = () => {
    if (hasAnyRole(['chpl-admin', 'chpl-onc'])) { return true; }
    if (listing.edition !== null && listing.edition.name !== '2015') { return false; }
    if (hasAnyRole(['chpl-onc-acb']) && user.organizations.some((o) => o.id === listing.certifyingBody.id)) { return true; }
    return false;
  };

  const edit = () => {
    $state.go('listing.edit');
  };

  const editFlagged = () => {
    $state.go('listing.flag-edit');
  };

  if (isLoading || !isSuccess || !listing) {
    return <CircularProgress />;
  }

  const listingState = {
    listing,
    setListing,
  };

  return (
    <Box bgcolor={palette.background}>
      <ChplBrowserViewedWidget
        listing={listing}
      />
      <div className={classes.pageHeader}>
        <Container maxWidth="lg">
          <Box className={classes.listingHeaderBox}>
            <Box>
              <Typography
                variant="h1"
              >
                {listing.product.name}
              </Typography>
            </Box>
            <Box>
              <ChplActionButton
                listing={listing}
                horizontal
              >
                { canEdit() && !uiUpgradeEdit
                  && (
                    <Button
                      endIcon={<EditIcon />}
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={edit}
                    >
                      Edit
                    </Button>
                  )}
                { canEdit() && uiUpgradeEdit
                  && (
                    <Button
                      endIcon={<EditIcon />}
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={editFlagged}
                    >
                      Edit
                    </Button>
                  )}
                <ChplListingHistory
                  listing={listing}
                  canSeeHistory={canEdit()}
                />
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
            />
          </ListingContext.Provider>
        </div>
      </Container>
    </Box>
  );
}

export default ChplListingPage;

ChplListingPage.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
