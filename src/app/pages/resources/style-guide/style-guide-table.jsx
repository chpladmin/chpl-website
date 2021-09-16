import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  makeStyles,
} from '@material-ui/core';

import { ChplSortableHeaders } from '../../../components/util';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import GetAppIcon from '@material-ui/icons/GetApp';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",
    gap: '16px',
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
  },
  tableContainer: {
    maxHeight: "800px",
    overflowWrap: 'normal',
    border: '.5px solid #c2c6ca',
  },
  tableActionContainer: {
    display: "grid",
    justifyContent: 'end',
  },
  widgetContainer: {
    gap: '8px',
    display: 'grid',
    alignContent: 'space-between',
  },
  iconSpacing: {
    marginLeft: '4px',
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
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'OPEN',
      actions: 'Y | N',
    }, {
      id: 2,
      chplProductNumber: '15.07.07.1447.SY01.01.00.1.160505',
      developer: 'Epic Systems Corporation',
      product: 'Syndromic Surveillance Reporting',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'OPEN',
      actions: 'Y | N',
    }, {
      id: 3,
      chplProductNumber: '15.07.07.1447.BE01.01.00.1.160505',
      developer: 'Epic Systems Corporation',
      product: 'Beaker Reportable Labs Reporting',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'OPEN',
      actions: 'Y | N',
    }, {
      id: 4,
      chplProductNumber: '15.04.04.2657.Care.01.00.0.160701',
      developer: 'Carefluence',
      product: 'Carefluence Open API',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'OPEN',
      actions: 'Y | N',
    }, {
      id: 5,
      chplProductNumber: '15.04.04.2980.Modu.09.00.1.160728',
      developer: 'ModuleMD',
      product: 'ModuleMD WISE™',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 6,
      chplProductNumber: '15.04.04.2891.Alls.17.00.0.160728',
      developer: 'Allscripts',
      product: 'Allscripts TouchWorks EHR',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 7,
      chplProductNumber: '15.04.04.2891.Alls.AC.00.1.160804',
      developer: 'Allscripts',
      product: 'Allscripts Sunrise Acute Care',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 8,
      chplProductNumber: '15.04.04.2891.Alls.AM.00.1.160804',
      developer: 'Allscripts',
      product: 'Allscripts Sunrise Ambulatory Care',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 9,
      chplProductNumber: '15.07.07.1447.EP03.01.00.1.160720',
      developer: 'Epic Systems Corporation',
      product: 'EpicCare Ambulatory EHR Suite',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 10,
      chplProductNumber: '15.07.07.1447.EP04.01.00.1.160720',
      developer: 'Epic Systems Corporation',
      product: 'EpicCare Inpatient EHR Suite',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 11,
      chplProductNumber: '15.07.07.1447.BE02.01.00.1.160815',
      developer: 'Epic Systems Corporation',
      product: 'Beacon Cancer Registry Reporting',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 12,
      chplProductNumber: '15.07.07.2713.CQ01.01.00.1.160916',
      developer: 'Dynamic Health IT, Inc',
      product: 'CQMsolution',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
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
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 15,
      chplProductNumber: '15.07.07.1447.BE01.02.01.1.161014',
      developer: 'Epic Systems Corporation',
      product: 'Beaker Reportable Labs Reporting',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'CLOSED',
      actions: 'Y | N',
    }, {
      id: 16,
      chplProductNumber: '15.07.07.1447.BE01.02.01.1.161014',
      developer: 'Epic Systems Corporation',
      product: 'Beaker Reportable Labs Reporting',
      edition: '2015',
      version: 'Epic 2017',
      certifcationDate: 'July, 2021',
      status: 'CLOSED',
      actions: 'Y | N',
    },
  ]);

  const headers = [
    { text: 'CHPL Product Number', property: 'chplProductNumber', sortable: true },
    { text: 'Developer', property: 'developer', sortable: true },
    { text: 'Product', property: 'product', sortable: true },
    { text: 'Edition', property: 'edition', sortable: true },
    { text: 'Version', property: 'version', sortable: true },
    { text: 'Certification Date', property: 'certificationDate', sortable: true },
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
      <TableContainer>
        <div className={classes.tableActionContainer}>
          <ButtonGroup>
            <Button fullWidth color="secondary" variant="contained">Download
              <GetAppIcon className={classes.iconSpacing} />
            </Button>
            <Button fullWidth color="secondary" variant="contained">Columns Settings
              <SettingsIcon className={classes.iconSpacing} />
            </Button>
            <Button fullWidth color="secondary" variant="contained">Add
              <PlaylistAddIcon className={classes.iconSpacing} />
            </Button>
          </ButtonGroup>
        </div>
      </TableContainer>
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
                  <TableCell className={classes.stickyColumn}>
                    <Button color="primary" variant="contained">
                      {listing.chplProductNumber}
                      <ArrowForwardIcon className={classes.iconSpacing} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <a href='#'>{listing.developer}</a>
                  </TableCell>
                  <TableCell>{listing.product}</TableCell>
                  <TableCell>{listing.edition}</TableCell>
                  <TableCell>{listing.version}</TableCell>
                  <TableCell>{listing.certifcationDate}</TableCell>
                  <TableCell>{listing.status}</TableCell>
                  <TableCell align="right">
                    <Button fullWidth color="secondary" variant="contained">
                      CERT ID
                      <AssignmentOutlinedIcon className={classes.iconSpacing} />
                    </Button>
                    <Button fullWidth color="secondary" variant="contained">
                      Compare
                      <CompareArrowsIcon className={classes.iconSpacing} />
                    </Button>
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
