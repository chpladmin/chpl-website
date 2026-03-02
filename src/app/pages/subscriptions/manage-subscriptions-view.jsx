import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
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
import { NotificationsOutlined, SubscriptionsOutlined } from '@material-ui/icons';

import { useFetchAllSubscriptions, usePostGetDeliveredNotifications } from 'api/subscriptions';
import {
  ChplLink,
  ChplPagination,
  ChplSearchResultCard,
  ChplSortControls,
} from 'components/util';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { theme } from 'themes';

const sortOptions = [
  { property: 'subscriber_email', text: 'Email' },
  { property: 'creation_date', text: 'Creation Date' },
  { property: 'subscriber_role', text: 'Role' },
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
    backgroundColor: '#f9f9f9',
  },
  pageContent: {
    display: 'grid',
    gridTemplateRows: '3fr 1fr',
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'inset rgb(30 36 42 / 2%) -16px 0px 16px 0px',
    backgroundColor: '#f9f9f9',
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
  listContainer: {
    fontSize: 'smaller',
    paddingY: '4px',
  },
  listItem: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  notificationsButton: {
    fontSize: '14px',
  },
});

function ChplManageSubscriptionsView({ analytics }) {
  const storageKey = 'storageKey-manageSubscriptionsView';
  const $analytics = getAngularService('$analytics');
  const { enqueueSnackbar } = useSnackbar();
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

  const handleTableSort = (property, orderDirection) => {
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
    <Card>
      <CardHeader
        style={{ paddingLeft: '16px' }}
        title={(
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <span>
              Subscriptions
              <SubscriptionsOutlined style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            </span>
            <Button
                  color="secondary"
                  variant="contained"
                  onClick={getDeliveredMessages}
                  className={classes.notificationsButton }
                  endIcon={<NotificationsOutlined fontSize="small" />}
                >
                  Get Delivered Notifications
            </Button>
          </Box>
        )}
      />
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <ChplFilterSearchBar
          placeholder="Search by Subscriber Email or CHPL Product Number..."
        />
        <div>
          <ChplFilterChips />
        </div>
        { isLoading
          && (
            <CircularProgress />
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
                { subscriptions.length > 0
                  && (
                    <ChplSortControls
                      sortOptions={sortOptions}
                      orderBy={orderBy}
                      order={sortDescending ? 'desc' : 'asc'}
                      onSort={handleTableSort}
                    />
                  )}
              </div>
              { subscriptions.length > 0
                && (
                  <>
                    <Box style={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto', padding: '0 32px' }}>
                      { subscriptions.map((item) => (
                        <ChplSearchResultCard
                          key={`${item.subscriberId}-${item.subscribedObjectId}`}
                          title="CHPL Product"
                          titleValue={(
                            <ChplLink
                              href={`#/listing/${item.subscribedObjectId}`}
                              text={item.subscribedObjectName}
                              analytics={{ event: 'Go to Listing Details Page', category: analytics.category, label: item.subscribedObjectName }}
                              external={false}
                              router={{ sref: 'listing', options: { id: item.subscribedObjectId } }}
                            />
                          )}
                          fieldGroups={[
                            [
                              { label: 'Email', value: item.subscriberEmail, xs: 12, sm: 6 },
                              { label: 'Creation Date', value: getDisplayDateFormat(item.creationDate), xs: 12, sm: 6 },
                            ],
                            [
                              { label: 'Role', value: item.subscriberRole, xs: 12, sm: 6 },
                              { 
                                label: 'Subscription Subjects', 
                                value: (
                                  <List className={classes.listContainer}>
                                    { item.subscriptionSubjects
                                      .sort((a, b) => (a < b ? -1 : 1))
                                      .map((sub) => (
                                        <ListItem className={classes.listItem} key={sub}>{ sub }</ListItem>
                                      ))}
                                  </List>
                                ),
                                xs: 12,
                                sm: 6
                              },
                            ],
                          ]}
                        />
                      ))}
                    </Box>
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
    </Card>
  );
}

export default ChplManageSubscriptionsView;

ChplManageSubscriptionsView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
