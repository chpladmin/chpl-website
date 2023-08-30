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
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';

import {
  arrayOf,
  number,
  oneOfType,
  string,
} from 'prop-types';

import { useFetchListing } from 'api/listing';
import ChplBrowserComparedWidget from 'components/browser/browser-compared-widget';
import { ChplLink, ChplTooltip } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { sortCqms } from 'services/cqms.service';
import { getDisplayDateFormat } from 'services/date-util';
import { FlagContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

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
      backgroundColor: `${palette.white} !important`,
    },
  },
  headerColumnContent: {
    padding: '4px 16px 16px 16px',
    minWidth: "150px",
  },
  Table: {
    height: '80vh',
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0 4px 8px',
    backgroundColor: palette.background,
  },
  MuiTableCellStickyHeader: {
    '&.TableCell-stickyHeader': {
      top: '75px',
    },
  },
  animatedItem: {
    animation: `$myEffect 1000ms ${theme.transitions.easing.easeInOut}`,
  },
  '@keyframes myEffect': {
    '0%': {
      opacity: 0,
      transform: 'translateY(200%)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
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
      <TableCell className={classes.stickyColumn}><strong>{ title }</strong></TableCell>
      { listings.map((listing) => (
        <TableCell className={classes.animatedItem} key={listing.id}>
          { getData(listing) }
        </TableCell>
      ))}
    </TableRow>
  );

  const getAttestationDisplay = (value) => {
    switch (value) {
      case 'Meets':
        return (
          <ChplTooltip
            title="Meets"
          >
            <CheckIcon htmlColor={palette.active}/>
          </ChplTooltip>
        );
      case 'Cannot meet':
        return (
          <ChplTooltip
            title="Cannot meet"
          >
            <NotInterestedIcon color="disabled"/>
          </ChplTooltip>
        );
      case 'Does not meet':
        return (
          <ChplTooltip
            title="Does not meet"
          >
            <IndeterminateCheckBoxOutlinedIcon htmlColor={palette.black}/>
          </ChplTooltip>
        );
        // no default
    }
    return null;
  };

  /* eslint-disable no-nested-ternary */
  const makeCriterionRow = (criterion) => {
    if (!listings.some((listing) => listing.certificationResults.some((cr) => cr.criterion.id === criterion.id))) { return null; }
    return (
      <TableRow key={criterion.id} id={`criterion-${criterion.id}`}>
        <TableCell scope="row" className={classes.stickyColumn}>
          { criterion.removed ? 'Removed | ' : '' }
          <strong>{ criterion.number }</strong>
          {': '}
          { criterion.title }
          { criterion.removed
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
        { listings.map((listing) => (
          <TableCell key={listing.id}>
            { listing.certificationResults
              .some((cr) => cr.criterion.id === criterion.id)
              ? (listing.certificationResults.find((cr) => cr.criterion.id === criterion.id).success
                ? getAttestationDisplay('Meets')
                : getAttestationDisplay('Does not meet'))
              : getAttestationDisplay('Cannot meet')}
          </TableCell>
        ))}
      </TableRow>
    );
  };
  /* eslint-enable no-nested-ternary */

  const getCqmValue = (cqm, listing) => {
    let res;
    if (cqm.cmsId) {
      res = listing.cqmResults.find((c) => c.cmsId === cqm.cmsId);
      if (res) {
        return res.success ? res.successVersions.join('; ')
          : getAttestationDisplay('Does not meet');
      }
      return getAttestationDisplay('Cannot meet');
    }
    res = listing.cqmResults.find((c) => c.nqfNumber === cqm.nqfNumber);
    if (res && !res.cmsId) {
      return res.success
        ? getAttestationDisplay('Meets')
        : getAttestationDisplay('Does not meet');
    }
    return getAttestationDisplay('Cannot meet');
  };

  const makeCqmRow = (cqm) => {
    if (!listings.some((listing) => listing.cqmResults.some((c) => {
      if (cqm.cmsId) {
        return c.cmsId === cqm.cmsId;
      }
      return c.nqfNumber === cqm.nqfNumber && !c.cmsId;
    }))) { return null; }
    return (
      <TableRow key={cqm.id} id={`cqm-${cqm.id}`}>
        <TableCell scope="row" className={classes.stickyColumn}>
          <strong>{ cqm.cmsId ?? `NQF-${cqm.nqfNumber}` }</strong>
          {': '}
          {cqm.title}
        </TableCell>
        { listings.map((listing) => (
          <TableCell key={listing.id}>
            { getCqmValue(cqm, listing) }
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const dropListing = (listing) => {
    setListings((prev) => prev.filter((l) => l.id !== listing.id));
  };

  if (listings.length === 0) {
    return <CircularProgress />;
  }

  return (
    <Box bgcolor={palette.white}>
      <div className={classes.pageHeader}>
        <Container maxWidth="lg">
          <Box className={classes.listingHeaderBox}>
            <Typography
              variant="h1"
              gutterBottom
            >
              Compare Products
            </Typography>
            <Typography
              variant="body1"
            >
              { listings.length }
              {' '}
              Products Selected | For the best experience, we suggest comparing up to four products at a time. If you want to compare more than four products, you can still do so! Just remember to scroll horizontally on the page to access all the products you&apos;ve added. While you have the flexibility to compare more items; we encourage you to focus on the most relevant products for your needs.
            </Typography>
          </Box>
        </Container>
      </div>
      <Box className={classes.container}>
        <Container id="main-content" tabIndex="-1" maxWidth="lg">
          <Card>
            <TableContainer className={classes.Table}>
              <Table size="small">
                <TableHead>
                  <TableRow hover={false} className={classes.headerRow}>
                    <TableCell className={classes.stickyColumn}><span className="sr-only">Data item</span></TableCell>
                    { listings.map((listing) => (
                      <TableCell className={classes.headerColumnContent} key={listing.id}>
                        <Box mb={2} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                          { listing.product.name }
                          <ChplBrowserComparedWidget
                            listing={listing}
                          />
                          <IconButton
                            size="small"
                            onClick={() => dropListing(listing)}
                            disabled={listings.length <= 2}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  { makeRow('Developer', (listing) => listing.developer.name) }
                  { makeRow('Version', (listing) => listing.version.version) }
                  { editionlessIsOn ? null : makeRow('Certification Edition', (listing) => {
                    if (!listing.edition) { return ''; }
                    return `${listing.edition.name}${listing.curesUpdate ? ' Cures Update' : ''}`;
                  }) }
                  { makeRow('Certification Status', (listing) => listing.currentStatus.status.name) }
                  { showPracticeType ? makeRow('Practice Type', (listing) => (listing.practiceType.name ? listing.practiceType.name : 'N/A')) : null }
                  { makeRow('Certifying Body', (listing) => listing.certifyingBody.name) }
                  { makeRow('Certification Date', (listing) => getDisplayDateFormat(listing.certificationDay)) }
                  { makeRow('Inactive/Decertified Date', (listing) => getDisplayDateFormat(listing.decertificationDay)) }
                  { makeRow('CHPL Product Number', (listing) => listing.chplProductNumber) }
                  { makeRow('Number of Open Non-Conformities', (listing) => listing.countOpenNonconformities) }
                  { makeRow('Certification Criteria', (listing) => `${listing.countCerts} met`) }
                  { criteria.map(makeCriterionRow) }
                  { makeRow('Clinical Quality Measures', (listing) => `${listing.countCqms} met`) }
                  { cqms.map(makeCqmRow) }
                  { makeRow('View product details', (listing) => (
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
        </Container>
      </Box>
    </Box>
  );
}

export default ChplComparePage;

ChplComparePage.propTypes = {
  ids: arrayOf(oneOfType([number, string])).isRequired,
};
