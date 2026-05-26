import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { theme, utilStyles } from 'themes';
import {
  useFetchBannedDevelopers,
} from 'api/search';
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
import { eventTrack } from 'services/analytics.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';

const sortOptions = [
  { property: 'developer_name', text: 'Developer' },
  { property: 'decertification_date', text: 'Decertification Date' },
];

const useStyles = makeStyles({
  ...utilStyles,
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 158px)',
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
  resultsHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    marginBottom: '16px',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '16px 32px',
    backgroundColor: '#ffffff',
    boxShadow: `0px 2px 4px -1px ${theme.palette.grey[300]}, 0px 4px 5px 0px ${theme.palette.grey[300]}, 0px 1px 10px 0px ${theme.palette.grey[300]}`,
  },
  resultsContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  cardsContainer: {
    margin: '0px 24px',
  },
});

function ChplBannedDevelopersSearchView() {
  const storageKey = 'storageKey-bannedDevelopersView';
  const { analytics } = useAnalyticsContext();
  const [developers, setDevelopers] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer_name');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchBannedDevelopers({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
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
      oncAcbDisplay: developer.acbsForAllListings.map((acb) => acb.name).sort((a, b) => (a < b ? -1 : 1)).join(', '), // same question about "active"
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  const handleSort = (property, orderDirection) => {
    eventTrack({
      ...analytics,
      event: 'Sort Column',
      label: `${property} - ${orderDirection === 'desc' ? 'DESC' : 'ASC'}`,
    });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  return (
    <div className={classes.fixFooterSpacing}>
      <ChplFilterSearchBar
        placeholder="Search by Developer Name or Code..."
      />
      <div>
        <ChplFilterChips />
      </div>
      { isLoading
        && (
          <Box display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        )}
      { !isLoading
        && (
          <>
            <div className={classes.resultsHeaderContainer}>
              <div className={classes.resultsContainer}>
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
                  <ChplSortControls
                    sortOptions={sortOptions}
                    orderBy={orderBy}
                    order={sortDescending ? 'desc' : 'asc'}
                    onSort={handleSort}
                  />
                )}
            </div>
            { developers.length > 0
              && (
                <>
                  <Box className={classes.cardsContainer}>
                    { developers.map((item) => (
                      <ChplSearchResultCard
                        key={item.id}
                        cardTitle="Developer"
                        cardTitleValue={(
                          <ChplLink
                            href={`#/organizations/developers/${item.id}`}
                            text={item.name}
                            analytics={{
                              ...analytics,
                              event: 'Navigate to Developer Page',
                              label: item.name,
                            }}
                            external={false}
                            router={{ sref: 'organizations.developers.developer', options: { id: item.id } }}
                          />
                        )}
                        fieldGroups={[
                          [
                            {
                              label: 'Decertification Date',
                              value: item.decertificationDate,
                              xs: 12,
                              sm: 6,
                            },
                            {
                              label: 'ONC-ACB',
                              value: item.oncAcbDisplay,
                              xs: 12,
                              sm: 6,
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
                  />
                </>
              )}
          </>
        )}
    </div>
  );
}

export default ChplBannedDevelopersSearchView;

ChplBannedDevelopersSearchView.propTypes = {
};
