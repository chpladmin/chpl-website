import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  arrayOf,
  bool,
  func,
  number,
  object,
  string,
} from 'prop-types';

import ChplQuarterViewListingSurveillance from './quarter-view-listing-surveillance';

import { useFetchRelevantListings } from 'api/surveillance';
import ChplComplaints from 'components/surveillance/complaints/complaints';
import { ChplActionBar } from 'components/action-bar';
import { getDisplayDateFormat } from 'services/date-util';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
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
});

function ChplQuarterViewListing({
  listing,
}) {
  const classes = useStyles();

  return (
    <>
      <Typography>{ listing.chplProductNumber }</Typography>
      <Typography>{ getDisplayDateFormat(listing.certificationDay) }</Typography>
      <Typography>{ listing.certificationStatus }</Typography>
      { listing.surveillances.map((surv) => (
        <ChplQuarterViewListingSurveillance
          key={surv.id}
          surveillance={surv}
        />
      ))}
    </>
  );
}

export default ChplQuarterViewListing;

ChplQuarterViewListing.propTypes = {
  listing: object.isRequired,
};
