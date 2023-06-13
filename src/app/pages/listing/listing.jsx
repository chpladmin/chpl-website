import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { number } from 'prop-types';

import { useFetchListing } from 'api/listing';
import ChplCqms from 'components/listing/details/cqms/cqms';
import ChplCriteria from 'components/listing/details/criteria/criteria';
import ChplSed from 'components/listing/details/sed/sed';
import ChplSubscribe from 'components/subscriptions/subscribe';
import {
  ChplLink,
  InternalScrollButton,
} from 'components/util';
import theme from 'themes/theme';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    overflowWrap: 'anywhere',
  },
  pageBody: {
    display: 'grid',
    gap: '32px',
    gridTemplateColumns: '1fr',
    padding: '32px',
    backgroundColor: '#f9f9f9',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'auto 1fr',
    },
  },
  pageNavigation: {
    position: 'sticky',
    top: 0,
    height: 'min-content',
    display: 'grid',
    gap: '8px',
    backgroundColor: '#f9f9f9',
    justifyItems: 'start',
    borderBottom: '1px solid #c2c6ca',
    paddingBottom: '16px',
    [theme.breakpoints.up('md')]: {
      top: '100px',
      borderRight: '1px solid #c2c6ca',
      borderBottom: 'none',
      paddingRight: '16px',
    },
  },
  pageHeader: {
    padding: '32px',
  },
});

function ChplListingPage({ id }) {
  const { data, isLoading, isSuccess } = useFetchListing({ id });
  const [listing, setListing] = useState(undefined);
  const [seeAllCqms, setSeeAllCqms] = useState(false);
  const [seeAllCriteria, setSeeAllCriteria] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setListing(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading || !isSuccess || !listing) {
    return <CircularProgress />;
  }

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography
          variant="h1"
        >
          { listing.product.name}
        </Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <div className={classes.pageNavigation}>
          <InternalScrollButton
            id="listingInformation"
            analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Listing Information' }}
          >
            Listing Information
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          <InternalScrollButton
            id="certificationCriteria"
            analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Certification Criteria' }}
          >
            Certification Criteria
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          <InternalScrollButton
            id="clinicalQualityMeasures"
            analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Clinical Quality Measures' }}
          >
            Clinical Quality Measures
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          { listing.certificationEdition.name !== '2011'
            && (
              <InternalScrollButton
                id="safetyEnhancedDesign"
                analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Safety Enhanced Design' }}
              >
                Safety Enhanced Design (SED)
                <ArrowForwardIcon className={classes.iconSpacing} />
              </InternalScrollButton>
            )}
          <InternalScrollButton
            id="g1g2Measures"
            analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'G1/G2 Measures' }}
          >
            G1/G2 Measures
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          <InternalScrollButton
            id="complianceActivities"
            analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Compliance Activities' }}
          >
            Compliance Activities
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          <InternalScrollButton
            id="additionalInformation"
            analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Additional Information' }}
          >
            Additional Information
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          <ChplSubscribe
            subscribedObjectId={listing.id}
            subscribedObjectTypeId={1}
          />
        </div>
        <div className={classes.content}>
          <span className="anchor-element">
            <span id="listingInformation" className="page-anchor" />
          </span>
          <Typography gutterBottom variant="h2">
            Listing Information
          </Typography>
          <Divider />

          <span className="anchor-element">
            <span id="certificationCriteria" className="page-anchor" />
          </span>
          <Card>
            <CardContent>
              Certification Criteria
              <FormControlLabel
                control={(
                  <Switch
                    id="see-all-criteria"
                    name="seeAllCriteria"
                    checked={seeAllCriteria}
                    onChange={() => setSeeAllCriteria(!seeAllCriteria)}
                  />
                )}
                label="See all Certification Criteria"
              />
              (
              { listing.certificationResults.filter((cr) => cr.success).length }
              {' '}
              found)
              <ChplCriteria
                certificationResults={listing.certificationResults}
                viewAll={seeAllCriteria}
              />
            </CardContent>
          </Card>
          <Divider />

          <span className="anchor-element">
            <span id="clinicalQualityMeasures" className="page-anchor" />
          </span>
          <Card>
            <CardContent>
              Clinical Quality Measures
              <FormControlLabel
                control={(
                  <Switch
                    id="see-all-cqms"
                    name="seeAllCqms"
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
              <ChplCqms
                cqms={listing.cqmResults}
                edition={listing.certificationEdition}
                viewAll={seeAllCqms}
              />
            </CardContent>
          </Card>
          <Divider />

          { listing.certificationEdition.name !== '2011'
            && (
              <>
                <span className="anchor-element">
                  <span id="safetyEnhancedDesign" className="page-anchor" />
                </span>
                <Card>
                  <CardContent>
                    Safety Enhanced Design (SED)
                    <ChplSed
                      listing={listing}
                    />
                  </CardContent>
                </Card>
                <Divider />
              </>
            )}
          <span className="anchor-element">
            <span id="g1g2Measures" className="page-anchor" />
          </span>
          <Typography gutterBottom variant="h2">
            G1/G2 Measures
          </Typography>
          <Divider />

          <span className="anchor-element">
            <span id="complianceActivities" className="page-anchor" />
          </span>
          <Typography gutterBottom variant="h2">
            Compliance Activities
          </Typography>
          <Divider />

          <span className="anchor-element">
            <span id="additionalInformation" className="page-anchor" />
          </span>
          <Typography gutterBottom variant="h2">
            Additional Information
          </Typography>
        </div>
      </div>
    </>
  );
}

export default ChplListingPage;

ChplListingPage.propTypes = {
  id: number.isRequired,
};
