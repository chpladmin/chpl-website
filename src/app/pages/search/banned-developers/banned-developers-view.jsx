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

import { theme, utilStyles } from 'themes';
import {
  useFetchBannedDevelopers,
} from 'api/search';
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
import { eventTrack } from 'services/analytics.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';

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

function ChplBannedDevelopersSearchView() {
  const storageKey = 'storageKey-bannedDevelopersView';
  const { analytics } = useAnalyticsContext();
  const [developers, setDevelopers] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
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

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = [
    { property: 'developer_name', text: 'Developer', sortable: true },
    { property: 'decertification_date', text: 'Decertification Date', sortable: true, reverseDefault: true },
    { text: 'ONC-ACB' },
  ];

  const handleTableSort = (event, property, orderDirection) => {
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
      <div className={classes.pageHeader}>
        <Typography variant="h1">
          Developers Under Certification Ban
        </Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <div>
          <Typography variant="body1" gutterBottom>
            This is a list of health IT developers currently precluded from certifying any health IT products under the ONC Health IT Certification Program - including new products as well as upgraded versions of current products. ONC may lift these statuses if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence. A developer may be precluded from certifying products for two reasons:
          </Typography>
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
          <Typography variant="body1">
            Health IT products currently listed on the CHPL will maintain their listed certification status regardless of whether their developer is precluded from the program. Please consult your health IT product’s details page to confirm its certification status by
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
          </Typography>
        </div>
      </div>
      <ChplFilterSearchBar
        placeholder="Search by Developer Name or Code..."
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
                                    analytics={{
                                      ...analytics,
                                      event: 'Navigate to Developer Page',
                                      label: item.name,
                                    }}
                                    external={false}
                                    router={{ sref: 'organizations.developers.developer', options: { id: item.id } }}
                                  />
                                </strong>
                              </TableCell>
                              <TableCell>
                                { item.decertificationDate }
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
                  />
                </>
              )}
          </>
        )}
    </>
  );
}

export default ChplBannedDevelopersSearchView;

ChplBannedDevelopersSearchView.propTypes = {
};
