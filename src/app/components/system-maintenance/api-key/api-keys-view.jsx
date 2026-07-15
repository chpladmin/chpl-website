import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { arrayOf, func, object } from 'prop-types';

import { useFetchApiKeyActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { ChplSearchResultCard, ChplSortControls } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { getDisplayDateFormat } from 'services/date-util';
import { utilStyles } from 'themes';

const sortOptions = [
  { property: 'name', text: 'User' },
  { property: 'email', text: 'Email' },
  { property: 'key', text: 'API Key' },
  { property: 'lastUsedDate', text: 'Last Used' },
  { property: 'deleteWarningSentDate', text: 'Warning Sent' },
];

const useStyles = makeStyles({
  ...utilStyles,
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function ChplApiKeysView({ dispatch, apiKeys: initialApiKeys }) {
  const [apiKeys, setApiKeys] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('lastUsedDate', true);
  const classes = useStyles();

  useEffect(() => {
    setApiKeys(initialApiKeys.sort(sortComparator('lastUsedDate')));
  }, [initialApiKeys]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setApiKeys((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">
            API Keys
          </Typography>
          <Typography variant="body2">
            {`(${apiKeys.length} Result${apiKeys.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        <div className={classes.tableResultsHeaderContainer}>
          <Box display="flex" alignItems="center" gridGap={4}>
            <ChplSortControls
              sortOptions={sortOptions}
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
            <ChplSystemMaintenanceActivity
              fetch={useFetchApiKeyActivity}
              title="API Keys History"
            />
          </Box>
        </div>
      </Box>
      <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
        {apiKeys.map((key) => (
          <ChplSearchResultCard
            key={key.key}
            cardTitle="User"
            cardTitleValue={key.name}
            fieldGroups={[
              [
                {
                  label: 'Email',
                  value: key.email,
                },
                {
                  label: 'API Key',
                  value: key.key,
                },
                {
                  label: 'Last Used',
                  value: getDisplayDateFormat(key.lastUsedDate),
                },
                {
                  label: 'Warning Sent',
                  value: getDisplayDateFormat(key.deleteWarningSentDate),
                },
              ],
            ]}
            actions={
              <Button
                onClick={() => dispatch({ action: 'revoke', payload: key })}
                id={`revoke-api-key-${key.key}`}
                variant="contained"
                className={classes.deleteButtonOutlined}
                size="small"
                endIcon={<DeleteIcon />}
              >
                Revoke key
              </Button>
            }
          />
        ))}
      </Box>
    </>
  );
}

export default ChplApiKeysView;

ChplApiKeysView.propTypes = {
  apiKeys: arrayOf(object).isRequired,
  dispatch: func.isRequired,
};