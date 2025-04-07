import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { func, object } from 'prop-types';

import { usePostVersionSplit } from 'api/version';
import { ChplTooltip } from 'components/util';
import ChplVersion from 'components/version/version';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '375px',
    gridGap: '32px',
  },
  listItem: {
    fontSize: 'small',
    display: 'flex',
    justifyContent: 'space-between',
  },
  pageContainer: {
    padding: '32px 0px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gridGap: '32px',
    alignItems: 'stretch',
    minHeight: 'calc(100vh - 289px)',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'flex-start',
    },
  },
  productList: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  productName: {
    width: '64%',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '32px',
  },
});

function ChplVersionSplit({ dispatch, version }) {
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostVersionSplit();
  const [listings, setListings] = useState([]);
  const [movingListings, setMovingListings] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setListings(version.listings);
  }, [version]);

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        dispatch('cancel');
        break;
      case 'save':
        setIsProcessing(true);
        eventTrack({
          ...analytics,
          event: 'Split Version',
        });
        mutate({
          oldVersion: version,
          newVersion: payload,
          oldListings: listings,
          newListings: movingListings,
        }, {
          onSuccess: (response) => {
            setIsProcessing(false);
            let body;
            if (!response.status || response.status === 200 || angular.isObject(response.status)) {
              enqueueSnackbar(`Split submitted. Your action has been submitted and you'll get an email at ${response.data.job.jobDataMap.user.email} when it's done`, {
                variant: 'success',
              });
              dispatch('cancel');
            } else if (response.data.errorMessages) {
              body = response.data.errorMessages.join(', ');
            } else if (response.data.error) {
              body = response.data.error;
            } else {
              body = 'An unexpected error has occurred.';
            }
            if (body) {
              enqueueSnackbar(body, {
                variant: 'error',
              });
            }
          },
          onError: (error) => {
            setIsProcessing(false);
            let body;
            if (error.data?.errorMessages) {
              body = error.data.errorMessages.join(', ');
            } else if (error.response?.data?.errorMessages) {
              body = error.response.data.errorMessages.join(', ');
            } else if (error.data?.error) {
              body = error.data.error;
            } else if (error.response.data.error) {
              body = error.response.data.error;
            } else {
              body = 'An unexpected error has occurred.';
            }
            if (body) {
              enqueueSnackbar(body, {
                variant: 'error',
              });
            }
          },
        });
        break;
        // no default
    }
  };

  const moveListing = (listing, toNew) => {
    if (toNew) {
      setListings((prev) => prev.filter((p) => p.id !== listing.id));
      setMovingListings((prev) => [...prev, listing]);
    } else {
      setListings((prev) => [...prev, listing]);
      setMovingListings((prev) => prev.filter((p) => p.id !== listing.id));
    }
  };

  if (!version) { return <CircularProgress />; }

  return (
    <>
      <Container disableGutters maxWidth="xl">
        <Box className={classes.pageContainer}>
          <Box className={classes.columnContainer}>
            <ChplVersion
              version={version}
              isSplitting
            />
          </Box>
          <Box>
            <ChplVersion
              version={{}}
              dispatch={handleDispatch}
              isEditing
              isSplitting
              isInvalid={listings?.length === 0 || movingListings?.length === 0}
              isProcessing={isProcessing}
            />
          </Box>
          <Divider className={classes.fullWidthGridRow} />
          <Card>
            <CardHeader title="Listings staying with original version" />
            <CardContent>
              { listings?.length === 0 ? (
                <Typography variant="body1" color="textSecondary" align="left">
                  No listings selected. At least one listing must remain with the Version.
                </Typography>
              ) : (
                <List className={classes.productList}>
                  { listings?.map((item) => (
                    <ListItem divider className={classes.listItem} dense key={item.id}>
                      <Box className={classes.productName}>
                        {item.chplProductNumber}
                      </Box>
                      <ChplTooltip
                        placement="top"
                        title="Move listing to new version"
                      >
                        <Button
                          endIcon={<ArrowForward />}
                          size="small"
                          color="secondary"
                          variant="contained"
                          onClick={() => moveListing(item, true)}
                        >
                          Move
                        </Button>
                      </ChplTooltip>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Listings moving to new version" />
            <CardContent>
              { movingListings?.length === 0 ? (
                <Typography variant="body1" color="textSecondary" align="left">
                  No listings selected. At least one listing must be selected to move.
                </Typography>
              ) : (
                <List className={classes.listingList}>
                  { movingListings?.map((item) => (
                    <ListItem divider className={classes.listItem} dense key={item.id}>
                      <Box className={classes.listingName}>
                        {item.chplProductNumber}
                      </Box>
                      <ChplTooltip
                        placement="top"
                        title="Move listing to original version"
                      >
                        <Button
                          endIcon={<ArrowBack />}
                          size="small"
                          color="secondary"
                          variant="contained"
                          onClick={() => moveListing(item, false)}
                        >
                          Move
                        </Button>
                      </ChplTooltip>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default ChplVersionSplit;

ChplVersionSplit.propTypes = {
  dispatch: func.isRequired,
  version: object.isRequired,
};
