import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ChplLink } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { getStatusIcon } from 'services/listing.service';
import { UserContext } from 'shared/contexts';
import { listing as listingType } from 'shared/prop-types/listing';
import { theme } from 'themes';

const useStyles = makeStyles({
  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexWrap: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      gap: '8px',
      flexWrap: 'wrap',
    },
  },
  dataBox: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '48%',
    },
  },
});

function ChplListingInformation({ listing: initialListing }) {
  const { hasAnyRole, user } = useContext(UserContext);
  const [listing, setListing] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    setListing({
      ...initialListing,
      chplProductNumberHistory: [...new Set(initialListing.chplProductNumberHistory?.map((item) => item.chplProductNumber))]
        .filter((item) => item !== initialListing.chplProductNumber)
        .sort((a, b) => (a < b ? -1 : 1)),
    });
  }, [initialListing]);

  const canViewRwtDates = () => {
    if (hasAnyRole(['chpl-admin', 'ROLE_ONC'])) { return true; }
    if (hasAnyRole(['ROLE_ACB']) && user.organizations.some((o) => o.id === listing.certifyingBody.id)) { return true; }
    if (hasAnyRole(['ROLE_DEVELOPER']) && user.organizations.some((o) => o.id === listing.developer.id)) { return true; }
    return false;
  };

  if (!listing) { return <CircularProgress />; }

  return (
    <Box gridGap={16} display="flex" flexDirection="column">
      <Box gridGap={16} display="flex" flexDirection="column">
        <Box className={classes.dataContainer}>
          <Box className={classes.dataBox}>
            <Typography variant="subtitle1">CHPL Product Number:</Typography>
            <Typography gutterBottom>{listing.chplProductNumber}</Typography>
          </Box>
          { listing.acbCertificationId
           && (
             <Box className={classes.dataBox}>
               <Typography variant="subtitle1">ONC-ACB Certification ID:</Typography>
               <Typography gutterBottom>{listing.acbCertificationId}</Typography>
             </Box>
           )}
          { listing.chplProductNumberHistory.length > 0
           && (
             <Box className={classes.dataBox}>
               <Typography variant="subtitle1">Previous CHPL Product Numbers:</Typography>
               <List>
                 {listing.chplProductNumberHistory.map((prev) => (
                   <ListItem key={prev}>
                     { prev }
                   </ListItem>
                 ))}
               </List>
             </Box>
           )}
          <Box className={classes.dataBox}>
            <Typography variant="subtitle1">Certification Date:</Typography>
            <Typography gutterBottom>{getDisplayDateFormat(listing.certificationDay)}</Typography>
            { listing.product.ownerHistory?.length > 0
             && (
               <Box className={classes.dataBox}>
                 <Typography variant="subtitle1">Previous Developer:</Typography>
                 <List>
                   {listing.product.ownerHistory.map((prev) => (
                     <ListItem key={prev.developer.id}>
                       {prev.developer.name}
                       <br />
                       Transfer Date:
                       {' '}
                       {getDisplayDateFormat(prev.transferDay)}
                     </ListItem>
                   ))}
                 </List>
               </Box>
             )}
          </Box>
          <Box className={classes.dataBox}>
            <Typography variant="subtitle1">Version:</Typography>
            <Typography gutterBottom>{listing.version.version}</Typography>
          </Box>
          { listing.edition
             && (
             <Box className={classes.dataBox}>
               <Typography variant="subtitle1">Certification Edition:</Typography>
               <Typography gutterBottom>{listing.edition ? `${listing.edition.name}${listing.curesUpdate ? ' Cures Update' : ''}` : ''}</Typography>
             </Box>
             )}
          { listing.currentStatus
            && (
              <Box className={classes.dataBox}>
                <Typography variant="subtitle1">Certification Status:</Typography>
                <Typography gutterBottom>
                  {listing.currentStatus.status.name }
                  { getStatusIcon(listing.currentStatus.status) }
                </Typography>
              </Box>
            )}
          { listing.practiceType?.name
           && (
             <Box className={classes.dataBox}>
               <Typography variant="subtitle1">Practice Type:</Typography>
               <Typography gutterBottom>{listing.practiceType.name}</Typography>
             </Box>
           )}
          { listing.classificationType?.name
           && (
             <Box className={classes.dataBox}>
               <Typography variant="subtitle1">Classification Type:</Typography>
               <Typography gutterBottom>{listing.classificationType.name}</Typography>
             </Box>
           )}
          <Box className={classes.dataBox}>
            <Typography variant="subtitle1">ONC-Authorized Certification Body:</Typography>
            <Typography gutterBottom>{listing.certifyingBody.name}</Typography>
          </Box>
          <Box className={classes.dataBox}>
            <Typography variant="subtitle1">ONC-Authorized Testing Laboratory:</Typography>
            { listing.testingLabs.map((atl) => (
              <Typography gutterBottom key={atl.testingLab.id}>{atl.testingLab.name}</Typography>
            ))}
            { listing.productAdditionalSoftware
             && (
               <>
                 <Typography variant="subtitle1">Relied Upon Software:</Typography>
                 <Typography gutterBottom>{listing.productAdditionalSoftware}</Typography>
               </>
             )}
            { listing.svapNoticeUrl
             && (
               <>
                 <Typography variant="subtitle1">Standards Version Advancement Process Notice:</Typography>
                 <ChplLink
                   href={listing.svapNoticeUrl}
                   analytics={{ event: 'SVAP Notice', category: 'Listing Details', label: listing.svapNoticeUrl }}
                 />
               </>
             )}
          </Box>
          <Box className={classes.dataBox}>
            <Typography variant="subtitle1">Mandatory Disclosures:</Typography>
            { listing.mandatoryDisclosures
              ? (
                <ChplLink
                  href={listing.mandatoryDisclosures}
                  analytics={{ event: 'Mandatory Disclosures', category: 'Listing Details', label: listing.mandatoryDisclosures }}
                />
              ) : (
                <Typography gutterBottom>No report on File</Typography>
              )}
          </Box>
        </Box>
        <Card>
          <CardHeader title="Developer" />
          <CardContent>
            <Box className={classes.dataContainer}>
              <Box className={classes.dataBox}>
                <Typography variant="subtitle1">Developer:</Typography>
                <ChplLink
                  href={`#/organizations/developers/${listing.developer.id}`}
                  text={listing.developer.name}
                  analytics={{ event: 'Go to Developer Page', category: 'Listing Details', label: listing.developer.name }}
                  external={false}
                  router={{ sref: 'organizations.developers.developer', options: { id: listing.developer.id } }}
                />
              </Box>
              { listing.developer.status && listing.developer.status.status !== 'Active'
                && (
                  <Box className={classes.dataBox}>
                    <Typography variant="subtitle1">Developer Status:</Typography>
                    <Typography gutterBottom>{listing.developer.status.status}</Typography>
                  </Box>
                )}
              { listing.developer.website
                && (
                  <Box className={classes.dataBox}>
                    <Typography variant="subtitle1">Developer Website:</Typography>
                    <ChplLink
                      href={listing.developer.website}
                      analytics={{ event: 'Go to Developer Website', category: 'Listing Details', label: listing.developer.name }}
                    />
                  </Box>
                )}
              <Box className={classes.dataBox}>
                <Typography variant="subtitle1">Self-Developer:</Typography>
                <Typography gutterBottom>{listing.developer.selfDeveloper ? 'Yes' : 'No'}</Typography>
              </Box>
              { listing.developer.address
                && (
                  <Box className={classes.dataBox}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Address:</strong>
                      <br />
                      <span className="sr-only">Line 1:</span>
                      {listing.developer.address.line1}
                      {listing.developer.address.line2
                       && (
                         <>
                           ,
                           {' '}
                           <span className="sr-only">Line 2:</span>
                           {listing.developer.address.line2}
                         </>
                       )}
                      <br />
                      <span className="sr-only">City:</span>
                      {listing.developer.address.city}
                      ,
                      {' '}
                      <span className="sr-only">State:</span>
                      {listing.developer.address.state}
                      {' '}
                      <span className="sr-only">Zipcode:</span>
                      {listing.developer.address.zipcode}
                      ,
                      {' '}
                      <span className="sr-only">Country:</span>
                      {listing.developer.address.country}
                    </Typography>
                  </Box>
                )}
              { listing.product.contact
                && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Contact:</strong>
                    <br />
                    <span className="sr-only">Full name:</span>
                    {listing.product.contact.fullName}
                    {listing.product.contact.title
                     && (
                       <>
                         ,
                         {' '}
                         <span className="sr-only">Title:</span>
                         {listing.product.contact.title}
                       </>
                     )}
                    <br />
                    <span className="sr-only">Phone:</span>
                    {listing.product.contact.phoneNumber}
                    <br />
                    <span className="sr-only">Email:</span>
                    {listing.product.contact.email}
                  </Typography>
                )}
              { !listing.product.contact && listing.developer.contact
                && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Contact</strong>
                    <br />
                    <span className="sr-only">Full name:</span>
                    {' '}
                    {listing.developer.contact.fullName}
                    { listing.developer.contact.title
                     && (
                       <>
                         ,
                         {' '}
                         <span className="sr-only">Title:</span>
                         {listing.developer.contact.title}
                       </>
                     )}
                    <br />
                    <span className="sr-only">Phone:</span>
                    {listing.developer.contact.phoneNumber}
                    <br />
                    <span className="sr-only">Email:</span>
                    {listing.developer.contact.email}
                  </Typography>
                )}
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Conditions and Maintenance of Certification" />
          <CardContent>
            <Box className={classes.dataContainer}>
              <Box className={classes.dataBox}>
                <Typography variant="subtitle1">Attestations:</Typography>
                <ChplLink
                  href={`#/organizations/developers/${listing.developer.id}`}
                  text={listing.developer.name}
                  analytics={{ event: 'Go to Developer Page', category: 'Listing Details', label: listing.developer.name }}
                  external={false}
                  router={{ sref: 'organizations.developers.developer', options: { id: listing.developer.id } }}
                />
              </Box>
              { (listing.rwtPlansUrl || listing.rwtPlansCheckDate || listing.rwtResultsUrl || listing.rwtResultsCheckDate)
                && (
                  <Box className={classes.dataBox}>
                    <Typography variant="subtitle1" gutterBottom>Real World Testing:</Typography>
                    { listing.rwtPlansUrl
                     && (
                       <>
                         <Typography variant="subtitle2">Plans:</Typography>
                         <ChplLink
                           href={listing.rwtPlansUrl}
                           analytics={{ event: 'Go to RWT Plans URL', category: 'Listing Details', label: listing.rwtPlansUrl }}
                         />
                       </>
                     )}
                    { listing.rwtPlansCheckDate && canViewRwtDates()
                     && (
                       <>
                         <Typography variant="subtitle2">Last ONC-ACB RWT Plans Completeness Check:</Typography>
                         <Typography gutterBottom>{getDisplayDateFormat(listing.rwtPlansCheckDate)}</Typography>
                       </>
                     )}
                    { listing.rwtResultsUrl
                     && (
                       <>
                         <Typography variant="subtitle2">Results:</Typography>
                         <ChplLink
                           href={listing.rwtResultsUrl}
                           analytics={{ event: 'Go to RWT Results URL', category: 'Listing Details', label: listing.rwtResultsUrl }}
                         />
                       </>
                     )}
                    { listing.rwtResultsCheckDate && canViewRwtDates()
                     && (
                       <>
                         <Typography variant="subtitle2">Last ONC-ACB RWT Results Completeness Check:</Typography>
                         <Typography gutterBottom>{getDisplayDateFormat(listing.rwtResultsCheckDate)}</Typography>
                       </>
                     )}
                  </Box>
                )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default ChplListingInformation;

ChplListingInformation.propTypes = {
  listing: listingType.isRequired,
};
