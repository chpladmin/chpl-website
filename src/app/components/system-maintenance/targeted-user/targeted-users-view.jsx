import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import {
  arrayOf,
  number,
  shape,
  string,
} from 'prop-types';
import { useSelector } from 'react-redux';

import { useFetchTargetedUsers } from 'api/standards';
import { ChplFilterLayout, ChplFilterSearchBar, useFilterContext } from 'components/filter';
import {
  ChplLoadingCards,
  ChplPagination,
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { certificationStatusOrder, compareCertificationStatuses, getStatusIcon } from 'services/listing.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

// Sorted on the server: `property` is the API's orderBy value
const sortOptions = [
  { property: 'NAME', text: 'Name' },
  { property: 'USAGE_COUNT', text: 'Total Listings' },
  { property: 'CREATION_DATE', text: 'Creation Date' },
];

const styles = {
  ...utilStyles,
  // Sit beside the card title and mirror its label and value styling, but only take the width they need
  narrowFields: {
    display: 'flex',
    gap: theme.spacing(3.5),
  },
  narrowField: {
    minWidth: '96px',
  },
  narrowLabel: {
    color: theme.palette.text.primary,
    fontSize: '0.85em',
    fontWeight: 600,
    lineHeight: 1.1,
  },
  narrowLabelRow: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '16px',
    paddingTop: theme.spacing(0.25),
  },
  narrowValue: {
    fontSize: '1.35em',
    fontWeight: 700,
    lineHeight: 1.25,
  },
};

const getStatusKey = (status) => `status-${status.id}`;

function ChplTargetedUsersView({ certificationStatuses: initialStatuses }) {
  const storageKey = 'storageKey-targetedUsersView';
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'NAME');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const [results, setResults] = useState([]);
  const apiKey = useSelector((state) => state.browserInfo.apiKey);
  const API = useSelector((state) => state.browserInfo.api);
  const { analytics } = useAnalyticsContext();
  const filterContext = useFilterContext();
  const query = filterContext.queryString();

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
    .sort((a, b) => compareCertificationStatuses(a.name, b.name)), [initialStatuses]);

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

  // Only statuses with listings, still in legend order, so a targeted user no listing uses has no status row at all
  const getStatusFieldGroups = (item) => {
    const fields = statuses
      .filter((status) => item[getStatusKey(status)] > 0)
      .map((status) => ({
        label: status.name,
        value: item[getStatusKey(status)],
        iconButton: certificationStatusOrder.includes(status.name) ? getStatusIcon(status) : undefined,
      }));
    return fields.length > 0 ? [fields] : [];
  };

  const getNarrowField = (label, value) => (
    <Box sx={styles.narrowField}>
      <Box sx={styles.narrowLabelRow}>
        <Typography sx={styles.narrowLabel}>{ label }</Typography>
      </Box>
      <Typography sx={styles.narrowValue}>{ value }</Typography>
    </Box>
  );

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Name..."
        sticky
        fadeBackground={palette.white}
      />
      <ChplFilterLayout>
        { isLoading && (<ChplLoadingCards title fieldGroups={[4]} actions={0} />)}
        { !isLoading
          && (
            <>
              <ChplSearchResultControls
                recordCount={recordCount}
                pageStart={pageStart}
                pageEnd={pageEnd}
                fadeBackground={palette.white}
              >
                <ChplSortControls
                  sortOptions={sortOptions}
                  orderBy={orderBy}
                  order={sortDescending ? 'desc' : 'asc'}
                  onSort={handleSort}
                />
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
              </ChplSearchResultControls>
              { targetedUsers
                .map((item) => (
                  <ChplSearchResultCard
                    key={item.id}
                    cardTitle="Targeted User"
                    cardTitleValue={item.name}
                    additionalTitleContent={(
                      <Box sx={styles.narrowFields}>
                        { getNarrowField('Total Listings', item.total) }
                        { getNarrowField('Creation Date', getDisplayDateFormat(item.creationDate)) }
                      </Box>
                    )}
                    fieldGroups={getStatusFieldGroups(item)}
                  />
                ))}
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
