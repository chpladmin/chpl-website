import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import {
  arrayOf, number, shape, string,
} from 'prop-types';
import { useSelector } from 'react-redux';

import { useFetchTargetedUsers } from 'api/standards';
import {
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { certificationStatuses as certificationStatusesFilter } from 'components/filter/filters';
import { ChplPagination, ChplSearchResultCard, ChplSortControls } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { getStatusIcon } from 'services/listing.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

// Sorted on the server: `property` is the API's orderBy value
const sortOptions = [
  { property: 'NAME', text: 'Name' },
  { property: 'USAGE_COUNT', text: 'Total Listings' },
  { property: 'CREATION_DATE', text: 'Creation Date' },
];

// Same order as the certification status filter and the status icon legend;
// anything the filter doesn't know about goes last
const statusOrder = certificationStatusesFilter.values.map((value) => value.value);
const getStatusOrder = (name) => (statusOrder.includes(name) ? statusOrder.indexOf(name) : statusOrder.length);
const getStatusKey = (status) => `status-${status.id}`;

function ChplTargetedUsersView({ certificationStatuses: initialStatuses }) {
  const storageKey = 'storageKey-targetedUsersView';
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'NAME');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const [results, setResults] = useState([]);
  // An experiment for team feedback, so deliberately not persisted anywhere
  const [showZeroCounts, setShowZeroCounts] = useState(true);
  const apiKey = useSelector((state) => state.browserInfo.apiKey);
  const API = useSelector((state) => state.browserInfo.api);
  const { analytics } = useAnalyticsContext();
  const filterContext = useFilterContext();
  const query = filterContext.queryString();
  const classes = {};

  // `isPreviousData`: the request changed and the old results are still on screen until it answers
  const {
    data, isError, isLoading, isPreviousData,
  } = useFetchTargetedUsers({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query,
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setResults([]);
      setRecordCount(0);
      return;
    }
    setResults(data.results);
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  // A new search, sort or page size starts again from the first page. Skipped
  // on mount, so a page remembered from earlier in the session is kept
  const resetKey = `${query}|${orderBy}|${sortDescending}|${pageSize}`;
  const lastResetKey = useRef(resetKey);
  useEffect(() => {
    if (lastResetKey.current === resetKey) { return; }
    lastResetKey.current = resetKey;
    setPageNumber(0);
  }, [resetKey, setPageNumber]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length, setPageNumber]);

  const statuses = useMemo(() => [...initialStatuses]
    .sort((a, b) => getStatusOrder(a.name) - getStatusOrder(b.name) || (a.name < b.name ? -1 : 1)), [initialStatuses]);

  const targetedUsers = useMemo(() => results.map((targetedUser) => {
    const usage = targetedUser.usage ?? [];
    return {
      ...targetedUser,
      ...statuses.reduce((counts, status) => ({
        ...counts,
        [getStatusKey(status)]: usage
          .filter((entry) => entry.certificationStatus === status.name)
          .reduce((sum, entry) => sum + entry.listingCount, 0),
      }), {}),
      // The same sum the server sorts USAGE_COUNT by
      total: usage.reduce((sum, entry) => sum + entry.listingCount, 0),
    };
  }), [results, statuses]);

  // Statuses are matched by exact name, so a format mismatch with the status list would otherwise show as silent zeros
  useEffect(() => {
    if (statuses.length === 0) { return; }
    const names = statuses.map((status) => status.name);
    results
      .flatMap((targetedUser) => (targetedUser.usage ?? [])
        .filter((entry) => !names.includes(entry.certificationStatus))
        .map((entry) => ({ targetedUser: targetedUser.name, ...entry })))
      .forEach((unmatched) => console.warn('Targeted User usage has an unknown certification status', unmatched)); // eslint-disable-line no-console
  }, [results, statuses]);

  // Every match, not just this page. The data is public, so the API key is enough
  const downloadTargetedUsers = () => {
    eventTrack({
      ...analytics,
      event: 'Download Targeted Users',
      label: recordCount,
    });
    window.open(`${API}/targeted-users/download?api_key=${apiKey}&${query}`);
  };

  const handleSort = (property, orderDirection) => {
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  // With the zero counts hidden, a targeted user no listing uses has no status row at all
  const getStatusFieldGroups = (item) => {
    const fields = statuses
      .filter((status) => showZeroCounts || item[getStatusKey(status)] > 0)
      .map((status) => ({
        label: status.name,
        value: item[getStatusKey(status)],
        iconButton: statusOrder.includes(status.name) ? getStatusIcon(status) : undefined,
      }));
    return fields.length > 0 ? [fields] : [];
  };

  const getNarrowField = (label, value) => (
    <Box className={classes.narrowField}>
      <Box className={classes.narrowLabelRow}>
        <Typography className={classes.narrowLabel}>{ label }</Typography>
      </Box>
      <Typography className={classes.narrowValue}>{ value }</Typography>
    </Box>
  );

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Name..."
      />
      <ChplFilterLayout>
        { isLoading && <CircularProgress /> }
        { !isLoading
          && (
            <>
              <Box className={classes.headerContainer}>
                <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
                  { isPreviousData && <CircularProgress size={20} /> }
                  {/* Same wording as ChplSearchResultControls on the other search pages */}
                  { !isPreviousData
                    && (
                      <>
                        <Typography variant="subtitle2">Search Results:</Typography>
                        { recordCount === 0
                          && (
                            <Typography>
                              No results found
                            </Typography>
                          )}
                        { recordCount > 0
                          && (
                            <Typography variant="body2">
                              {`(${pageStart}-${pageEnd} of ${recordCount} Results)`}
                            </Typography>
                          )}
                      </>
                    )}
                </Box>
                <Box display="flex" alignItems="center" gridGap={4}>
                  <FormControlLabel
                    control={(
                      <Switch
                        id="targeted-users-show-zero-counts"
                        color="primary"
                        checked={showZeroCounts}
                        onChange={() => setShowZeroCounts((prev) => !prev)}
                      />
                    )}
                    label="Show statuses with no listings"
                  />
                  <ChplSortControls
                    sortOptions={sortOptions}
                    orderBy={orderBy}
                    order={sortDescending ? 'desc' : 'asc'}
                    onSort={handleSort}
                  />
                  { recordCount > 0
                    && (
                      <Button
                        onClick={downloadTargetedUsers}
                        id="download-targeted-users"
                        disabled={isPreviousData}
                        variant="outlined"
                        color="primary"
                        endIcon={<CloudDownloadOutlinedIcon />}
                      >
                        Download information for
                        {' '}
                        { recordCount }
                        {' '}
                        {`Targeted User${recordCount !== 1 ? 's' : ''}`}
                      </Button>
                    )}
                </Box>
              </Box>
              <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
                { targetedUsers
                  .map((item) => (
                    <ChplSearchResultCard
                      key={item.id}
                      cardTitle="Targeted User"
                      cardTitleValue={item.name}
                      additionalTitleContent={(
                        <Box className={classes.narrowFields}>
                          { getNarrowField('Total Listings', item.total) }
                          { getNarrowField('Creation Date', getDisplayDateFormat(item.creationDate)) }
                        </Box>
                      )}
                      fieldGroups={getStatusFieldGroups(item)}
                    />
                  ))}
              </Box>
              { recordCount > 0
                && (
                  <ChplPagination
                    count={recordCount}
                    page={pageNumber}
                    rowsPerPage={pageSize}
                    rowsPerPageOptions={[25, 50, 100]}
                    setPage={setPageNumber}
                    setRowsPerPage={setPageSize}
                  />
                )}
            </>
          )}
      </ChplFilterLayout>
    </>
  );
}

export default ChplTargetedUsersView;

ChplTargetedUsersView.propTypes = {
  certificationStatuses: arrayOf(shape({
    id: number,
    name: string,
  })).isRequired,
};
