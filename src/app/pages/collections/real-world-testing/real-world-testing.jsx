import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Paper,
  Snackbar,
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
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import GetAppIcon from '@material-ui/icons/GetApp';

import theme from '../../../themes/theme';
import {
  useFetchRealWorldTestingCollection,
} from '../../../api/collections';
import {
  ChplLink,
//  ChplPagination,
  ChplSortableHeaders,
} from '../../../components/util';

import { useFilterContext } from './filter-context';
import ChplFilterChips from './filter-chips';
import ChplFilterPanel from './filter-panel';
import ChplFilterSearchTerm from './filter-search-term';

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
  tableResultsHeaderContainer: {
    display: 'grid',
    gap: '8px',
    margin: '16px 32px',
    justifyContent: 'start',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto auto',
    },
  },
  resultsContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  wrap: {
    flexFlow: 'wrap',
  },
}));

function ChplRealWorldTestingCollectionPage() {
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useState('developer');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [recordCount, setRecordCount] = useState(0);
  const [sortDescending, setSortDescending] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const classes = useStyles();

  const filterContext = useFilterContext();
  const rwtQuery = useFetchRealWorldTestingCollection({
    orderBy: orderBy,
    pageNumber: pageNumber,
    pageSize: pageSize,
    sortDescending: sortDescending,
    query: filterContext.queryString(),
  });

  useEffect(() => {
    if (!rwtQuery.isSuccess) {
      setListings([]);
    } else {
      setListings(rwtQuery.data.results
                  .map((item) => ({
                    ...item,
                  })));
      setRecordCount(rwtQuery.data.recordCount);
    }
  }, [rwtQuery.isSuccess, rwtQuery.data?.results, rwtQuery.data?.recordCount]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = [
    { property: 'chpl_id', text: 'CHPL ID', sortable: true },
    { property: 'developer', text: 'Developer', sortable: true },
    { property: 'product', text: 'Product', sortable: true },
    { property: 'version', text: 'Version', sortable: true },
    { text: 'Status/Edition' },
    { text: 'Real World Testing Plans URL' },
    { text: 'Real World Testing Results URL' },
  ];

  const handleTableSort = (event, property, orderDirection) => {
    if (orderBy === property) {
      setSortDescending(!sortDescending);
    } else {
      setOrderBy(property);
    }
  };

  const toggleNotification = (open) => setNotificationOpen(open);

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

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
              <Button
                color="primary"
                variant="contained"
                onClick={() => toggleNotification(true)}
              >
                Download All
                {' ' }
                <GetAppIcon className={classes.iconSpacing} />
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
      <Toolbar className={classes.searchContainer}>
        <ChplFilterSearchTerm />
        <ChplFilterPanel />
      </Toolbar>

      <ChplFilterChips />

      { listings.length === 0 ?
        (
          <>No results found</>
        ) : (
          <>
            <div className={classes.tableResultsHeaderContainer}>
              <div className={`${classes.resultsContainer} ${classes.wrap}`}>
                <Typography variant='subtitle2'>Search Results:</Typography>
                <Typography variant='body2'>
                  {`(${pageStart}-${pageEnd} of ${recordCount} Results)`}
                </Typography>
              </div>
              <ButtonGroup size='small' className={classes.wrap}>
                <Button
                  color="secondary"
                  variant="contained"
                  fullWidth
                  onClick={() => toggleNotification(true)}
                >Download Results
                  <GetAppIcon className={classes.iconSpacing} />
                </Button>
              </ButtonGroup>
            </div>
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
                  {listings
                   .map((item) => (
                     <TableRow key={item.id}>
                       <TableCell>{item.chplProductNumber}</TableCell>
                       <TableCell>{item.developer}</TableCell>
                       <TableCell>{item.product}</TableCell>
                       <TableCell>{item.version}</TableCell>
                       <TableCell>{item.certificationStatus} / {item.edition} {item.curesUpdate ? 'Cures Update' : '' }</TableCell>
                       <TableCell>
                         {item.rwtPlansUrl &&
                          (
                            <ChplLink
                              href={item.rwtPlansUrl}
                              analytics={{ event: 'Navigation TBD', category: 'Category TBD', label: 'Label TBD' }}
                            />
                          )}
                       </TableCell>
                       <TableCell>
                         {item.rwtResultsUrl &&
                          (
                            <ChplLink
                              href={item.rwtResultsUrl}
                              analytics={{ event: 'Navigation TBD', category: 'Category TBD', label: 'Label TBD' }}
                            />
                          )}
                       </TableCell>
                     </TableRow>
                   ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              onClick={() => setPageNumber((pageNumber + 1) % 50)}
            >
              Next page
            </Button>
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
          </>
        )}
      <Snackbar
        open={notificationOpen}
        onClose={() => toggleNotification(false)}
        message="Download will be implemented at a later date"
      />
    </>
  );
}

export default ChplRealWorldTestingCollectionPage;

ChplRealWorldTestingCollectionPage.propTypes = {
};
