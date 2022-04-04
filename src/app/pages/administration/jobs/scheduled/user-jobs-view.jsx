import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
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
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { arrayOf, func } from 'prop-types';

import { ChplSortableHeaders } from 'components/util';
import { acb as acbPropType, job as jobPropType } from 'shared/prop-types';
import theme from 'themes/theme';

const headers = [
  { property: 'email', text: 'Email' },
  { property: 'details', text: 'Job details' },
  { property: 'actions', text: 'Actions', invisible: true },
];

const useStyles = makeStyles({
  container: {
    maxHeight: '64vh',
  },
  cardSpacing: {
    marginTop: '32px',
  },
  searchContainer: {
    backgroundColor: '#c6d5e5',
    padding: '16px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
  },
  tableResultsHeaderContainer: {
    display: 'grid',
    gap: '8px',
    marginBottom: '16px',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto auto',
    },
  },
  resultsContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  wrap: {
    flexFlow: 'wrap',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  tableFirstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
  },
  tableDeveloperCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  developerName: {
    fontWeight: '600',
  },
  noResultsContainer: {
    padding: '16px 32px',
  },
});

function ChplUserJobsView(props) {
  const { dispatch } = props;
  const [acbs, setAcbs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setJobs(props.jobs
            .sort((a, b) => (a.email < b.email ? -1 : 1))
            .map((job) => {
              const response = {
              ...job,
                details: ['Schedule: ' + job.cronSchedule, 'Type: ' + job.job.name],
              };
              if (job.acb) {
                let acbs = job.acb
                    .split(',')
                    .map((id) => parseInt(id, 10))
                    .map((id) => props.acbs.find((acb) => acb.id === id))
                    .map((acb) => `${acb.name} ${acb.retired ? ' (Retired)' : ''}`)
                    .sort((a, b) => a < b ? -1 : 1)
                    .join(', ');
                response.details.push('ONC-ACB' + (acbs.length !== 1 ? 's: ' : ': ') + acbs);
              }
              return response;
            }));
  }, [props.acbs, props.jobs]); // eslint-disable-line react/destructuring-assignment

  const handleClick = (job) => {
    console.log({job});
    // props.dispatch
  };

  return (
    <Card className={classes.cardSpacing}>
      <CardHeader title="Currently Scheduled User Jobs" />
      <CardContent>
        <>
          { (jobs.length === 0)
            && (
              <Typography className={classes.noResultsContainer}>
                No results found
              </Typography>
            )}
          { jobs.length > 0
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
                      { jobs
                        .map((item) => (
                          <TableRow key={item.name}>
                            <TableCell className={classes.tableFirstColumn}>
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
                              <Button
                                onClick={() => handleClick(item)}
                                variant="contained"
                                color="primary"
                              >
                                Edit
                                {' '}
                                <EditOutlinedIcon className={classes.iconSpacing} />
                              </Button>
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

export default ChplUserJobsView;

ChplUserJobsView.propTypes = {
  acbs: arrayOf(acbPropType),
  jobs: arrayOf(jobPropType),
  dispatch: func,
};

ChplUserJobsView.defaultProps = {
  acbs: [],
  jobs: [],
  dispatch: () => {},
};
