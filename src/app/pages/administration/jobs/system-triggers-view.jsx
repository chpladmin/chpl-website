import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Moment from 'react-moment';
import { arrayOf, func } from 'prop-types';

import { ChplSortableHeaders } from 'components/util';
import { scheduledSystemTrigger } from 'shared/prop-types';

const headers = [
  { property: 'name', text: 'Job Name' },
  { property: 'description', text: 'Description' },
  { property: 'nextRunDate', text: 'Next Run Date' },
  { property: 'triggerScheduleType', text: 'Trigger Schedule Type' },
  { property: 'actions', text: 'Actions' },
];

const useStyles = makeStyles({
  container: {
    maxHeight: '64vh',
  },
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
  },
  noResultsContainer: {
    padding: '16px 32px',
  },
});

const getAction = (item, dispatch) => {
  if (item.triggerScheduleType === 'ONE_TIME') {
    return (
      <IconButton
        onClick={() => dispatch({ action: 'edit', payload: item })}
        variant="contained"
        color="primary"
        aria-label={`Edit Job ${item.name}`}
      >
        <DeleteIcon />
      </IconButton>
    );
  }
  return null;
};

function ChplSystemTriggersView(props) {
  const { dispatch } = props;
  const [triggers, setTriggers] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setTriggers(props.triggers
      .sort((a, b) => (a.nextRunDate - b.nextRunDate))
      .map((trigger) => ({
        ...trigger,
        action: getAction(trigger, dispatch),
      })));
  }, [props.triggers, dispatch]); // eslint-disable-line react/destructuring-assignment

  return (
    <Card>
      <CardHeader title="Currently Scheduled System Jobs" />
      <CardContent>
        <>
          { (triggers.length === 0)
            && (
              <Typography className={classes.noResultsContainer}>
                No results found
              </Typography>
            )}
          { triggers.length > 0
            && (
              <TableContainer className={classes.container} component={Paper}>
                <Table
                  aria-label="Scheduled System Jobs table"
                >
                  <ChplSortableHeaders
                    headers={headers}
                    onTableSort={() => {}}
                    orderBy="name"
                    order="asc"
                    stickyHeader
                  />
                  <TableBody>
                    { triggers
                      .map((item) => (
                        <TableRow key={item.nextRunDate}>
                          <TableCell className={classes.firstColumn}>
                            { item.name }
                          </TableCell>
                          <TableCell>
                            { item.description }
                          </TableCell>
                          <TableCell>
                            { item.nextRunDate
                              ? (
                                <Moment
                                  fromNow
                                  withTitle
                                  titleFormat="DD MMM yyyy, h:mm a"
                                >
                                  {item.nextRunDate}
                                </Moment>
                              ) : (
                                <>In Progress</>
                              )}
                          </TableCell>
                          <TableCell>
                            { item.triggerScheduleType }
                          </TableCell>
                          <TableCell align="right">
                            { item.action }
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </>
      </CardContent>
    </Card>
  );
}

export default ChplSystemTriggersView;

ChplSystemTriggersView.propTypes = {
  triggers: arrayOf(scheduledSystemTrigger),
  dispatch: func.isRequired,
};

ChplSystemTriggersView.defaultProps = {
  triggers: [],
};
