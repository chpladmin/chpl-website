import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import EditIcon from '@material-ui/icons/Edit';
import { number } from 'prop-types';

import ChplListingHistory from './history';

import { useFetchListing } from 'api/listing';
import ChplActionButton from 'components/action-widget/action-button';
import ChplBrowserViewedWidget from 'components/browser/browser-viewed-widget';
import ChplAdditionalInformation from 'components/listing/details/additional-information/additional-information';
import ChplCompliance from 'components/listing/details/compliance/compliance';
import ChplCqms from 'components/listing/details/cqms/cqms';
import ChplCriteria from 'components/listing/details/criteria/criteria';
import ChplG1G2 from 'components/listing/details/g1g2/g1g2';
import ChplListingInformation from 'components/listing/details/listing-information/listing-information';
import ChplSed from 'components/listing/details/sed/sed';
import ChplSubscribe from 'components/subscriptions/subscribe';
import { ChplLink, InternalScrollButton } from 'components/util';
import { UserContext, FlagContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    padding: '16px 0',
    backgroundColor: '#f9f9f9',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: '100px',
    gap: '16px',
  },
  menuItems: {
    padding: '8px',
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: '#000',
      backgroundColor: '#f9f9f9',
      fontWeight: 600,
    },
  },
  content: {
    display: 'grid',
    flexDirection: 'column',
    gridTemplateColumns: '1fr',
    gridGap: '16px',
  },
  pageHeader: {
    padding: '32px',
    backgroundColor: '#FFF',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '16px',
    alignItems: 'center',
    backgroundColor: '#f5f9fd',
    borderBottom: '.5px solid #c2c6ca',
  },
});

function ChplListingPage({ id }) {
  const { data, isLoading, isSuccess } = useFetchListing({ id });
  const { hasAnyRole } = useContext(UserContext);
  const { isOn } = useContext(FlagContext);
  const [listing, setListing] = useState(undefined);
  const [seeAllCqms, setSeeAllCqms] = useState(false);
  const [seeAllCriteria, setSeeAllCriteria] = useState(false);
  const [subscriptionsIsOn, setSubscriptionsIsOn] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setListing(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    setSubscriptionsIsOn(isOn('subscriptions'));
  }, [isOn]);

  if (isLoading || !isSuccess || !listing) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box bgcolor="#f9f9f9">
        <ChplBrowserViewedWidget
          listing={listing}
        />
        <div className={classes.pageHeader}>
          <Container maxWidth="lg">
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
              <Typography
                variant="h1"
              >
                { listing.product.name}
              </Typography>

              <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" gridGap="16px">

                { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) && listing.certificationEdition.name !== '2015'
              && (
                <ChplLink
                  href={`#/listing/${listing.id}/view/edit`}
                  text="Edit Listing"
                  external={false}
                  router={{ sref: 'listing.view.edit', options: { id: listing.id } }}
                />
              )}
                { hasAnyRole(['ROLE_ADMIN', 'ROLE_ACB'])
              && (
                <ChplLink
                  href="#/surveillance/manage"
                  text="Manage Surveillance Activity"
                  external={false}
                  router={{ sref: 'surveillance.manage', options: { listingId: listing.id, chplProductNumber: listing.chplProductNumber } }}
                />
              )}
                <ChplActionButton
                  listing={listing}
                />
                { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']) && listing.certificationEdition.name === '2015'
              && (
                <Button
                  endIcon={<EditIcon />}
                  size="small"
                  variant="contained"
                  color="primary"
                  href={`#/listing/${listing.id}/view/edit`}
                  external={false}
                  router={{ sref: 'listing.view.edit', options: { id: listing.id } }}
                >
                  Edit
                </Button>
              )}
              </Box>
            </Box>
          </Container>
        </div>
        <Container maxWidth="lg">
          <div className={classes.container} id="main-content" tabIndex="-1">
            <div className={classes.navigation}>
              <Card>
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="listingInformation"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Listing Information' }}
                  >
                    Listing Information
                    <ArrowForwardIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="certificationCriteria"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Certification Criteria' }}
                  >
                    Certification Criteria
                    <ArrowForwardIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="clinicalQualityMeasures"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Clinical Quality Measures' }}
                  >
                    Clinical Quality Measures
                    <ArrowForwardIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
                { listing.certificationEdition.name !== '2011'
              && (
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="safetyEnhancedDesign"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Safety Enhanced Design' }}
                  >
                    Safety Enhanced Design (SED)
                    <ArrowForwardIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
              )}
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="g1g2Measures"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'G1/G2 Measures' }}
                  >
                    G1/G2 Measures
                    <ArrowForwardIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="complianceActivities"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Compliance Activities' }}
                  >
                    Compliance Activities
                    <ArrowForwardIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="additionalInformation"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Additional Information' }}
                  >
                    Additional Information
                    <ArrowForwardIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
              </Card>
              <Box>
                { subscriptionsIsOn
              && (
                <ChplSubscribe
                  subscribedObjectId={listing.id}
                  subscribedObjectTypeId={1}
                />
              )}
              </Box>
            </div>
            <div className={classes.content}>
              <Card>
                <span className="anchor-element">
                  <span id="listingInformation" className="page-anchor" />
                </span>
                <Box className={classes.sectionHeader}>
                  <Typography variant="h2">Listing Information</Typography>
                </Box>
                <CardContent>
                  <ChplListingInformation
                    listing={listing}
                  />
                </CardContent>
                <CardActions>
                  <ChplListingHistory
                    listing={listing}
                    canSeeHistory={hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])}
                  />
                </CardActions>
              </Card>
              <Card>
                <span className="anchor-element">
                  <span id="certificationCriteria" className="page-anchor" />
                </span>
                <Box className={classes.sectionHeader}>
                  <Typography variant="h2">Certification Criteria</Typography>
                  <div>
                    <FormControlLabel
                      control={(
                        <Switch
                          id="see-all-criteria"
                          name="seeAllCriteria"
                          checked={seeAllCriteria}
                          color="primary"
                          onChange={() => setSeeAllCriteria(!seeAllCriteria)}
                        />
                )}
                      label="See all Certification Criteria"
                    />
                    (
                    { listing.certificationResults.filter((cr) => cr.success).length }
                    {' '}
                    found)
                  </div>
                </Box>
                <CardContent>
                  <ChplCriteria
                    certificationResults={listing.certificationResults}
                    viewAll={seeAllCriteria}
                  />
                </CardContent>
              </Card>
              <Card>
                <span className="anchor-element">
                  <span id="clinicalQualityMeasures" className="page-anchor" />
                </span>
                <Box className={classes.sectionHeader}>
                  <Typography variant="h2">Clinical Quality Measures</Typography>
                  <div>
                    <FormControlLabel
                      control={(
                        <Switch
                          id="see-all-cqms"
                          name="seeAllCqms"
                          color="primary"
                          checked={seeAllCqms}
                          onChange={() => setSeeAllCqms(!seeAllCqms)}
                        />
                )}
                      label="See all CQMs"
                    />
                    (
                    { listing.cqmResults.filter((cqm) => cqm.success).length }
                    {' '}
                    found)
                  </div>
                </Box>
                <CardContent>
                  <ChplCqms
                    cqms={listing.cqmResults}
                    edition={listing.certificationEdition}
                    viewAll={seeAllCqms}
                  />
                </CardContent>
              </Card>

              { listing.certificationEdition.name !== '2011'
            && (
              <Card>
                <span className="anchor-element">
                  <span id="safetyEnhancedDesign" className="page-anchor" />
                </span>
                <Box className={classes.sectionHeader}>
                  <Typography variant="h2">Safety Enhanced Design (SED)</Typography>
                </Box>
                <CardContent>
                  <ChplSed
                    listing={listing}
                  />
                </CardContent>
              </Card>
            )}
              <Card>
                <span className="anchor-element">
                  <span id="g1g2Measures" className="page-anchor" />
                </span>
                <Box className={classes.sectionHeader}>
                  <Typography variant="h2">
                    G1/G2 Measures
                  </Typography>
                </Box>
                <CardContent>
                  <ChplG1G2
                    measures={listing.measures}
                  />
                </CardContent>
              </Card>
              <Card>
                <span className="anchor-element">
                  <span id="complianceActivities" className="page-anchor" />
                </span>
                <Box className={classes.sectionHeader}>
                  <Typography variant="h2">
                    Compliance Activities
                  </Typography>
                </Box>
                <CardContent>

                  <ChplCompliance
                    directReviews={listing.directReviews}
                    directReviewsAvailable={listing.directReviewsAvailable}
                    surveillance={listing.surveillance}
                  />
                </CardContent>
              </Card>
              <Card>
                <span className="anchor-element">
                  <span id="additionalInformation" className="page-anchor" />
                </span>
                <Box className={classes.sectionHeader}>
                  <Typography variant="h2">
                    Additional Information
                  </Typography>
                </Box>
                <CardContent>

                  <ChplAdditionalInformation
                    listing={listing}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Box>
    </>
  );
}

export default ChplListingPage;

ChplListingPage.propTypes = {
  id: number.isRequired,
};
