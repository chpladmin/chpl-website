import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';
import NotesOutlinedIcon from '@material-ui/icons/NotesOutlined';
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined';
import TouchAppOutlinedIcon from '@material-ui/icons/TouchAppOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { bool } from 'prop-types';

import ChplAdditionalInformation from 'components/listing/details/additional-information/additional-information';
import ChplCompliance from 'components/listing/details/compliance/compliance';
import ChplCqms from 'components/listing/details/cqms/cqms';
import ChplCriteria from 'components/listing/details/criteria/criteria';
import ChplG1G2 from 'components/listing/details/g1g2/g1g2';
import ChplListingInformation from 'components/listing/details/listing-information/listing-information';
import ChplSed from 'components/listing/details/sed/sed';
import ChplSubscribe from 'components/subscriptions/subscribe';
import { ChplLink, InternalScrollButton } from 'components/util';
import { isListingActive } from 'services/listing.service';
import { UserContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  navigation: {
    backgroundColor: palette.white,
    display: 'flex',
    flexDirection: 'row',
    position: 'sticky',
    top: '0',
    zIndex: '1299',
    gap: '16px',
    borderRadius: '4px',
    overflowX: 'scroll',
    boxShadow: 'rgb(149 157 165 / 50%) 0px 4px 16px',
    border: `.5px solid ${palette.divider}`,
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      overflowX: 'hidden',
      position: 'initial',
      flexDirection: 'column',
      zIndex: '0',
    },
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'visible',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  menuItems: {
    display: 'flex',
    padding: 0,
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: palette.black,
      backgroundColor: palette.background,
      fontWeight: 600,
    },
  },
  content: {
    display: 'grid',
    flexDirection: 'column',
    gridTemplateColumns: '1fr',
    gridGap: '16px',
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
    fontSize: '1.5em !important',
    fontWeight: '600 !important',
  },
  leftSideContent: {
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: '0',
    gap: '16px',
    zIndex: 300,
    [theme.breakpoints.up('md')]: {
      top: '104px',
    },
  },
  subscribe: {
    boxShadow: 'rgb(149 157 165 / 50%) 0px 4px 16px',
    borderRadius: '8px',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'inherit',
    },
  },
});

function ChplListingView({ isConfirming, listing: initialListing }) {
  const { hasAnyRole, user } = useContext(UserContext);
  const [canSeeAllCriteria, setCanSeeAllCriteria] = useState(false);
  const [listing, setListing] = useState(undefined);
  const [seeAllCqms, setSeeAllCqms] = useState(false);
  const [seeAllCriteria, setSeeAllCriteria] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (!initialListing) { return; }
    setCanSeeAllCriteria(isListingActive(initialListing));
    setListing(initialListing);
  }, [initialListing]);

  const canManageSurveillance = () => {
    if (hasAnyRole(['chpl-admin'])) { return true; }
    if (listing.edition !== null && listing.edition.name !== '2015') { return false; }
    if (hasAnyRole(['chpl-onc-acb']) && user.organizations.some((o) => o.id === listing.certifyingBody.id)) { return true; }
    return false;
  };

  if (!listing) { return null; }

  return (
    <>
      { !isConfirming
        && (
          <div className={classes.leftSideContent}>
            <div className={classes.navigation}>
              <Box className={classes.menuContainer}>
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="listingInformation"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Listing Information' }}
                  >
                    Listing Information
                    <NotesOutlinedIcon className={classes.iconSpacing} />
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
                    <BookOutlinedIcon className={classes.iconSpacing} />
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
                    <DoneAllOutlinedIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
                { (listing.edition === null || listing.edition.name !== '2011')
                 && (
                   <Box
                     className={classes.menuItems}
                   >
                     <InternalScrollButton
                       id="sed"
                       analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Safety Enhanced Design' }}
                     >
                       Safety Enhanced Design (SED)
                       <TouchAppOutlinedIcon className={classes.iconSpacing} />
                     </InternalScrollButton>
                   </Box>
                 )}
                { (listing.edition === null || listing.edition.name === '2015')
                  && (
                    <Box
                      className={classes.menuItems}
                    >
                      <InternalScrollButton
                        id="g1g2Measures"
                        analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'G1/G2 Measures' }}
                      >
                        G1/G2 Measures
                        <AssessmentOutlinedIcon className={classes.iconSpacing} />
                      </InternalScrollButton>
                    </Box>
                  )}
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="compliance"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Compliance Activities' }}
                  >
                    Compliance Activities
                    <SecurityOutlinedIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
                <Box
                  className={classes.menuItems}
                >
                  <InternalScrollButton
                    id="additional"
                    analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Additional Information' }}
                  >
                    Additional Information
                    <InfoOutlinedIcon className={classes.iconSpacing} />
                  </InternalScrollButton>
                </Box>
              </Box>
            </div>
            <Box className={classes.subscribe}>
              <ChplSubscribe
                subscribedObjectId={listing.id}
                subscribedObjectTypeId={1}
              />
            </Box>
          </div>
        )}
      <div className={classes.content}>
        <Card>
          <span className="anchor-element">
            <span id="listingInformation" className="page-anchor" />
          </span>
          <Box className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderText} variant="h2">Listing Information</Typography>
          </Box>
          <CardContent>
            <ChplListingInformation
              listing={listing}
            />
          </CardContent>
        </Card>
        <Card>
          <span className="anchor-element">
            <span id="certificationCriteria" className="page-anchor" />
          </span>
          <Box className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderText} variant="h2">Certification Criteria</Typography>
            <div>
              { canSeeAllCriteria
                && (
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
                )}
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
              isConfirming={isConfirming}
            />
          </CardContent>
        </Card>
        <Card>
          <span className="anchor-element">
            <span id="clinicalQualityMeasures" className="page-anchor" />
          </span>
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
                    onChange={() => setSeeAllCqms(!seeAllCqms)}
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
        {(listing.edition === null || listing.edition.name !== '2011')
         && (
           <Card>
             <span className="anchor-element">
               <span id="sed" className="page-anchor" />
             </span>
             <Box className={classes.sectionHeader}>
               <Typography className={classes.sectionHeaderText} variant="h2">Safety Enhanced Design (SED)</Typography>
             </Box>
             <CardContent>
               <ChplSed
                 listing={listing}
               />
             </CardContent>
           </Card>
         )}
        { (listing.edition === null || listing.edition.name === '2015')
          && (
            <Card>
              <span className="anchor-element">
                <span id="g1g2Measures" className="page-anchor" />
              </span>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">G1/G2 Measures</Typography>
              </Box>
              <CardContent>
                <ChplG1G2
                  measures={listing.measures}
                />
              </CardContent>
            </Card>
          )}
        { !isConfirming
          && (
            <Card>
              <span className="anchor-element">
                <span id="compliance" className="page-anchor" />
              </span>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">Compliance Activities</Typography>
              </Box>
              <CardContent>
                <ChplCompliance
                  directReviews={listing.directReviews}
                  directReviewsAvailable={listing.directReviewsAvailable}
                  surveillance={listing.surveillance}
                />
                { canManageSurveillance()
                  && (
                    <ChplLink
                      href="#/surveillance/manage"
                      text="Manage Surveillance Activity"
                      external={false}
                      router={{ sref: 'surveillance.manage', options: { listingId: listing.id, chplProductNumber: listing.chplProductNumber } }}
                    />
                  )}
              </CardContent>
            </Card>
          )}
        <Card>
          <span className="anchor-element">
            <span id="additional" className="page-anchor" />
          </span>
          <Box className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderText} variant="h2">Additional Information</Typography>
          </Box>
          <CardContent>
            <ChplAdditionalInformation
              listing={listing}
              isConfirming={isConfirming}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ChplListingView;

ChplListingView.propTypes = {
  isConfirming: bool,
  listing: listingPropType.isRequired,
};

ChplListingView.defaultProps = {
  isConfirming: false,
};
