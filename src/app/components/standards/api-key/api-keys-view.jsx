import React, { useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { arrayOf, func, object } from 'prop-types';

import { useFetchApiKeyActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { getDisplayDateFormat } from 'services/date-util';
import { utilStyles } from 'themes';

const headers = [
  { property: 'name', text: 'User', sortable: true },
  { property: 'email', text: 'Email', sortable: true },
  { property: 'key', text: 'API Key', sortable: true },
  { property: 'lastUsedDate', text: 'Last Used', sortable: true },
  { property: 'deleteWarningSentDate', text: 'Warning Sent', sortable: true },
  { text: 'Action', invisible: true },
];

const useStyles = makeStyles({
  ...utilStyles,
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#fff',
  },
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function ChplApiKeysView({ apiKeys: initialApiKeys, dispatch }) {
  const [apiKeys, setApiKeys] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('lastUsedDate', true);
  const classes = useStyles();

  useEffect(() => {
    setApiKeys(initialApiKeys.sort(sortComparator('lastUsedDate')));
  }, [initialApiKeys]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = apiKeys.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setApiKeys(updated);
  };

  return (
    <>
      <div className={classes.tableResultsHeaderContainer}>
        <ChplSystemMaintenanceActivity
          fetch={useFetchApiKeyActivity}
          title="API Keys History"
        />
      </div>
      <TableContainer component={Paper}>
        <Table
          aria-label="API Keys table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { apiKeys
              .map((key) => (
                <TableRow key={key.key}>
                  <TableCell className={classes.firstColumn}>{ key.name }</TableCell>
                  <TableCell>{ key.email }</TableCell>
                  <TableCell>{ key.key }</TableCell>
                  <TableCell>{ getDisplayDateFormat(key.lastUsedDate) }</TableCell>
                  <TableCell>{ getDisplayDateFormat(key.deleteWarningSentDate) }</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => dispatch({ action: 'revoke', payload: key })}
                      id={`revoke-api-key-${key.key}`}
                      variant="contained"
                      color="secondary"
                      endIcon={<DeleteIcon color="error" />}
                    >
                      Revoke key
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ChplApiKeysView;

ChplApiKeysView.propTypes = {
  apiKeys: arrayOf(object).isRequired,
  dispatch: func.isRequired,
};
