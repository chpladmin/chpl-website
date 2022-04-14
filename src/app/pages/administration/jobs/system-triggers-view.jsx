import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Moment from 'react-moment';
import { arrayOf } from 'prop-types';

import { ChplSortableHeaders } from 'components/util';
import { scheduledSystemTrigger } from 'shared/prop-types';

const headers = [
  { property: 'name', text: 'Job Name' },
  { property: 'description', text: 'Description' },
  { property: 'nextRunDate', text: 'Next Run Date' },
  { property: 'triggerScheduleType', text: 'Trigger Schedule Type' },
];

const useStyles = makeStyles({
  container: {
    maxHeight: '64vh',
  },
  cardSpacing: {
    marginTop: '32px',
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

function ChplSystemTriggersView(props) {
  const [triggers, setTriggers] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setTriggers(props.triggers
      .sort((a, b) => (a.nextRunDate - b.nextRunDate))
      .map((trigger) => ({
        ...trigger,
      })));
  }, [props.triggers]); // eslint-disable-line react/destructuring-assignment

  return (
    <Card className={classes.cardSpacing}>
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
};

ChplSystemTriggersView.defaultProps = {
  triggers: [],
};
