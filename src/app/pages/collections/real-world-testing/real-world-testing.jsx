import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  ThemeProvider,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import SearchIcon from '@material-ui/icons/Search';
//import { ExportToCsv } from 'export-to-csv';

import SgAdvancedSearch from '../../../pages/resources/style-guide/sg-advanced-search';
import theme from '../../../themes/theme';
import {
  useFetchRealWorldTestingCollection,
} from '../../../api/collections';
import {
//  ChplPagination,
  ChplSortableHeaders,
} from '../../../components/util';

const csvOptions = {
  showLabels: true,
  headers: [
    { headerName: 'Developer', objectKey: 'developerName' },
    { headerName: 'Request Type', objectKey: 'changeRequestTypeName' },
    { headerName: 'Creation Date', objectKey: 'friendlyReceivedDate' },
    { headerName: 'Request Status', objectKey: 'currentStatusName' },
    { headerName: 'Last Status Change', objectKey: 'friendlyCurrentStatusChangeDate' },
  ],
};

const useStyles = makeStyles(() => ({
  container: {
    maxHeight: '64vh',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  content: {
    display: 'grid',
    gap: '32px',
    gridTemplateColumns: '1fr',
    alignItems: 'start',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  rowHeader: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    alignItems: 'start',
    padding: '32px',
    backgroundColor: '#ffffff',
  },
  rowBody: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    alignItems: 'start',
    padding: '16px 32px',
    backgroundColor: '#f9f9f9',
  },
}));

function ChplRealWorldTestingCollectionPage() {
  //const csvExporter = new ExportToCsv(csvOptions);
  const [orderBy, setOrderBy] = useState('developer');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [sortDescending, setSortDescending] = useState(false);
  const classes = useStyles();
  const rwtQuery = useFetchRealWorldTestingCollection({
    orderBy: orderBy,
    pageNumber: pageNumber,
    pageSize: pageSize,
    sortDescending: sortDescending,
  });

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = [
    { property: 'chpl_id', text: 'CHPL ID', sortable: true },
    { property: 'developer', text: 'Developer', sortable: true },
    { property: 'product', text: 'Product', sortable: true },
    { property: 'version', text: 'Version', sortable: true },
    { text: 'API Documentation' },
    { text: 'Real World Testing Plans URL' },
    { text: 'Real World Testing Results URL' },
  ];

  const getListings = () => {
    if (!rwtQuery.isSuccess) { return []; }
    return rwtQuery.data.results
      .map((item) => ({
        ...item,
      }));
  };

  const handleTableSort = (event, property, orderDirection) => {
    if (orderBy === property) {
      setSortDescending(!sortDescending);
    } else {
      setOrderBy(property);
    }
  };

  const emptyRows = pageSize - Math.min(pageSize, getListings().length - pageNumber * pageSize);

  if (getListings().length === 0) {
    return (
      <>No results found</>
    );
  }

  return (
    <>
      <div className={classes.rowHeader}>
        <Typography variant="h1">Collections Page</Typography>
      </div>
      <div className={classes.rowBody}>
        <Typography variant="h2">Real World Testing</Typography>
        <Divider />
        <div className={classes.content}>
          <div>
            <Typography
              variant="h6"
              gutterBottom
            >
              Ut volutpat mi ligula, sit amet pulvinar felis tincidunt in. Nam libero dui, molestie in volutpat eu, faucibus et urna. Vestibulum vitae leo rhoncus, interdum leo non, euismod erat. Proin vitae ex risus. Integer ac dapibus est, ut ullamcorper mauris. Morbi tincidunt ac ante id vulputate. Sed ut facilisis dui. Nunc ac fermentum libero. Ut sed ligula sit amet eros accumsan placerat.                    Ut volutpat mi ligula, sit amet pulvinar felis tincidunt in. Nam libero dui, molestie in volutpat eu, faucibus et urna. Vestibulum vitae leo rhoncus, interdum leo non, euismod erat. Proin vitae ex risus. Integer ac dapibus est, ut ullamcorper mauris. Morbi tincidunt ac ante id vulputate. Sed ut facilisis dui. Nunc ac fermentum libero. Ut sed ligula sit amet eros accumsan placerat.
            </Typography>
            <Typography>
              For more information <a href="#">visit here</a>
            </Typography>
          </div>
          <Card>
            <CardHeader title="Download All Real Word Testing Data" />
            <CardContent>
              <Typography variant="body1">
                Please note the All RWT file contains information for all certified product listings and is not filtered based on search results.
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" variant="contained">Download All <GetAppIcon className={classes.iconSpacing} /></Button>
            </CardActions>
          </Card>
        </div>
      </div>
      <Button
        onClick={() => setPageNumber((pageNumber + 1) % 50)}
      >
        Next page
      </Button>

      <Toolbar className={classes.searchContainer}>
        <SearchIcon className={classes.searchIcon} color="primary" fontSize="large" />
        <div className={classes.searchBarContainer}>
          <div className={classes.searchBar}>
            <InputBase
              className={classes.searchInput}
              placeholder="Search by Developer, Product, or CHPL ID..."
            />
            <Button className={classes.goButton} size="medium" variant="contained" color="primary">Go</Button>
          </div>
        </div>
        <Button fullWidth color="primary"><SgAdvancedSearch /></Button>
      </Toolbar>

      <TableContainer className={classes.container} component={Paper}>
        <Table
          stickyHeader
          aria-label="Real World Testing Collections table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={sortDescending ? 'desc' : 'asc'}
          />
          <TableBody>
            {getListings()
             .map((item) => (
               <TableRow key={item.id}>
                 <TableCell>{item.chplProductNumber}</TableCell>
                 <TableCell>{item.developer}</TableCell>
                 <TableCell>{item.product}</TableCell>
                 <TableCell>{item.version}</TableCell>
                 <TableCell>{item.apiDocumentation}</TableCell>
                 <TableCell>{item.rwtPlansUrl}</TableCell>
                 <TableCell>{item.rwtResultsUrl}</TableCell>
               </TableRow>
             ))}
            {emptyRows > 0 && false && (
              <TableRow style={{ height: 33 * emptyRows }}>
                <TableCell colSpan={headers.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      { /*
          <ChplPagination
          count={getListings().length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[2, 10, 50, 100, 250]}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          />
        */ }
      <Button
        onClick={() => csvExporter.generateCsv(getChangeRequests())}
      >
        Download
      </Button>
    </>
  );
}

export default ChplRealWorldTestingCollectionPage;

ChplRealWorldTestingCollectionPage.propTypes = {
};
