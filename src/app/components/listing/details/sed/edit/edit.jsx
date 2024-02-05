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
import ChplUcdProcessEdit from './process';

import { useFetchUcdProcesses } from 'api/standards';
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
  const { data, isLoading, isSuccess } = useFetchUcdProcesses();
  const [ucdProcessOptions, setUcdProcessOptions] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setUcdProcessOptions(data);
  }, [data, isLoading, isSuccess]);

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
            { listing.sed.ucdProcesses
              .sort(sortUcdProcesses)
              .map((ucd) => (
                <div key={ucd.id}>
                  <ChplUcdProcessEdit
                    ucdProcess={ucd}
                    ucdProcessOptions={ucdProcessOptions}
                  />
                </div>
              ))}
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
                  <Typography key={task.id ?? task.uniqueId}>
                    {task.id ?? task.uniqueId}
                  </Typography>
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
