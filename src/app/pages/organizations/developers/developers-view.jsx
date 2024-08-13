import React, { useContext, useEffect, useState } from 'react';
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

import ChplMessaging from './messaging/messaging';

import { useFetchDevelopersBySearch } from 'api/developer';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { ChplLink, ChplPagination, ChplSortableHeaders } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
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

function ChplDevelopersView(props) {
  const storageKey = 'storageKey-developersView';
  const $analytics = getAngularService('$analytics');
  const API = getAngularService('API');
  const { getApiKey, getToken } = getAngularService('authService');
  const { analytics } = props;
  const { hasAnyRole } = useContext(UserContext);
  const { dispatch, queryString } = useFilterContext();
  const [developers, setDevelopers] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [messaging, setMessaging] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchDevelopersBySearch({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: queryString(),
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setDevelopers([]);
      return;
    }
    if (isLoading || !data.results) { return; }
    setDevelopers(data.results.map((developer) => ({
      ...developer,
      oncAcbDisplay: developer.acbsForActiveListings.map((acb) => acb.name).sort((a, b) => (a < b ? -1 : 1)).join(', '),
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  const headers = [
    { property: 'developer_name', text: 'Developer', sortable: true },
    { property: 'developer_code', text: 'Developer Code', sortable: true },
    { text: 'ONC-ACB for active Listings' },
  ];

  const downloadDevelopers = () => {
    let url = `${API}/developers/search/download?api_key=${getApiKey()}&${queryString()}`;
    if (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])) {
      url += `&authorization=Bearer%20${getToken()}`;
    }
    window.open(url);
  };

  const handleDispatch = () => {
    setMessaging(false);
  };

  const handleTableSort = (event, property, orderDirection) => {
    $analytics.eventTrack('Sort', { category: analytics.category, label: property });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const notYetPublishedAttestations = {
    display: 'Not Yet Published Attestations',
    toggle: () => {
      dispatch('resetAll');
      dispatch('toggle', { key: 'activeListingsOptions' }, { value: 'had_any_active_during_most_recent_past_attestation_period' });
      dispatch('toggle', { key: 'attestationsOptions' }, { value: 'has_not_published' });
      dispatch('toggleOperator', { key: 'activeListingsOptions', operator: 'and' });
    },
  };

  const notYetSubmittedAttestations = {
    display: 'Not Yet Submitted Attestations',
    toggle: () => {
      dispatch('resetAll');
      dispatch('toggle', { key: 'activeListingsOptions' }, { value: 'had_any_active_during_most_recent_past_attestation_period' });
      dispatch('toggle', { key: 'attestationsOptions' }, { value: 'has_not_submitted' });
      dispatch('toggleOperator', { key: 'activeListingsOptions', operator: 'and' });
    },
  };

  const bonusQuickFilters = [notYetPublishedAttestations, notYetSubmittedAttestations];

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  if (messaging) {
    return (
      <ChplMessaging
        dispatch={handleDispatch}
      />
    );
  }

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">
          Developers
        </Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <ChplFilterSearchBar
          hideQuickFilters
          placeholder="Search by Developer Name or Code..."
          toggleMultipleFilters={bonusQuickFilters}
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
                  { developers.length === 0
                    && (
                      <Typography>
                        No results found
                      </Typography>
                    )}
                  { developers.length > 0
                    && (
                      <Typography variant="body2">
                        {`(${pageStart}-${pageEnd} of ${recordCount} Results)`}
                      </Typography>
                    )}
                </div>
                { developers.length > 0
                  && (
                    <div>
                      <Button
                        onClick={downloadDevelopers}
                        id="download-developers"
                        variant="outlined"
                        color="primary"
                      >
                        Download information for
                        {' '}
                        { recordCount }
                        {' '}
                        {`Developer${recordCount !== 1 ? 's' : ''}`}
                      </Button>
                      { hasAnyRole(['chpl-admin', 'chpl-onc'])
                        && (
                          <Button
                            onClick={() => setMessaging(true)}
                            id="compose-message"
                            variant="outlined"
                            color="primary"
                          >
                            Send message to
                            {' '}
                            { recordCount }
                            {' '}
                            {`Developer${recordCount !== 1 ? 's' : ''}`}
                          </Button>
                        )}
                    </div>
                  )}
              </div>
              { developers.length > 0
                && (
                  <>
                    <TableContainer className={classes.tableContainer} component={Paper}>
                      <Table
                        stickyHeader
                        aria-label="Developers Under Certification Ban table"
                      >
                        <ChplSortableHeaders
                          headers={headers}
                          onTableSort={handleTableSort}
                          orderBy={orderBy}
                          order={sortDescending ? 'desc' : 'asc'}
                          stickyHeader
                        />
                        <TableBody>
                          { developers
                            .map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className={classes.stickyColumn}>
                                  <strong>
                                    <ChplLink
                                      href={`#/organizations/developers/${item.id}`}
                                      text={item.name}
                                      analytics={{ event: 'Go to Developer Details Page', category: analytics.category, label: item.name }}
                                      external={false}
                                      router={{ sref: 'organizations.developers.developer', options: { id: item.id } }}
                                    />
                                  </strong>
                                </TableCell>
                                <TableCell>
                                  { item.code }
                                </TableCell>
                                <TableCell>
                                  { item.oncAcbDisplay }
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

export default ChplDevelopersView;

ChplDevelopersView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
