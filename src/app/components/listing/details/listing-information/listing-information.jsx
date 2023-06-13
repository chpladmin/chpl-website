import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';

import { ChplLink } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { listing as listingType } from 'shared/prop-types/listing';

function ChplListingInformation(props) {
  const { listing } = props;

  return (
    <>
      <Box gridGap={8} display="flex" flexDirection="column">
        <Card>
          <CardHeader title="Listing Information" />
          <CardContent>
            <Typography variant="subtitle1">CHPL Product Number:</Typography>
            <Typography gutterBottom>{ listing.chplProductNumber }</Typography>
            { listing.acbCertificationId
              && (
                <>
                  <Typography variant="subtitle1">ONC-ACB Certification ID:</Typography>
                  <Typography gutterBottom>{ listing.acbCertificationId }</Typography>
                </>
              )}
            { listing.chplProductNumberHistory.length > 0
              && (
                <>
                  <Typography variant="subtitle1">Previous CHPL Product Numbers:</Typography>
                  <List>
                    { listing.chplProductNumberHistory.length.map((prev) => (
                      <ListItem>
                        { prev }
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

            { listing.reportFileLocation
              && (
                <ChplLink
                  href={listing.reportFileLocation}
                  text={listing.reportFileLocation}
                  analytics={{ event: 'Test Results Summary', category: 'Download Details', label: listing.reportFileLocation }}
                />
              )}
            { !listing.reportFileLocation
              && (
                <Typography>No report on file.</Typography>
              )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default ChplListingInformation;

ChplListingInformation.propTypes = {
  listing: listingType.isRequired,
};
