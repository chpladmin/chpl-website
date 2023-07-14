import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';

import ChplIcsFamily from 'components/listing/details/ics-family/ics-family';
import { ChplLink } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { listing as listingType } from 'shared/prop-types/listing';

const getRelatives = (listings) => listings.map((listing) => (
  <ListItem key={listing.chplProductNumber}>
    { listing.id
      && (
        <ChplLink
          href={`#/listing/${listing.id}`}
          text={`${listing.chplProductNumber} (${getDisplayDateFormat(listing.certificationDay)})`}
          external={false}
          router={{ sref: 'listing', options: { id: listing?.id } }}
          analytics={{ event: 'Go to ICS Relationship Listing', category: 'Listing Details', label: listing.chplProductNumber }}
        />
      )}
    { !listing.id
      && (
        <Typography>{ listing.chplProductNumber }</Typography>
      )}
  </ListItem>
));

function ChplAdditionalInformation(props) {
  const { listing } = props;
  const [currentPi, setCurrentPi] = useState(undefined);

  useEffect(() => {
    if (listing.promotingInteroperabilityUserHistory?.length > 0) {
      setCurrentPi(listing.promotingInteroperabilityUserHistory.sort((a, b) => (a.userCountDate < b.userCountDate ? 1 : -1))[0]);
    }
  }, [listing]);

  return (
    <>
      <Box gridGap={8} display="flex" flexDirection="column">
        { listing.certificationEdition.name === '2014'
          && (
            <Card>
              <CardHeader title="Test Results Summary" />
              <CardContent>
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
          )}
        { listing.ics !== null
          && (
            <Card>
              <CardHeader title="Certification History" />
              <CardContent>
                { listing.ics.inherits !== null
                  && (
                    <>
                      <Typography variant="subtitle1">Inherited Certified Status (ICS):</Typography>
                      <Typography gutterBottom>{ listing.ics.inherits ? 'True' : 'False' }</Typography>
                    </>
                  )}
                { listing.ics.inherits === null
                  && (
                    <>
                      <Typography gutterBottom>N/A</Typography>
                    </>
                  )}
                { listing.ics.parents?.length > 0
                  && (
                    <>
                      <Typography variant="subtitle1">Inherits From:</Typography>
                      <List>
                        { getRelatives(listing.ics.parents) }
                      </List>
                    </>
                  )}
                { listing.ics.children?.length > 0
                  && (
                    <>
                      <Typography variant="subtitle1">ICS Source for:</Typography>
                      <List>
                        { getRelatives(listing.ics.children) }
                      </List>
                    </>
                  )}
                { listing.ics.inherits && listing.certificationEdition.name === '2015'
                  && (
                    <ChplIcsFamily
                      id={listing.id}
                    />
                  )}
              </CardContent>
            </Card>
          )}
        { listing.otherAcb !== null
          && (
            <Card>
              <CardHeader title="Other ACB" />
              <CardContent>
                <Typography>{ listing.otherAcb }</Typography>
              </CardContent>
            </Card>
          )}
        { listing.targetedUsers?.length > 0
          && (
            <Card>
              <CardHeader title="Developer Identified Targeted Users" />
              <CardContent>
                <List>
                  { listing.targetedUsers.map((user) => (
                    <ListItem key={user.targetedUserName}>
                      { user.targetedUserName }
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        <Card>
          <CardHeader title="Estimated Number of Promoting Interoperability Users" />
          <CardContent>
            { currentPi
              && (
                <Typography>
                  { currentPi.userCount }
                  , last updated on
                  {' '}
                  { getDisplayDateFormat(currentPi.userCountDate) }
                </Typography>
              )}
            { !currentPi
              && (
                <Typography>No Promoting Interoperability Users data exists.</Typography>
              )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default ChplAdditionalInformation;

ChplAdditionalInformation.propTypes = {
  listing: listingType.isRequired,
};
