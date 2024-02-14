import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';

import ChplSedDetailsEdit from './details';
import ChplSedTaskEdit from './sed-task-edit';
import ChplUcdProcessesEdit from './processes-edit';

import { ChplLink } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { ListingContext } from 'shared/contexts';
import { theme } from 'themes';

const useStyles = makeStyles({
  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexWrap: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      gap: '8px',
      flexWrap: 'wrap',
    },
  },
  dataBox: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '48%',
    },
  },
  tableScrolling: {
    overflowX: 'auto !important',
  },
});

const sortTestTasks = (a, b) => (a.description < b.description ? -1 : 1);

const sortUcdProcesses = (a, b) => (a.name < b.name ? -1 : 1);

function ChplSedEdit() {
  const { listing } = useContext(ListingContext);
  const classes = useStyles();

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Box display="flex" gridGap={16} flexDirection="column">
      <Card>
        <CardHeader title="SED Summary" />
        <CardContent>
          <ChplSedDetailsEdit />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="SED Tested Certification Criteria &amp; Associated UCD Processes" />
        <CardContent>
          <Card>
            <ChplUcdProcessesEdit />
          </Card>
        </CardContent>
      </Card>
      { (listing.edition === null || listing.edition.name === '2015')
        && (
          <Card>
            <CardHeader title="SED Testing Tasks" />
            <CardContent>
              { listing.sed.testTasks
                .sort(sortTestTasks)
                .map((task) => (
                  <ChplSedTaskEdit
                    key={task.id ?? task.uniqueId}
                    task={task}
                  />
                ))}
            </CardContent>
          </Card>
        )}
    </Box>
  );
}

export default ChplSedEdit;

ChplSedEdit.propTypes = {
};
