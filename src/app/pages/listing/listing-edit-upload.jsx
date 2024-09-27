import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Fade,
  FormControlLabel,
  List,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { number, oneOfType, string } from 'prop-types';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import ChplUploadListing from './components/upload-listing';

import { useFetchListing } from 'api/listing';
import { ChplActionBar } from 'components/action-bar';
import ChplAdditionalInformation from 'components/listing/details/additional-information/additional-information';
import ChplCqms from 'components/listing/details/cqms/cqms';
import ChplCriteria from 'components/listing/details/criteria/criteria';
import ChplG1G2 from 'components/listing/details/g1g2/g1g2';
import ChplListingInformation from 'components/listing/details/listing-information/listing-information';
import ChplSed from 'components/listing/details/sed/sed';
import { getAngularService } from 'services/angular-react-helper';
import { compareListing } from 'pages/listing/history/listings.service';
import { ListingContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '32px',
    padding: '32px 0',
    backgroundColor: palette.background,
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'start',
      width: '100vw',
    },
  },
  pageContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '32px',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  differenceContainer: {
    position: 'sticky',
    top: '100px',
    display: 'flex',
    gap: '32px',
    flexDirection: 'column',
    width: '30%',
  },
  differenceCallout: {
    background: palette.secondary,
    border: `.5px solid ${palette.primary}`,
    borderRadius: '8px',
    padding: '16px 8px',
    overflowY: 'auto',
    maxHeight: '65vh',
    overflowWrap: 'break-word',
    '&::-webkit-scrollbar': {
      width: '2px', // Width of the scrollbar
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1', // Background of the scrollbar track
      borderRadius: '8px', // Optional: matching border radius
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main, // Color of the scrollbar thumb
      borderRadius: '8px', // Optional: matching border radius
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.primary.dark, // Color on hover
    },
  },
  headerContainer: {
    position: 'sticky',
    top: '100px',
    display: 'flex',
    gap: '32px',
    flexDirection: 'column',
    width: '100%',
    border: `.5px solid ${palette.divider}`,
    borderRadius: '8px',
    zIndex: '800',
    padding: '16px',
    backgroundColor: palette.white,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
  },
  pageHeader: {
    padding: '32px 0',
    backgroundColor: palette.white,
  },
  placeholderContainer: {
    background: palette.white,
    border: `.5px solid ${palette.divider}`,
    borderRadius: '8px',
    padding: '16px 8px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gridGap: '8px',
    width: '100%',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    padding: '16px',
    backgroundColor: palette.secondary,
    borderBottom: `.5px solid ${palette.divider}`,
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  sectionHeaderText: {
    fontWeight: '600 !important',
    fontSize: '1.1em !important',
  },
});

function ChplListingEditUploadPage({ id }) {
  const $state = getAngularService('$state');
  const [diff, setDiff] = useState([]);
  const [errors, setErrors] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [listing, setListing] = useState(undefined);
  const [newListing, setNewListing] = useState(undefined);
  const [seeAllCqms, setSeeAllCqms] = useState(false);
  const [seeAllCriteria, setSeeAllCriteria] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const { data, isLoading, isSuccess } = useFetchListing({ id, fetched });
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setFetched(true);
    setListing(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (!newListing) { return; }
    setDiff(compareListing(listing, newListing));
  }, [listing, newListing]);

  useEffect(() => {
    if (!newListing) { return; }
    setErrors((prev) => [
      ...prev,
      ...newListing.businessErrorMessages,
      ...newListing.dataErrorMessages,
    ]);
    setWarnings(newListing.warningMessages);
  }, [newListing]);

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        $state.go('^');
        break;
      case 'save':
        setIsProcessing(true);
        break;
      default:
        console.log({ action });
        break;
    }
  };

  const toggleSeeAllCriteria = () => {
    setSeeAllCriteria(!seeAllCriteria);
  };

  const toggleSeeAllCqms = () => {
    setSeeAllCqms(!seeAllCqms);
  };

  const listingState = {
    listing,
  };

  const newListingState = {
    listing: newListing,
    setListing: setNewListing,
  };

  if (isLoading || !isSuccess || !listing) {
    return <CircularProgress />;
  }

  return (
    <Box bgcolor={palette.background}>
      <div className={classes.pageHeader}>
        <Container maxWidth="xl">
          <Typography
            variant="h1"
          >
            Edit
            {' '}
            {listing.product.name}
          </Typography>
        </Container>
      </div>
      <Container maxWidth="xl" id="main-content" tabIndex="-1">
        <div style={{ paddingTop: '32px' }}>
          <ListingContext.Provider value={newListingState}>
            <ChplUploadListing
              id={listing.id}
              setErrors={setErrors}
              setWarnings={setWarnings}
            />
          </ListingContext.Provider>
        </div>
        <div className={classes.pageContainer}>
          <div className={classes.container}>
            <div className={classes.headerContainer}>
              <Typography
                gutterBottom
                component="h3"
                style={{ fontWeight: '600' }}
                variant="h4"
              >
                Current Listing
              </Typography>
            </div>
            <div className={classes.headerContainer}>
              <Typography
                gutterBottom
                component="h3"
                style={{ fontWeight: '600' }}
                variant="h4"
              >
                Updated Listing
              </Typography>
            </div>
            <ListingContext.Provider value={listingState}>
              <Card>
                <Box className={classes.sectionHeader}>
                  <Typography className={classes.sectionHeaderText} variant="h2">Listing Information</Typography>
                </Box>
                <CardContent>
                  <ChplListingInformation
                    listing={listing}
                  />
                </CardContent>
              </Card>
            </ListingContext.Provider>
            { !newListing ? (
              <Box className={classes.placeholderContainer}>
                <HelpOutlineIcon fontSize="large" color="primary" />
                <Typography>Upload a file above to display your new listing.</Typography>
              </Box>
            ) : (
              <ListingContext.Provider value={newListingState}>
                <Card>
                  <Box className={classes.sectionHeader}>
                    <Typography className={classes.sectionHeaderText} variant="h2">Listing Information</Typography>
                  </Box>
                  <CardContent>
                    <ChplListingInformation
                      listing={newListing}
                    />
                  </CardContent>
                </Card>
              </ListingContext.Provider>
            )}
            <ListingContext.Provider value={listingState}>
              <Card>
                <Box className={classes.sectionHeader}>
                  <Typography className={classes.sectionHeaderText} variant="h2">Certification Criteria</Typography>
                  <div>
                    <FormControlLabel
                      control={(
                        <Switch
                          id="see-all-criteria"
                          name="seeAllCriteria"
                          checked={seeAllCriteria}
                          color="primary"
                          onChange={toggleSeeAllCriteria}
                        />
                      )}
                      label="See all Certification Criteria"
                    />
                    (
                    {listing.certificationResults.filter((cr) => cr.success).length}
                    {' '}
                    found)
                  </div>
                </Box>
                <CardContent>
                  <ChplCriteria
                    listing={listing}
                    viewAll={seeAllCriteria}
                  />
                </CardContent>
              </Card>
            </ListingContext.Provider>
            <div>
              { newListing
                && (
                  <ListingContext.Provider value={newListingState}>
                    <Card>
                      <Box className={classes.sectionHeader}>
                        <Typography className={classes.sectionHeaderText} variant="h2">Certification Criteria</Typography>
                        <div>
                          <FormControlLabel
                            control={(
                              <Switch
                                id="see-all-criteria"
                                name="seeAllCriteria"
                                checked={seeAllCriteria}
                                color="primary"
                                onChange={toggleSeeAllCriteria}
                              />
                            )}
                            label="See all Certification Criteria"
                          />
                          (
                          {newListing.certificationResults.filter((cr) => cr.success).length}
                          {' '}
                          found)
                        </div>
                      </Box>
                      <CardContent>
                        <ChplCriteria
                          listing={newListing}
                          viewAll={seeAllCriteria}
                        />
                      </CardContent>
                    </Card>
                  </ListingContext.Provider>
                )}
            </div>
            <ListingContext.Provider value={listingState}>
              <Card>
                <Box className={classes.sectionHeader}>
                  <Typography className={classes.sectionHeaderText} variant="h2">Clinical Quality Measures</Typography>
                  <div>
                    <FormControlLabel
                      control={(
                        <Switch
                          id="see-all-cqms"
                          name="seeAllCqms"
                          color="primary"
                          checked={seeAllCqms}
                          onChange={toggleSeeAllCqms}
                        />
                      )}
                      label="See all CQMs"
                    />
                    (
                    {listing.cqmResults.filter((cqm) => cqm.success).length}
                    {' '}
                    found)
                  </div>
                </Box>
                <CardContent>
                  <ChplCqms
                    cqms={listing.cqmResults}
                    edition={listing.edition}
                    viewAll={seeAllCqms}
                  />
                </CardContent>
              </Card>
            </ListingContext.Provider>
            <div>
              { newListing
                && (
                  <ListingContext.Provider value={newListingState}>
                    <Card>
                      <Box className={classes.sectionHeader}>
                        <Typography className={classes.sectionHeaderText} variant="h2">Clinical Quality Measures</Typography>
                        <div>
                          <FormControlLabel
                            control={(
                              <Switch
                                id="see-all-cqms"
                                name="seeAllCqms"
                                color="primary"
                                checked={seeAllCqms}
                                onChange={toggleSeeAllCqms}
                              />
                            )}
                            label="See all CQMs"
                          />
                          (
                          {newListing.cqmResults.filter((cqm) => cqm.success).length}
                          {' '}
                          found)
                        </div>
                      </Box>
                      <CardContent>
                        <ChplCqms
                          cqms={newListing.cqmResults}
                          edition={newListing.edition}
                          viewAll={seeAllCqms}
                        />
                      </CardContent>
                    </Card>
                  </ListingContext.Provider>
                )}
            </div>
            <ListingContext.Provider value={listingState}>
              <Card>
                <Box className={classes.sectionHeader}>
                  <Typography className={classes.sectionHeaderText} variant="h2">Safety Enhanced Design (SED)</Typography>
                </Box>
                <CardContent>
                  <ChplSed
                    listing={listing}
                  />
                </CardContent>
              </Card>
            </ListingContext.Provider>
            <div>
              { newListing
                && (
                  <ListingContext.Provider value={newListingState}>
                    <Card>
                      <Box className={classes.sectionHeader}>
                        <Typography className={classes.sectionHeaderText} variant="h2">Safety Enhanced Design (SED)</Typography>
                      </Box>
                      <CardContent>
                        <ChplSed
                          listing={newListing}
                        />
                      </CardContent>
                    </Card>
                  </ListingContext.Provider>
                )}
            </div>
            <ListingContext.Provider value={listingState}>
              <Card>
                <Box className={classes.sectionHeader}>
                  <Typography className={classes.sectionHeaderText} variant="h2">G1/G2 Measures</Typography>
                </Box>
                <CardContent>
                  <ChplG1G2
                    measures={listing.measures}
                  />
                </CardContent>
              </Card>
            </ListingContext.Provider>
            <div>
              { newListing
                && (
                  <ListingContext.Provider value={newListingState}>
                    <Card>
                      <Box className={classes.sectionHeader}>
                        <Typography className={classes.sectionHeaderText} variant="h2">G1/G2 Measures</Typography>
                      </Box>
                      <CardContent>
                        <ChplG1G2
                          measures={newListing.measures}
                        />
                      </CardContent>
                    </Card>
                  </ListingContext.Provider>
                )}
            </div>
            <ListingContext.Provider value={listingState}>
              <Card>
                <Box className={classes.sectionHeader}>
                  <Typography className={classes.sectionHeaderText} variant="h2">Additional Information</Typography>
                </Box>
                <CardContent>
                  <ChplAdditionalInformation
                    listing={listing}
                  />
                </CardContent>
              </Card>
            </ListingContext.Provider>
            <div>
              { newListing
                && (
                  <ListingContext.Provider value={newListingState}>
                    <Card>
                      <Box className={classes.sectionHeader}>
                        <Typography className={classes.sectionHeaderText} variant="h2">Additional Information</Typography>
                      </Box>
                      <CardContent>
                        <ChplAdditionalInformation
                          listing={newListing}
                        />
                      </CardContent>
                    </Card>
                  </ListingContext.Provider>
                )}
            </div>
          </div>
          <Box className={classes.differenceContainer}>
            <Box className={classes.headerContainer}>
              <Typography gutterBottom component="h3" style={{ fontWeight: '600' }} variant="h4">Difference(s)</Typography>
            </Box>
            { diff.length === 0 ? (
              <Box className={classes.placeholderContainer}>
                <Typography>Waiting for upload to show results...</Typography>
              </Box>
            ) : (
              <Fade style={{ transitionDelay: newListing ? '1.5s' : '0ms' }} in={!!diff.length > 0}>
                <Box className={classes.differenceCallout}>
                  <List className="list-unstyled">
                    {diff.map((change) => (
                      <li key={change} dangerouslySetInnerHTML={{ __html: change }} />
                    ))}
                  </List>
                </Box>
              </Fade>
            )}
          </Box>
        </div>
      </Container>
      <ChplActionBar
        dispatch={handleDispatch}
        errors={errors}
        warnings={warnings}
        isDisabled
        isProcessing={isProcessing}
      />
    </Box>
  );
}

export default ChplListingEditUploadPage;

ChplListingEditUploadPage.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
