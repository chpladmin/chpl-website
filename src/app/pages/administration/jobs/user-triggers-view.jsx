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
import EditIcon from '@material-ui/icons/Edit';
import { arrayOf, func } from 'prop-types';
import cronstrue from 'cronstrue';

import { ChplSortableHeaders } from 'components/util';
import { acb as acbType, trigger as triggerType } from 'shared/prop-types';

const headers = [
  { property: 'email', text: 'Email' },
  { property: 'details', text: 'Job details' },
  { property: 'actions', text: 'Actions', invisible: true },
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

function ChplUserTriggersView(props) {
  const { dispatch } = props;
  const [triggers, setTriggers] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setTriggers(props.triggers
      .sort((a, b) => (a.email < b.email ? -1 : 1))
      .map((trigger) => {
        const response = {
          ...trigger,
          details: [`Schedule: ${cronstrue.toString(trigger.cronSchedule, { verbose: true, dayOfWeekStartIndexZero: false })} (Note: time is in GMT)`, `Type: ${trigger.job.name}`],
        };
        if (trigger.acb) {
          const relevant = trigger.acb
            .split(',')
            .map((id) => parseInt(id, 10))
            .map((id) => props.acbs.find((acb) => acb.id === id))
            .map((acb) => `${acb.name}${acb.retired ? ' (Retired)' : ''}`)
            .sort((a, b) => (a < b ? -1 : 1))
            .join(', ');
          response.details.push(`ONC-ACB${relevant.length !== 1 ? 's: ' : ': '}${relevant}`);
        }
        return response;
      }));
  }, [props.acbs, props.triggers]); // eslint-disable-line react/destructuring-assignment

  return (
    <Card>
      <CardHeader title="Currently Scheduled User Jobs" />
      <CardContent>
        <>
          { (triggers.length === 0)
            && (
              <Typography className={classes.noResultsContainer}>
                No results found. To get started, select the type of job then click on the calender icon to set-up a schedule job.
              </Typography>
            )}
          { triggers.length > 0
            && (
            <TableContainer className={classes.container} component={Paper}>
              <Table
                aria-label="User Jobs table"
              >
                <ChplSortableHeaders
                  headers={headers}
                  onTableSort={() => {}}
                  orderBy="email"
                  order="asc"
                  stickyHeader
                />
                <TableBody>
                  { triggers
                    .map((item) => (
                      <TableRow key={`${item.name}-${item.job.name}`}>
                        <TableCell className={classes.firstColumn}>
                          { item.email }
                        </TableCell>
                        <TableCell>
                          <ul>
                            { item.details.map((detail) => (
                              <li key={detail}>{detail}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => dispatch({ action: 'edit', payload: item })}
                            color="primary"
                            aria-label={`Edit Job ${item.name}`}
                          >
                            <EditIcon />
                          </IconButton>
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

export default ChplUserTriggersView;

ChplUserTriggersView.propTypes = {
  acbs: arrayOf(acbType),
  dispatch: func,
  triggers: arrayOf(triggerType),
};

ChplUserTriggersView.defaultProps = {
  acbs: [],
  dispatch: () => {},
  triggers: [],
};
