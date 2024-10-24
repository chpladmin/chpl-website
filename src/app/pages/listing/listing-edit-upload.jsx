import React, { useContext, useEffect, useState } from 'react';
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
import { arrayOf, bool, func, string } from 'prop-types';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import ChplUploadListing from './components/upload-listing';

import { ChplActionBar } from 'components/action-bar';
import ChplAdditionalInformation from 'components/listing/details/additional-information/additional-information';
import ChplCqms from 'components/listing/details/cqms/cqms';
import ChplCriteria from 'components/listing/details/criteria/criteria';
import ChplG1G2 from 'components/listing/details/g1g2/g1g2';
import ChplListingInformation from 'components/listing/details/listing-information/listing-information';
import ChplSed from 'components/listing/details/sed/sed';
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

function ChplListingEditUpload({
  dispatch,
  errors: initialErrors,
  warnings: initialWarnings,
  isProcessing,
 }) {
  const { listing } = useContext(ListingContext);
  const [diff, setDiff] = useState([]);
  const [errors, setErrors] = useState([]);
  const [newListing, setNewListing] = useState(undefined);
  const [seeAllCqms, setSeeAllCqms] = useState(false);
  const [seeAllCriteria, setSeeAllCriteria] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState(false);
  const [acknowledgeBusinessErrors, setAcknowledgeBusinessErrors] = useState(false);
  const classes = useStyles();

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
      case 'toggleErrorAcknowledgement':
        setAcknowledgeBusinessErrors((prev) => !prev);
        break;
      case 'toggleWarningAcknowledgement':
        setAcknowledgeWarnings((prev) => !prev);
        break;
      case 'cancel':
        dispatch({ action: 'cancel' });
        break;
      case 'save':
        dispatch({
          action: 'save',
          payload: {
            listing: newListing,
            acknowledgeWarnings,
            acknowledgeBusinessErrors,
          },
        });
        break;
        // no default
    }
  };

  const toggleSeeAllCriteria = () => {
    setSeeAllCriteria(!seeAllCriteria);
  };

  const toggleSeeAllCqms = () => {
    setSeeAllCqms(!seeAllCqms);
  };

  const newListingState = {
    listing: newListing,
    setListing: setNewListing,
  };

  if (!listing) {
    return <CircularProgress />;
  }

  return (
    <Box bgcolor={palette.background}>
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
            <Card>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">Additional Information</Typography>
              </Box>
              <CardContent>
                <ChplAdditionalInformation
                  listing={listing}
                  isConfirming
                />
              </CardContent>
            </Card>
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
                          isConfirming
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
            { diff.length === 0 && !newListing
              && (
                <Box className={classes.placeholderContainer}>
                  <Typography>Waiting for upload to show results...</Typography>
                </Box>
              )}
            { diff.length === 0 && newListing
              && (
                <Box className={classes.placeholderContainer}>
                  <Typography>No differences found</Typography>
                </Box>
              )}
            { diff.length > 0
              && (
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
        isProcessing={isProcessing}
        showErrorAcknowledgement={errors.length > 0}
        showWarningAcknowledgement={warnings.length > 0}
      />
    </Box>
  );
}

export default ChplListingEditUpload;

ChplListingEditUpload.propTypes = {
  dispatch: func.isRequired,
  errors: arrayOf(string),
  warnings: arrayOf(string),
  isProcessing: bool,
};

ChplListingEditUpload.defaultProps = {
  errors: [],
  warnings: [],
  isProcessing: false,
};
