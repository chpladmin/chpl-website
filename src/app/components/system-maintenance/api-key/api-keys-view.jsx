import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { arrayOf, func, object } from 'prop-types';

import { useFetchApiKeyActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { resultCardSx, resultsHeaderSx } from 'components/system-maintenance/results-styles';
import { ChplSearchResultCard, ChplSearchResultControls, ChplSortControls } from 'components/util';
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

const styles = {
  ...utilStyles,
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

function ChplApiKeysView({ dispatch, apiKeys: initialApiKeys }) {
  const [apiKeys, setApiKeys] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('lastUsedDate', true);

  useEffect(() => {
    setApiKeys([...initialApiKeys].sort(sortComparator('lastUsedDate')));
  }, [initialApiKeys]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setApiKeys((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplSearchResultControls
        recordCount={apiKeys.length}
        pageStart={1}
        pageEnd={apiKeys.length}
        sticky={false}
        wrapActions
        sx={resultsHeaderSx}
      >
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
      </ChplSearchResultControls>
      <Box>
        {apiKeys.map((key) => (
          <ChplSearchResultCard
            sx={resultCardSx}
            key={key.key}
            cardTitle="User"
            cardTitleValue={key.name}
            fieldGroups={[
              [
                {
                  label: 'Email',
                  value: key.email,
                  flex: 1,
                  style: { flex: '2 1 320px' },
                },
                {
                  label: 'API Key',
                  value: key.key,
                  style: { flex: '2 1 320px' },
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
            actions={(
              <Button
                onClick={() => dispatch({ action: 'revoke', payload: key })}
                id={`revoke-api-key-${key.key}`}
                variant="contained"
                sx={styles.deleteButtonOutlined}
                size="small"
                endIcon={<DeleteIcon />}
              >
                Revoke key
              </Button>
            )}
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
