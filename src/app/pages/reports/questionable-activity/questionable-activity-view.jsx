import React, { useEffect, useState } from 'react';
import {
  Button,
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

import { useFetchQuestionableActivity } from 'api/questionable-activity';
import ChplActivityDetails from 'components/activity/activity-details';
import {
  ChplLink,
  ChplPagination,
} from 'components/util';
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import {
  ChplFilterChips,
  ChplFilterPanel,
  ChplFilterSearchTerm,
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

function ChplQuestionableActivityView(props) {
  const storageKey = 'storageKey-questionableActivity';
  const $analytics = getAngularService('$analytics');
  const API = getAngularService('API');
  const authService = getAngularService('authService');
  const { analytics } = props;
  const [activities, setActivities] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'activity_date');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, true);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchQuestionableActivity({
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

  useEffect(() => {
    setDownloadLink(`${API}/questionable-activity/download?api_key=${authService.getApiKey()}&authorization=Bearer%20${authService.getToken()}`);
  }, [API, authService]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = [
    { property: 'developer', text: 'Developer', sortable: true },
    { property: 'product', text: 'Product', sortable: true },
    { text: 'Version' },
    { property: 'chpl_product_number', text: 'CHPL ID', sortable: true },
    { text: 'Activity' },
    { property: 'activity_date', text: 'Activity Date', sortable: true },
    { text: 'Reason' },
    { text: 'Actions', invisible: true },
  ];

  const handleClick = () => {
    $analytics.eventTrack('Download Filtered results', { category: analytics.category });
    window.open(`${downloadLink}&${filterContext.queryString()}`);
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
        <Typography variant="h1">Questionable Activity</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <div>
          <Typography variant="body1" gutterBottom>
            This list includes all 2015 Edition, including Cures Update, health IT products that have been certified with Safety Enhanced Design (SED):
          </Typography>
          <Typography variant="body1">
            Please note that by default, only listings that are active or suspended are shown in the search results.
          </Typography>
        </div>
      </div>
      <div className={classes.searchContainer}>
        <ChplFilterSearchTerm />
        <ChplFilterPanel />
      </div>
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
              { activities.length > 0
                && (
                  <Button
                    color="secondary"
                    variant="contained"
                    size="small"
                    id="download-filtered-results"
                    onClick={handleClick}
                  >
                    Download Filtered Results
                  </Button>
                )}
            </div>
            { activities.length > 0
              && (
                <>
                  <TableContainer className={classes.tableContainer} component={Paper}>
                    <Table
                      stickyHeader
                      aria-label="Questionable Activity table"
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
                              <TableCell>
                                { item.developerId
                                  && (
                                    <ChplLink
                                      href={`#/organizations/developers/${item.developerId}`}
                                      text={item.developerName}
                                      analytics={{ event: 'Go to Developer Page', category: analytics.category, label: item.developerName }}
                                      external={false}
                                      router={{ sref: 'organizations.developers.developer', options: { id: item.developerId } }}
                                    />
                                  )}
                              </TableCell>
                              <TableCell>{item.productName}</TableCell>
                              <TableCell>{item.versionName}</TableCell>
                              <TableCell>
                                { item.listingId
                                  && (
                                  <ChplLink
                                    href={`#/listing/${item.listingId}`}
                                    text={item.chplProductNumber}
                                    analytics={{ event: 'Go to Listing Details Page', category: analytics.category, label: item.chplProductNumber }}
                                    external={false}
                                    router={{ sref: 'listing', options: { id: item.listingId } }}
                                  />
                                  )}
                              </TableCell>
                              <TableCell>{item.triggerName}</TableCell>
                              <TableCell>{ getDisplayDateFormat(item.activityDate) }</TableCell>
                              <TableCell>
                                { item.reason
                                  && (
                                    <Typography>
                                      {item.reason}
                                    </Typography>
                                  )}
                                { item.certificationStatusChangeReason
                                  && (
                                    <Typography>
                                      {item.certificationStatusChangeReason}
                                    </Typography>
                                  )}
                              </TableCell>
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
    </>
  );
}

export default ChplQuestionableActivityView;

ChplQuestionableActivityView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
