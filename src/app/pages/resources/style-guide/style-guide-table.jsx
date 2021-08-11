import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  makeStyles,
  useMediaQuery,
  Typography,
} from '@material-ui/core';

import { ChplSortableHeaders } from '../../../components/util/chpl-sortable-headers';
import LanguageIcon from '@material-ui/icons/Language';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import GetAppIcon from '@material-ui/icons/GetApp';
import SearchIcon from '@material-ui/icons/Search';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import ChplDefaultFilter from './chpl-default-filter';


const useStyles = makeStyles({
  filterContainer: {
    display: 'grid',
    gridGap: '8px',
    gridTemplateColumns: '8fr 4fr',
    padding: '16px',
    alignItems: 'center',
  },
  filterSubContainer: {
    display: 'grid',
    gridGap: '8px',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    alignItems: 'center',
    borderRadius: '0px',
  },
  searchContainer: {
    margin: '16px 128px',
    padding: '0px 0px 0px 32px',
    display: 'grid',
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    gridTemplateColumns: '.5fr 10.5fr 1fr',
    alignItems: 'center',
    borderRadius: '64px',
    backgroundColor: '#ffffff',
  },
  tableContainer: {
    maxHeight: "800px",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",
  },
  tableActionContainer: {
    display: "grid",
    justifyContent:'end',
  },
  searchInput: {
    display: 'grid',
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",
  },

  iconSpacing: {
    marginLeft: '4px',
  },
  browseAll: {
    borderRadius: '0px 64px 64px 0px',
    padding: '16px',
  },
});

function ChplStyleGuideTable() {
  const classes = useStyles();
  const [listings, setListings] = useState([
    {
      id: 1,
      chplProductNumber: '15.07.07.1447.IN01.01.00.1.160503',
      developer: 'Epic Systems Corporation',
      product: 'Infection Control Antimicrobial Use and Resistance Reporting',
      version: 'Epic 2017',
      status: 'OPEN',
      actions: 'Y | N',
    }, {
      id: 2,
      chplProductNumber: '15.07.07.1447.SY01.01.00.1.160505',
      developer: 'Epic Systems Corporation',
      product: 'Syndromic Surveillance Reporting',
      version: 'Epic 2017',
      status: 'OPEN',
      actions: 'Y | N',
    }, {
      id: 3,
      chplProductNumber: '15.07.07.1447.BE01.01.00.1.160505',
      developer: 'Epic Systems Corporation',
      product: 'Beaker Reportable Labs Reporting',
      version: 'Epic 2017',
      status: 'OPEN',
      actions: 'Y | N',
    }, {
      id: 4,
      chplProductNumber: '15.04.04.2657.Care.01.00.0.160701',
      developer: 'Carefluence',
      product: 'Carefluence Open API',
      version: '1',
      status: 'OPEN',
      actions: 'Y | N',
    }, {
      id: 5,
      chplProductNumber: '15.04.04.2980.Modu.09.00.1.160728',
      developer: 'ModuleMD',
      product: 'ModuleMD WISE™',
      version: '9.0',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 6,
      chplProductNumber: '15.04.04.2891.Alls.17.00.0.160728',
      developer: 'Allscripts',
      product: 'Allscripts TouchWorks EHR',
      version: '17.1',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 7,
      chplProductNumber: '15.04.04.2891.Alls.AC.00.1.160804',
      developer: 'Allscripts',
      product: 'Allscripts Sunrise Acute Care',
      version: '16.3',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 8,
      chplProductNumber: '15.04.04.2891.Alls.AM.00.1.160804',
      developer: 'Allscripts',
      product: 'Allscripts Sunrise Ambulatory Care',
      version: '16.3',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 9,
      chplProductNumber: '15.07.07.1447.EP03.01.00.1.160720',
      developer: 'Epic Systems Corporation',
      product: 'EpicCare Ambulatory EHR Suite',
      version: 'Epic 2016',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 10,
      chplProductNumber: '15.07.07.1447.EP04.01.00.1.160720',
      developer: 'Epic Systems Corporation',
      product: 'EpicCare Inpatient EHR Suite',
      version: 'Epic 2016',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 11,
      chplProductNumber: '15.07.07.1447.BE02.01.00.1.160815',
      developer: 'Epic Systems Corporation',
      product: 'Beacon Cancer Registry Reporting',
      version: 'Epic 2017',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 12,
      chplProductNumber: '15.07.07.2713.CQ01.01.00.1.160916',
      developer: 'Dynamic Health IT, Inc',
      product: 'CQMsolution',
      version: '3.0',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 13,
      chplProductNumber: '15.07.07.1447.BE01.02.01.1.161014',
      developer: 'Epic Systems Corporation',
      product: 'Beaker Reportable Labs Reporting',
      version: 'Epic 2015',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 14,
      chplProductNumber: '15.07.07.1447.BE01.02.01.1.161014',
      developer: 'Epic Systems Corporation',
      product: 'Beaker Reportable Labs Reporting',
      version: 'Epic 2015',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 15,
      chplProductNumber: '15.07.07.1447.BE01.02.01.1.161014',
      developer: 'Epic Systems Corporation',
      product: 'Beaker Reportable Labs Reporting',
      version: 'Epic 2015',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 16,
      chplProductNumber: '15.07.07.1447.BE01.02.01.1.161014',
      developer: 'Epic Systems Corporation',
      product: 'Beaker Reportable Labs Reporting',
      version: 'Epic 2015',
      status: 'CLOSED',
      actions: 'Y | N',
    },
  ]);

  const headers = [
    { text: 'CHPL Product Number', property: 'chplProductNumber', sortable: true },
    { text: 'Developer', property: 'developer', sortable: true },
    { text: 'Product', property: 'product', sortable: true },
    { text: 'Version', property: 'version', sortable: true },
    { text: 'Status', property: 'status', sortable: true },
    { text: 'Actions', property: 'actions', invisible: true, sortable: false },
  ];

  const listingSortComparator = (property) => {
    let sortOrder = 1;
    let key = property;
    if (key[0] === '-') {
      sortOrder = -1;
      key = key.substr(1);
    }
    return (a, b) => {
      const result = (a[key] < b[key]) ? -1 : 1;
      return result * sortOrder;
    };
  };

  const handleTableSort = (event, property, orderDirection) => {
    setListings(listings.sort(listingSortComparator(orderDirection + property)).map((listing) => listing));
  };


  return (
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <div>
          <SearchIcon />
        </div>
        <div>
          <InputBase
            className={classes.searchInput}
            placeholder="Search by Developer, Product, or ONC-ACB/CHPL ID..."

          />
        </div>
      <div>
          <Button className={classes.browseAll} variant='contained' color="primary">
            Browse All <LanguageIcon className={classes.iconSpacing} />
          </Button>
      </div>
      </div>
      <Typography variant="body02" align="center">
            Please note that only active and suspended listings are shown by default. Use the Certification Status / Certification Edition filters above to display retired, withdrawn, terminated, or 2011 and 2014 edition listings.
            </Typography>
      <br />
      <TableContainer component={Paper}>
        <div className={classes.filterContainer}>
          <div className={classes.filterSubContainer}>
            <div><ChplDefaultFilter /></div>
            <div><ChplDefaultFilter /></div>
            <div><ChplDefaultFilter /></div>
            <div><ChplDefaultFilter /></div>
            <div><ChplDefaultFilter /></div>
          </div>
          <div className={classes.tableActionContainer}>
            <ButtonGroup>
            <Button fullWidth color="secondary" variant="contained">Download
              <GetAppIcon className={classes.iconSpacing}/>
            </Button>
            <Button fullWidth color="secondary" variant="contained">Add
              <PlaylistAddIcon className={classes.iconSpacing}/>
            </Button>
            <Button fullWidth color="secondary" variant="contained">Reset
              <RotateLeftIcon className={classes.iconSpacing}/>
            </Button>
            </ButtonGroup>
          </div>
        </div>
      </TableContainer>
      <br/>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table stickyHeader>
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
          />
          <TableBody>
            {listings
              .map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>{listing.chplProductNumber}</TableCell>
                  <TableCell>
                    <a href='#'>{listing.developer}</a>
                  </TableCell>
                  <TableCell>{listing.product}</TableCell>
                  <TableCell>{listing.version}</TableCell>
                  <TableCell>{listing.status}</TableCell>
                  <TableCell align="right">
                    <ButtonGroup color="primary">
                      <Button color="primary" variant="contained">
                        Open Details
                        <ArrowForwardIcon className={classes.iconSpacing} />
                      </Button>
                      <Button color="secondary" variant="contained">
                        CERT ID
                        <AssignmentOutlinedIcon className={classes.iconSpacing} />
                      </Button>
                      <Button color="secondary" variant="contained">
                        Compare
                        <CompareArrowsIcon className={classes.iconSpacing} />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[50, 100, 200, { label: 'All' }]}
        component="div"
      />

    </div>
  );
}

export default ChplStyleGuideTable;
