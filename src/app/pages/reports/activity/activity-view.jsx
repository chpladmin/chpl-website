import React, { useEffect, useState } from 'react';
import {
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

import ChplActivityDetails from './activity-details';

import { useFetchActivity } from 'api/questionable-activity';
import { ChplLink, ChplPagination } from 'components/util';
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  linkWrap: {
    overflowWrap: 'anywhere',
  },
  pageHeader: {
    padding: '32px',
    backgroundColor: '#ffffff',
  },
  pageBody: {
    display: 'grid',
    gridTemplateColumns: ' 1fr',
    gap: '16px',
    padding: '16px 32px',
    backgroundColor: '#f9f9f9',
  },
  pageContent: {
    display: 'grid',
    gridTemplateRows: '3fr 1fr',
  },
  searchContainer: {
    backgroundColor: palette.grey,
    padding: '16px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'auto 10fr auto',
    },
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
    overflowWrap: 'anywhere',
    [theme.breakpoints.up('sm')]: {
      minWidth: '275px',
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

function ChplActivityView(props) {
  const storageKey = 'storageKey-activity';
  const $analytics = getAngularService('$analytics');
  const { analytics } = props;
  const [activities, setActivities] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'activity_date');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, true);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchActivity({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setActivities([]);
      return;
    }
    setActivities(data.results.map((activity) => ({
      ...activity,
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading, analytics]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = [
    { property: 'username', text: 'User' },
    { property: 'concept', text: 'Concept' },
    { property: 'activity_date', text: 'Activity Date', sortable: true },
    { text: 'Description' },
    { text: 'Reason' },
    { text: 'CHPL Link' },
    { text: 'Actions', invisible: true },
  ];

  const getLink = (activity) => {
    if (![
      'CERTIFIED_PRODUCT',
      'DEVELOPER',
    ].includes(activity.concept)) {
      return null;
    }
    const before = JSON.parse(activity.before);
    const after = JSON.parse(activity.after);
    switch (activity.concept) {
      case 'CERTIFIED_PRODUCT':
        return (
          <ChplLink
            href={`#/listing/${activity.objectId}`}
            text={after.chplProductNumber}
            external={false}
            router={{ sref: 'listing', options: { id: activity.objectId } }}
            analytics={{
              event: 'Navigate to Listing',
              category: 'Activity Search',
            }}
          />
        );
      case 'DEVELOPER':
        if (before && after && before.id !== after.id) {
          return null;
        }
        return (
          <ChplLink
            href={`#/organizations/developers/${activity.objectId}`}
            text={after.name}
            analytics={{
              event: 'Navigate to Developer',
              category: 'Activity Search',
            }}
            external={false}
            router={{ sref: 'organizations.developers.developer', options: { id: activity.objectId } }}
          />
        );
      default:
        return null;
    }
  };

  const handleTableSort = (event, property, orderDirection) => {
    $analytics.eventTrack('Sort', { category: analytics.category, label: property });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">Activity</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <ChplFilterSearchBar
          placeholder="Search by Description or Reason..."
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
                  { activities.length === 0
                    && (
                      <Typography>
                        No results found
                      </Typography>
                    )}
                  { activities.length > 0
                    && (
                      <Typography variant="body2">
                        {`(${pageStart}-${pageEnd} of ${recordCount} Results)`}
                      </Typography>
                    )}
                </div>
              </div>
              { activities.length > 0
                && (
                  <>
                    <TableContainer className={classes.tableContainer} component={Paper}>
                      <Table
                        stickyHeader
                        aria-label="Activity table"
                      >
                        <ChplSortableHeaders
                          headers={headers}
                          onTableSort={handleTableSort}
                          orderBy={orderBy}
                          order={sortDescending ? 'desc' : 'asc'}
                          stickyHeader
                        />
                        <TableBody>
                          { activities
                            .map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{ item.username }</TableCell>
                                <TableCell>{ item.concept }</TableCell>
                                <TableCell>{ getDisplayDateFormat(item.activityDate) }</TableCell>
                                <TableCell>{ item.description }</TableCell>
                                <TableCell>{ item.reason }</TableCell>
                                <TableCell>{ getLink(item) }</TableCell>
                                <TableCell>
                                  <ChplActivityDetails activity={item} />
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

export default ChplActivityView;

ChplActivityView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
