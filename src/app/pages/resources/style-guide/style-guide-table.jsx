import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  TablePagination,
  Typography,
  ThemeProvider,
  makeStyles,
  Container,
  Divider,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import { ChplSortableHeaders } from '../../../components/util/chpl-sortable-headers';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridGap:'8px',
    gridTemplateColumns: '4fr 1fr 1fr',
    padding:'16px 16px',
    alignItems: 'center',
  },

  tableContainer: {
    maxHeight: 440,
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
      id: 3,
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
    <div>
    <TableContainer className={classes.tableContainer} component={Paper}>
    <div className={classes.container}>
    <Typography variant="h5">Title of Table</Typography>
    <Button size="medium" color="primary" variant="outlined">Download
    <GetAppIcon/>
    </Button>
    <Button size="medium" color="primary" variant="outlined">Add
    <PlaylistAddIcon/>
    </Button>
    </div>
      <Table>
        <ChplSortableHeaders
          headers={headers}
          onTableSort={handleTableSort}
        />
        <TableBody>
          { listings
            .map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>{ listing.chplProductNumber }</TableCell>
                <TableCell>{ listing.developer }</TableCell>
                <TableCell>{ listing.product }</TableCell>
                <TableCell>{ listing.version }</TableCell>
                <TableCell>{ listing.status }</TableCell>
                <TableCell>
                  <ButtonGroup color="primary"> 
                    <Button>
                     CERT ID
                    </Button>
                    <Button>
                     Compare
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
        <TableRow>
        <TablePagination>
        </TablePagination>
        </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    </div>
  );
}

export default ChplStyleGuideTable;
