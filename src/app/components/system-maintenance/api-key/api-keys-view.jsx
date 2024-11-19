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
    boxShadow: 'inset rgb(30 36 42 / 2%) -16px 0px 16px 0px',
    backgroundColor: '#f9f9f9',
    zIndex: 1,
    maxWidth: 100, 
    overflowWrap:'anywhere', 
  },
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    border: '1px solid #c44f65',
    backgroundColor: '#ffffff',
    color: '#c44f65',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  container: {
    maxWidth: '1280px',
    overflowX: 'auto',
  }
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
      <Paper className={classes.container}>
        <TableContainer>
          <Table aria-label="API Keys table">
            <ChplSortableHeaders
              headers={headers}
              onTableSort={handleTableSort}
              orderBy={orderBy}
              order={order}
              stickyHeader
            />
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.key}>
                  <TableCell className={classes.firstColumn}>{key.name}</TableCell>
                  <TableCell style={{ maxWidth: 100, overflowWrap:'anywhere' }}>{key.email}</TableCell>
                  <TableCell style={{ maxWidth: 100, overflowWrap:'anywhere' }}>{key.key}</TableCell>
                  <TableCell style={{ maxWidth: 50, overflowWrap:'anywhere' }}>{getDisplayDateFormat(key.lastUsedDate)}</TableCell>
                  <TableCell style={{ maxWidth: 70, overflowWrap:'anywhere' }}>{getDisplayDateFormat(key.deleteWarningSentDate)}</TableCell>
                  <TableCell style={{ overflowWrap:'anywhere' }} align="left">
                    <Button
                      onClick={() => dispatch({ action: 'revoke', payload: key })}
                      id={`revoke-api-key-${key.key}`}
                      variant="contained"
                      className={classes.deleteButton}
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
      </Paper>
    </>
  );
}

ChplApiKeysView.propTypes = {
  apiKeys: arrayOf(object).isRequired,
  dispatch: func.isRequired,
};

export default ChplApiKeysView;
