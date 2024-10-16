import React, { useEffect, useState } from 'react';
import {
  Button,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { shape, string } from 'prop-types';
import { useSnackbar } from 'notistack';
import { NotificationsOutlined } from '@material-ui/icons';

import { useFetchAllSubscriptions, usePostGetDeliveredNotifications } from 'api/subscriptions';
import {
  ChplLink,
  ChplPagination,
} from 'components/util';
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { theme } from 'themes';

const initialHeaders = [
  { property: 'subscriber_email', text: 'Email', sortable: true },
  { property: 'creation_date', text: 'Creation Date', sortable: true },
  { property: 'subscriber_role', text: 'Role', sortable: true },
  { text: 'Subject' },
];

const useStyles = makeStyles({
  linkWrap: {
    overflowWrap: 'anywhere',
  },
  pageHeader: {
    padding: '16px 32px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageBody: {
    display: 'grid',
    padding: '16px 32px',
    backgroundColor: '#f9f9f9',
  },
  pageContent: {
    display: 'grid',
    gridTemplateRows: '3fr 1fr',
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
    overflowWrap: 'anywhere',
    [theme.breakpoints.up('sm')]: {
      minWidth: '150px',
    },
  },
  tableContainer: {
    overflowWrap: 'normal',
    border: '.5px solid #c2c6ca',
    margin: '0px 32px',
    width: 'auto',
  },
  tableResultsHeaderContainer: {
    display: 'grid',
    gap: '8px',
    margin: '16px 32px',
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
});

function ChplManageSubscriptionsView({ analytics }) {
  const storageKey = 'storageKey-manageSubscriptionsView';
  const $analytics = getAngularService('$analytics');
  const { enqueueSnackbar } = useSnackbar();
  const [headers] = useState(initialHeaders);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'creation_date');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, true);
  const [recordCount, setRecordCount] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const { mutate } = usePostGetDeliveredNotifications();
  const classes = useStyles();

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchAllSubscriptions({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setSubscriptions([]);
      return;
    }
    setSubscriptions(data.results.map((subscription) => ({
      ...subscription,
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  const handleTableSort = (event, property, orderDirection) => {
    $analytics.eventTrack('Sort', { category: analytics.category, label: property });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const getDeliveredMessages = () => {
    mutate({}, {
      onSuccess: () => {
        const body = 'Please check your email for the report';
        enqueueSnackbar(body, { variant: 'success' });
      },
      onError: (error) => {
        console.error(error);
        const body = 'Error. Please check your credentials or contact the administrator';
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h3" component="h1">Subscriptions</Typography>
        <Button
          color="primary"
          variant="outlined"
          onClick={getDeliveredMessages}
          endIcon={<NotificationsOutlined />}
        >
          Get Delivered Notifications
        </Button>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <ChplFilterSearchBar
          placeholder="Search by Subscriber Email or CHPL Product Number..."
        />
        <div>
          <ChplFilterChips />
        </div>
        { isLoading
          && (
            <>Loading</>
          )}
        { !isLoading
          && (
            <>
              <div className={classes.tableResultsHeaderContainer}>
                <div className={`${classes.resultsContainer} ${classes.wrap}`}>
                  <Typography variant="subtitle2">Search Results:</Typography>
                  { subscriptions.length === 0
                    && (
                      <Typography>
                        No results found
                      </Typography>
                    )}
                  { subscriptions.length > 0
                    && (
                      <Typography variant="body2">
                        {`(${pageStart}-${pageEnd} of ${recordCount} Results)`}
                      </Typography>
                    )}
                </div>
              </div>
              { subscriptions.length > 0
                && (
                  <>
                    <TableContainer className={classes.tableContainer} component={Paper}>
                      <Table
                        stickyHeader
                        aria-label="Manage Subscriptions table"
                      >
                        <ChplSortableHeaders
                          headers={headers}
                          onTableSort={handleTableSort}
                          orderBy={orderBy}
                          order={sortDescending ? 'desc' : 'asc'}
                          stickyHeader
                        />
                        <TableBody>
                          { subscriptions
                            .map((item) => (
                              <TableRow key={`${item.subscriberId}-${item.subscribedObjectId}`}>
                                <TableCell className={classes.stickyColumn}>
                                  { item.subscriberEmail }
                                </TableCell>
                                <TableCell>
                                  { getDisplayDateFormat(item.creationDate) }
                                </TableCell>
                                <TableCell>
                                  { item.subscriberRole }
                                </TableCell>
                                <TableCell>
                                  <ChplLink
                                    href={`#/listing/${item.subscribedObjectId}`}
                                    text={item.subscribedObjectName}
                                    analytics={{ event: 'Go to Listing Details Page', category: analytics.category, label: item.subscribedObjectName }}
                                    external={false}
                                    router={{ sref: 'listing', options: { id: item.subscribedObjectId } }}
                                  />
                                  <List>
                                    { item.subscriptionSubjects
                                      .sort((a, b) => (a < b ? -1 : 1))
                                      .map((sub) => (
                                        <ListItem key={sub}>{ sub }</ListItem>
                                      ))}
                                  </List>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <ChplPagination
                      count={recordCount}
                      page={pageNumber}
                      rowsPerPage={pageSize}
                      rowsPerPageOptions={[25, 50, 100]}
                      setPage={setPageNumber}
                      setRowsPerPage={setPageSize}
                      analytics={analytics}
                    />
                  </>
                )}
            </>
          )}
      </div>
    </>
  );
}

export default ChplManageSubscriptionsView;

ChplManageSubscriptionsView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
