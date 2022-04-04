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
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { arrayOf, func } from 'prop-types';

import { ChplSortableHeaders } from 'components/util';
import { jobType as jobType } from 'shared/prop-types';
import theme from 'themes/theme';

const headers = [
  { property: 'name', text: 'Job Name' },
  { property: 'description', text: 'Description' },
  { property: 'oncAcbSpecific', text: 'ONC-ACB Specific' },
  { property: 'jobType', text: 'Job Type' },
  { property: 'actions', text: 'Actions', invisible: true },
];

const useStyles = makeStyles({
  container: {
    maxHeight: '64vh',
  },
  cardSpacing: {
    marginTop: '32px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
  },
});

function ChplJobTypesView(props) {
  const { dispatch } = props;
  const [jobTypes, setJobTypes] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setJobTypes(props.jobTypes
            .sort((a, b) => (a.name < b.name ? -1 : 1))
            .map((job) => ({
              ...job,
              oncAcbSpecific: job.jobDataMap.acbSpecific ? 'Yes' : 'No',
              jobType: job.group === 'systemJobs' ? 'System Job' : 'User Job',
            })));
  }, [props.jobTypes]); // eslint-disable-line react/destructuring-assignment

  const handleClick = (job) => {
    console.log({job});
    // props.dispatch
  };

  return (
    <Card className={classes.cardSpacing}>
      <CardHeader title="Types of Jobs" />
      <CardContent>
        <TableContainer className={classes.container} component={Paper}>
          <Table
            aria-label="Types of Jobs table"
          >
            <ChplSortableHeaders
              headers={headers}
              onTableSort={() => {}}
              orderBy="email"
              order="asc"
              stickyHeader
            />
            <TableBody>
              { jobTypes
                .map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className={classes.firstColumn}>
                      { item.name }
                    </TableCell>
                    <TableCell>
                      { item.description }
                    </TableCell>
                    <TableCell>
                      { item.oncAcbSpecific }
                    </TableCell>
                    <TableCell>
                      { item.jobType }
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleClick(item)}
                        variant="contained"
                        color="primary"
                      >
                        Edit - extract as new JSX reponse
                        {' '}
                        <EditOutlinedIcon className={classes.iconSpacing} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default ChplJobTypesView;

ChplJobTypesView.propTypes = {
  jobTypes: arrayOf(jobType),
  dispatch: func,
};

ChplJobTypesView.defaultProps = {
  jobTypes: [],
  dispatch: () => {},
};
