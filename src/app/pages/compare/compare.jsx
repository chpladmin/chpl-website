import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { arrayOf, number, oneOfType, string } from 'prop-types';

import { useFetchListing } from 'api/listing';
import ChplActionButton from 'components/action-widget/action-button';
import ChplBrowserComparedWidget from 'components/browser/browser-compared-widget';
import { ChplLink } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat } from 'services/date-util';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplComparePage({ ids }) {
  const $state = getAngularService('$state');
  const [activeListing, setActiveListing] = useState(undefined)
  const [listings, setListings] = useState([]);
  const [listingsToProcess, setListingsToProcess] = useState([]);
  const { data, isLoading, isSuccess } = useFetchListing({ id: activeListing });
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    if (data?.id) {
      setListings((previous) => [...previous, data].sort((a, b) => a.certificationDate < b.certificationDate ? -1 : 1));
      setListingsToProcess((previous) => previous.filter((id) => id !== activeListing));
      setActiveListing(undefined);
    };
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    setListingsToProcess(ids);
  }, [ids]);

  useEffect(() => {
    setActiveListing(listingsToProcess[0]);
  }, [listingsToProcess]);

  const makeRow = (title, data) => (
    <TableRow>
      <TableCell>{ title }</TableCell>
      { listings.map((listing) => (
        <TableCell key={listing.id}>
          { data(listing) }
        </TableCell>
      ))}
    </TableRow>
  );

  if (listings.length === 0) {
    return <CircularProgress />;
  }

  return (
    <Box bgcolor={palette.background}>
      <div className={classes.pageHeader}>
        <Container maxWidth="lg">
          <Box className={classes.listingHeaderBox}>
            <Box>
              <Typography
                variant="h1"
              >
                Compare Listings
              </Typography>
            </Box>
          </Box>
        </Container>
      </div>
      <Container maxWidth="lg">
        <div className={classes.container} id="main-content" tabIndex="-1">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data item</TableCell>
                { listings.map((listing) => (
                  <TableCell key={listing.id}>
                    { listing.product.name }
                    <ChplBrowserComparedWidget
                      listing={listing}
                    />
                    <Box>
                      <ChplActionButton
                        listing={listing}
                        horizontal={false}
                      >
                      </ChplActionButton>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              { makeRow('Developer', (listing) => listing.developer.name) }
              { makeRow('Version', (listing) => listing.version.version) }
              { makeRow('Certification Edition', (listing) => {
                if (!listing.edition) { return ''; }
                return `${listing.edition.name}${listing.curesUpdate ? ' Cures Update' : ''}`;
              }) }
              { makeRow('Certification Status', (listing) => listing.currentStatus.status.name) }
              { makeRow('Practice Type', (listing) => listing.practiceType.name ? listing.practiceType.name : 'N/A') }
              { makeRow('Certifying Body', (listing) => listing.certifyingBody.name) }
              { makeRow('Certification Date', (listing) => getDisplayDateFormat(listing.certificationDay)) }
              { makeRow('Inactive/Decertified Date', (listing) => getDisplayDateFormat(listing.decertificationDate)) }
              { makeRow('CHPL Product Number', (listing) => listing.chplProductNumber) }
              { makeRow('Number of Open Non-Conformities', (listing) => listing.countOpenNonconformities) }
              { makeRow('Certification Criteria', (listing) => `${listing.countCerts} met`) }
              { makeRow('Clinical Quality Measures', (listing) => `${listing.countCqms} met`) }
              { makeRow('View listing details', (listing) => (
                <ChplLink
                  href={`#/listing/${listing.id}`}
                  text="details"
                  analytics={{ event: 'Go to Listing Details page', category: 'Compare Page', label: listing.chplProductNumber }}
                  external={false}
                  router={{ sref: 'listing', options: { id: listing.id } }}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </Container>
    </Box>
  );
}

export default ChplComparePage;

ChplComparePage.propTypes = {
  ids: arrayOf(oneOfType([number, string])).isRequired,
};
