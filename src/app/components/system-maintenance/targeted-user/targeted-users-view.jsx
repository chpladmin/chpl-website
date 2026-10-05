import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf, number, shape, string,
} from 'prop-types';

import { certificationStatuses as certificationStatusesFilter } from 'components/filter/filters';
import { ChplSearchResultCard, ChplSortControls } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { getStatusIcon } from 'services/listing.service';
import { targetedUserUsage as targetedUserUsagePropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

// Same order as the certification status filter and the status icon legend;
// anything the filter doesn't know about goes last
const statusOrder = certificationStatusesFilter.values.map((value) => value.value);
const getStatusOrder = (name) => (statusOrder.includes(name) ? statusOrder.indexOf(name) : statusOrder.length);
const getStatusKey = (status) => `status-${status.id}`;

// Ties, e.g. the many zero counts, fall back to name order
const compareBy = (property, descending) => (a, b) => {
  if (a[property] === b[property]) {
    return sortComparator('sortName')(a, b);
  }
  return sortComparator(property, descending)(a, b);
};

function ChplTargetedUsersView({ certificationStatuses: initialStatuses, targetedUsers: initialTargetedUsers }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('sortName');
  const classes = useStyles();

  const statuses = useMemo(() => [...initialStatuses]
    .sort((a, b) => getStatusOrder(a.name) - getStatusOrder(b.name) || (a.name < b.name ? -1 : 1)), [initialStatuses]);

  const targetedUsers = useMemo(() => initialTargetedUsers.map((targetedUser) => {
    const usage = targetedUser.usage ?? [];
    return {
      ...targetedUser,
      ...statuses.reduce((counts, status) => ({
        ...counts,
        [getStatusKey(status)]: usage
          .filter((entry) => entry.certificationStatus === status.name)
          .reduce((sum, entry) => sum + entry.listingCount, 0),
      }), {}),
      sortName: targetedUser.name.toLowerCase(),
      total: usage.reduce((sum, entry) => sum + entry.listingCount, 0),
    };
  }), [initialTargetedUsers, statuses]);

  // Statuses are matched by exact name, so a format mismatch with the status list would otherwise show as silent zeros
  useEffect(() => {
    if (statuses.length === 0) { return; }
    const names = statuses.map((status) => status.name);
    initialTargetedUsers
      .flatMap((targetedUser) => (targetedUser.usage ?? [])
        .filter((entry) => !names.includes(entry.certificationStatus))
        .map((entry) => ({ targetedUser: targetedUser.name, ...entry })))
      .forEach((unmatched) => console.warn('Targeted User usage has an unknown certification status', unmatched)); // eslint-disable-line no-console
  }, [initialTargetedUsers, statuses]);

  const sortOptions = useMemo(() => [
    { property: 'sortName', text: 'Name' },
    { property: 'total', text: 'Total Listings' },
    ...statuses.map((status) => ({ property: getStatusKey(status), text: status.name })),
  ], [statuses]);

  const sorted = useMemo(() => [...targetedUsers]
    .sort(compareBy(orderBy, order === 'desc')), [targetedUsers, orderBy, order]);

  const handleSort = (property, orderDirection) => {
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">
            Targeted Users
          </Typography>
          <Typography variant="body2">
            {`(${sorted.length} Result${sorted.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gridGap={4}>
          <ChplSortControls
            sortOptions={sortOptions}
            orderBy={orderBy}
            order={order}
            onSort={handleSort}
          />
        </Box>
      </Box>
      <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
        { sorted
          .map((item) => (
            <ChplSearchResultCard
              key={item.id}
              cardTitle="Targeted User"
              cardTitleValue={item.name}
              fieldGroups={[
                [{ label: 'Total Listings', value: item.total }],
                statuses.map((status) => ({
                  label: status.name,
                  value: item[getStatusKey(status)],
                  iconButton: statusOrder.includes(status.name) ? getStatusIcon(status) : undefined,
                })),
              ]}
            />
          ))}
      </Box>
    </>
  );
}

export default ChplTargetedUsersView;

ChplTargetedUsersView.propTypes = {
  certificationStatuses: arrayOf(shape({
    id: number,
    name: string,
  })).isRequired,
  targetedUsers: arrayOf(targetedUserUsagePropType).isRequired,
};
