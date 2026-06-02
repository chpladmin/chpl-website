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
  ChplPageBody,
  ChplPageHeader,
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
    <>
      <ChplPageHeader
        text="Developers Under Certification Ban"
        subtitle={(
          <>
            This is a list of health IT developers currently precluded from certifying any health IT products under the ONC Health IT Certification Program, including new products as well as upgraded versions of current products.
            <br />
            Health IT products currently listed on the CHPL will maintain their listed certification status regardless of whether their developer is precluded from the program. Please consult your health IT product&apos;s details page to confirm its certification status by
            {' '}
            <ChplLink
              href="#/search"
              text="searching for the product"
              analytics={{
                ...analytics,
                event: 'Navigate to searching for the product',
              }}
              external={false}
              router={{ sref: 'search' }}
              inline
            />
            .
            <br />
            ONC may lift these statuses if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence. A developer may be precluded from certifying products for two reasons:
            <ol>
              <li>
                <strong>Developer Failure to Take Appropriate Corrective Action</strong>
                {' '}
                A developer may be precluded from the Program if the developer or one of its products fails to comply with any requirements of certification and the developer fails to take appropriate actions to correct the non-compliance.
              </li>
              <li>
                <strong>Product Withdrawn While Under Surveillance</strong>
                {' '}
                A developer may also be precluded if it fails to cooperate with the surveillance or other oversight of its certified products. ONC may lift the ban if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence.
              </li>
            </ol>
          </>
        )}
      />
      <ChplPageBody>
        <div id="main-content" tabIndex="-1">
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
      </ChplPageBody>
    </>
  );
}

export default ChplBannedDevelopersSearchView;

ChplBannedDevelopersSearchView.propTypes = {
};
