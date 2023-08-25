import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CircularProgress,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import {
  arrayOf, number, oneOfType, string,
} from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import PanToolIcon from '@material-ui/icons/PanTool';

import { useFetchListing } from 'api/listing';
import ChplActionButton from 'components/action-widget/action-button';
import ChplBrowserComparedWidget from 'components/browser/browser-compared-widget';
import { ChplLink, ChplTooltip } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { sortCqms } from 'services/cqms.service';
import { getDisplayDateFormat } from 'services/date-util';
import { FlagContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    padding: '32px 0',
    backgroundColor: palette.background,
  },
  pageHeader: {
    padding: '32px',
    backgroundColor: palette.white,
  },
  headerRow: {
    boxShadow: 'rgba(149, 157, 165, 0.1) 0 16px 8px',
    '&.MuiTableRow-root.MuiTableRow-hover:hover': {
      backgroundColor: '#fff!important',
    },
  },
  headerColumnContent: {
    padding: '4px 16px 16px 16px',
  },
  Table: {
    height: '100vh',
  },
  MuiTableCellStickyHeader: {
    '&.TableCell-stickyHeader': {
      top: '75px',
    },
  },
});

function ChplComparePage({ ids }) {
  const [activeListing, setActiveListing] = useState(undefined);
  const [cqms, setCqms] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [editionlessIsOn, setEditionlessIsOn] = useState(false);
  const [listings, setListings] = useState([]);
  const [listingsToProcess, setListingsToProcess] = useState([]);
  const [showPracticeType, setShowPracticeType] = useState(false);
  const { data, isLoading, isSuccess } = useFetchListing({ id: activeListing });
  const { isOn } = useContext(FlagContext);
  const classes = useStyles();

  useEffect(() => {
    setEditionlessIsOn(isOn('editionless'));
  }, [isOn]);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    if (data?.id) {
      setListings((previous) => [...previous, data].sort((a, b) => (a.certificationDate < b.certificationDate ? -1 : 1)));
      setListingsToProcess((previous) => previous.filter((id) => id !== activeListing));
      setActiveListing(undefined);
      data.certificationResults.filter((cr) => cr.success).forEach((cr) => {
        if (!criteria.find((crit) => crit.id === cr.criterion.id)) {
          setCriteria((prev) => [...prev, cr.criterion].sort(sortCriteria));
        }
      });
      data.cqmResults.filter((cqm) => cqm.success).forEach((cqm) => {
        if (!cqms.find((item) => item.cmsId === cqm.cmsId)) {
          setCqms((prev) => [...prev, cqm].sort(sortCqms));
        }
      });
      if (data.practiceType.name) { setShowPracticeType(true); }
    }
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    setListingsToProcess(ids);
  }, [ids]);

  useEffect(() => {
    setActiveListing(listingsToProcess[0]);
  }, [listingsToProcess]);

  const makeRow = (title, getData) => (
    <TableRow>
      <TableCell><strong>{title}</strong></TableCell>
      {listings.map((listing) => (
        <TableCell key={listing.id}>
          {getData(listing)}
        </TableCell>
      ))}
    </TableRow>
  );

  const makeCriterionRow = (criterion) => (
    <TableRow key={criterion.id}>
      <TableCell>
        {criterion.removed ? 'Removed | ' : ''}
        <strong>{criterion.number}</strong>
        {': '}
        {criterion.title}
        {criterion.removed
          && (
            <ChplTooltip title="This certification criterion has been removed from the Program.">
              <IconButton className={classes.infoIcon}>
                <InfoIcon
                  className={classes.infoIconColor}
                />
              </IconButton>
            </ChplTooltip>
          )}
      </TableCell>
      {listings.map((listing) => (
        <TableCell key={listing.id}>
          {listing.certificationResults
            .some((cr) => cr.criterion.id === criterion.id)
            ? (listing.certificationResults.find((cr) => cr.criterion.id === criterion.id).success
              ? (
                <span>
                  <Box>
                    <ChplTooltip
                      title="Meets"
                    >
                      <ThumbUpIcon color="primary" />
                    </ChplTooltip>
                  </Box>
                </span>
              )
              : (
                <span>
                  <Box>
                    <ChplTooltip
                      title="Does Not Meet"
                    >
                      <ThumbDownIcon color="disabled" />
                    </ChplTooltip>
                  </Box>
                </span>
              ))
            : (
              <span>
                <Box>
                  <ChplTooltip
                    title="Can Not Meet"
                  >
                    <PanToolIcon color="error" />
                  </ChplTooltip>
                </Box>
              </span>
            )}
        </TableCell>
      ))}
    </TableRow>
  );

  const getCqmValue = (cqm, listing) => {
    let res;
    if (cqm.cmsId) {
      res = listing.cqmResults.find((c) => c.cmsId === cqm.cmsId);
      if (res) {
        return res.success ? res.successVersions.join('; ')
          : (
            <span>
              <Box>
                <ChplTooltip
                  title="Does Not Meet"
                >
                  <ThumbDownIcon color="disabled" />
                </ChplTooltip>
              </Box>
            </span>
          );
      }
      return (
        <span>
          <Box>
            <ChplTooltip
              title="Can Not Meet"
            >
              <PanToolIcon color="error" />
            </ChplTooltip>
          </Box>
        </span>
      );
    }
    res = listing.cqmResults.find((c) => c.nqfNumber === cqm.nqfNumber);
    if (res) {
      return res.success
        ? (
          <span>
            <Box>
              <ChplTooltip
                title="Meets"
              >
                <ThumbUpIcon color="primary" />
              </ChplTooltip>
            </Box>
          </span>
        )
        : (
          <span>
            <Box>
              <ChplTooltip
                title="Does Not Meet"
              >
                <ThumbDownIcon color="disabled" />
              </ChplTooltip>
            </Box>
          </span>
        );
    }
    return (
      <span>
        <Box>
          <ChplTooltip
            title="Can Not Meet"
          >
            <PanToolIcon color="error" />
          </ChplTooltip>
        </Box>
      </span>
    );
  };

  const makeCqmRow = (cqm) => (
    <TableRow key={cqm.id}>
      <TableCell>
        <strong>{cqm.cmsId ?? `NQF-${cqm.nqfNumber}`}</strong>
        {': '}
        {cqm.title}
      </TableCell>
      {listings.map((listing) => (
        <TableCell key={listing.id}>
          {getCqmValue(cqm, listing)}
        </TableCell>
      ))}
    </TableRow>
  );

  if (listings.length === 0) {
    return <CircularProgress />;
  }

  return (
    <Box bgcolor={palette.white}>
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
            <Box>
              <Typography
                variant="body1"
              >
                6 Products
              </Typography>

            </Box>
          </Box>
        </Container>
      </div>
      <Box className={classes.container}>
        <Container maxWidth="lg">
          <div id="main-content" tabIndex="-1">
            <Card>
              <TableContainer className={classes.Table}>
                <Table size="small">
                  <TableHead>
                    <TableRow hover="false" className={classes.headerRow}>
                      <TableCell className={classes.headerColumnContent}><span className="sr-only">Data item</span></TableCell>
                      {listings.map((listing) => (
                        <TableCell className={classes.headerColumnContent} key={listing.id}>
                          <Box mb={2} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                            {listing.product.name}
                            <ChplBrowserComparedWidget
                              listing={listing}
                            />
                            <IconButton size="small"><CloseIcon /></IconButton>
                          </Box>
                          <Box>
                            <ChplActionButton
                              listing={listing}
                              horizontal={false}
                            />
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {makeRow('Developer', (listing) => listing.developer.name)}
                    {makeRow('Version', (listing) => listing.version.version)}
                    {editionlessIsOn ? '' : makeRow('Certification Edition', (listing) => {
                      if (!listing.edition) { return ''; }
                      return `${listing.edition.name}${listing.curesUpdate ? ' Cures Update' : ''}`;
                    })}
                    {makeRow('Certification Status', (listing) => listing.currentStatus.status.name)}
                    {showPracticeType ? makeRow('Practice Type', (listing) => (listing.practiceType.name ? listing.practiceType.name : 'N/A')) : ''}
                    {makeRow('Certifying Body', (listing) => listing.certifyingBody.name)}
                    {makeRow('Certification Date', (listing) => getDisplayDateFormat(listing.certificationDay))}
                    {makeRow('Inactive/Decertified Date', (listing) => getDisplayDateFormat(listing.decertificationDate))}
                    {makeRow('CHPL Product Number', (listing) => listing.chplProductNumber)}
                    {makeRow('Number of Open Non-Conformities', (listing) => listing.countOpenNonconformities)}
                    {makeRow('Certification Criteria', (listing) => `${listing.countCerts} met`)}
                    {criteria.map(makeCriterionRow)}
                    {makeRow('Clinical Quality Measures', (listing) => `${listing.countCqms} met`)}
                    {cqms.map(makeCqmRow)}
                    {makeRow('View listing details', (listing) => (
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
              </TableContainer>
            </Card>
          </div>
        </Container>
      </Box>
    </Box>
  );
}

export default ChplComparePage;

ChplComparePage.propTypes = {
  ids: arrayOf(oneOfType([number, string])).isRequired,
};
