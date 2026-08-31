import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  List,
  ListItem,
  makeStyles,
} from '@material-ui/core';
import { shape, string } from 'prop-types';
import { useSnackbar } from 'notistack';
import { NotificationsOutlined, SubscriptionsOutlined } from '@material-ui/icons';

import { useFetchAllSubscriptions, usePostGetDeliveredNotifications } from 'api/subscriptions';
import {
  ChplLink,
  ChplLoadingCards,
  ChplPagination,
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
} from 'components/util';
import {
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { palette, theme } from 'themes';

const sortOptions = [
  { property: 'subscriber_email', text: 'Email' },
  { property: 'creation_date', text: 'Creation Date' },
  { property: 'subscriber_role', text: 'Role' },
];

const useStyles = makeStyles({
  card: {
    overflow: 'visible',
  },
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
    backgroundColor: palette.background,
  },
  pageContent: {
    display: 'grid',
    gridTemplateRows: '3fr 1fr',
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'inset rgb(30 36 42 / 2%) -16px 0px 16px 0px',
    backgroundColor: palette.background,
    overflowWrap: 'anywhere',
    [theme.breakpoints.up('sm')]: {
      minWidth: '150px',
    },
  },
  tableContainer: {
    overflowWrap: 'normal',
    border: `.5px solid ${palette.divider}`,
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
    padding: '0 32px',
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
    eventTrack({
      event: 'Sort',
      category: analytics.category,
      label: property,
    });
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
    <Card className={classes.card}>
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
              className={classes.notificationsButton}
              endIcon={<NotificationsOutlined fontSize="small" />}
            >
              Get Delivered Notifications
            </Button>
          </Box>
        )}
      />
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <ChplFilterSearchBar
          sticky
          fadeBackground={palette.white}
          placeholder="Search by Subscriber Email or CHPL Product Number..."
        />
        <ChplFilterLayout>
          { isLoading && (<ChplLoadingCards />)}
          { !isLoading
          && (
            <>
              <ChplSearchResultControls
                recordCount={recordCount}
                pageStart={pageStart}
                pageEnd={pageEnd}
                fadeBackground={palette.white}
              >
                { subscriptions.length > 0
                  && (
                    <ChplSortControls
                      sortOptions={sortOptions}
                      orderBy={orderBy}
                      order={sortDescending ? 'desc' : 'asc'}
                      onSort={handleTableSort}
                    />
                  )}
              </ChplSearchResultControls>
              { subscriptions.length > 0
                && (
                  <>
                    <Box className={classes.resultsContainer}>
                      { subscriptions.map((item) => (
                        <ChplSearchResultCard
                          key={`${item.subscriberId}-${item.subscribedObjectId}`}
                          cardTitle="CHPL Product"
                          cardTitleValue={(
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
                              { label: 'Email', style: { flex: '2 1 320px' }, value: item.subscriberEmail },
                              { label: 'Creation Date', value: getDisplayDateFormat(item.creationDate) },
                            ],
                            [
                              { label: 'Role', style: { flex: '2 1 320px' }, value: item.subscriberRole },
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
        </ChplFilterLayout>
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
