import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, bool, shape, string } from 'prop-types';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckIcon from '@material-ui/icons/Check';
import GetAppIcon from '@material-ui/icons/GetApp';
import { ExportToCsv } from 'export-to-csv';

import { listing as listingPropType } from 'shared/prop-types';
import { getAngularService } from 'services/angular-react-helper';
import { palette } from 'themes';

const useStyles = makeStyles({
  tableActions: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    alignContent: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  tableActionsHorizontal: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

const csvOptions = {
  filename: 'listings',
  showLabels: true,
};

const initialHeaders = [
  { headerName: 'CHPL ID', objectKey: 'chplProductNumber', selected: true },
  { headerName: 'Certification Edition', objectKey: 'fullEdition', selected: true },
  { headerName: 'Developer', objectKey: 'developerName', selected: true },
  { headerName: 'Product', objectKey: 'productName', selected: true },
  { headerName: 'Version', objectKey: 'versionName', selected: true },
  { headerName: 'Certification Date', objectKey: 'certificationDate', selected: true },
  { headerName: 'Certification Status', objectKey: 'certificationStatusName', selected: true },
];

function ChplDownloadListings(props) {
  const { analytics, extraHeaders, listings } = props;
  const $analytics = getAngularService('$analytics');
  const [anchor, setAnchor] = useState(null);
  const [headers, setHeaders] = useState(initialHeaders);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClick = (e) => {
    if (analytics) {
      $analytics.eventTrack('Open Download Filter', { category: analytics.category });
    }
    setAnchor(e.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchor(null);
    setOpen(false);
  };

  const handleDownload = () => {
    const csvExporter = new ExportToCsv({
      ...csvOptions,
      headers: headers.filter((h) => h.selected),
    });
    if (analytics) {
      $analytics.eventTrack('Download Results', { category: analytics.category, label: listings.length });
    }
    csvExporter.generateCsv(listings);
  };

  const toggle = (header) => {
    setHeaders((previous) => previous.map((p) => ({
      ...p,
      selected: header.headerName === p.headerName ? !p.selected : p.selected,
    })));
  };

  return (
    <>
      <Button
        aria-controls="download-listings-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="secondary"
        variant="contained"
        size="small"
        fullWidth
        id="open-download-listings-menu"
        endIcon={<GetAppIcon />}
      >
        Download
        {' '}
        { listings.length }
        {' '}
        Result
        { listings.length !== 1 ? 's' : '' }
      </Button>
      <Menu
        id="download-listings-menu"
        open={open}
        anchorEl={anchor}
        getContentAnchorEl={null}
        keepMounted
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            alignItems: 'center',
            borderRadius: '0 0 8px 8px',
            border: `1px solid ${palette.grey}`,
            boxShadow: 'rgb(149 157 165 / 40%) 0px 6px 16px 6px',
            backgroundColor: '#fff',
          },
        }}
      >
        { headers.map((h) => (
        <MenuItem
          onClick={() => toggle(h)}
          key={h.objectKey}
        >
          <span className="sr-only">{ h.selected ? 'selected: ' : 'not selected: '}</span>
          { h.selected ? <CheckIcon /> : <CheckBoxOutlineBlankIcon /> }
          { h.headerName }
        </MenuItem>
        ))}
        <MenuItem
          onClick={handleDownload}
        >
          Download
          {' '}
          { listings.length }
          {' '}
          Result
          { listings.length !== 1 ? 's' : '' }
        </MenuItem>
      </Menu>
    </>
  );
}

export default ChplDownloadListings;

ChplDownloadListings.propTypes = {
  listings: arrayOf(listingPropType),
  analytics: shape({
    category: string.isRequired,
  }),
  extraHeaders: arrayOf(shape({
    headerName: string.isRequired,
    objectKey: string.isRequired,
    selected: bool.isRequired
  })),
};

ChplDownloadListings.defaultProps = {
  listings: [],
  anayltics: undefined,
  extraHeaders: [],
};
