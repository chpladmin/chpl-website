import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
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

import ChplSedDownload from './sed-download';
import ChplSedTaskView from './sed-task-view';

import { theme } from 'themes';
import { ChplHighlightCures, ChplLink } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { listing as listingType } from 'shared/prop-types/listing';

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
});

const sortTestTasks = (a, b) => (a.description < b.description ? -1 : 1);

const sortUcdProcesses = (a, b) => (a.name < b.name ? -1 : 1);

function ChplSed({ listing }) {
  const {
    certificationResults,
    sed,
    sedIntendedUserDescription,
    sedReportFileLocation,
    sedTestingEndDay,
  } = listing;
  const [hasSed, setHasSed] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setHasSed(certificationResults.some((cr) => cr.success && cr.sed));
  }, [certificationResults]);

  if (!hasSed) {
    return (
      <Typography variant="body1">
        No Certification Criteria were tested for SED.
      </Typography>
    );
  }

  return (
    <Box display="flex" gridGap={16} flexDirection="column">
      <Card>
        <CardHeader title="SED Summary" />
        <CardContent>
          <Box className={classes.dataContainer}>
            <Box width="100%">
              <Typography variant="subtitle1">
                Full Usability Report
              </Typography>
              <Typography>
                { sedReportFileLocation
                  && (
                    <ChplLink
                      href={sedReportFileLocation}
                      analytics={{ event: 'Usability Report', category: 'Download Details', label: sedReportFileLocation }}
                    />
                  )}
                {!sedReportFileLocation && 'No report on file'}
              </Typography>
            </Box>
            <Box className={classes.dataBox}>
              <Typography variant="subtitle1">
                Description of Intended Users
              </Typography>
              <Typography>
                {sedIntendedUserDescription ?? 'N/A'}
              </Typography>
            </Box>
            <Box className={classes.dataBox}>
              <Typography variant="subtitle1">
                Date SED Testing was Completed
              </Typography>
              <Typography>
                {getDisplayDateFormat(sedTestingEndDay)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="SED Tested Certification Criteria &amp; Associated UCD Processes" />
        <CardContent>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Certification Criteria</TableCell>
                  <TableCell>UCD Process</TableCell>
                  <TableCell>UCD Process Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { sed.ucdProcesses
                  .sort(sortUcdProcesses)
                  .map((ucd) => (
                    <TableRow key={ucd.id}>
                      <TableCell>
                        <List>
                          {ucd.criteria
                            .sort(sortCriteria)
                            .map((criterion) => (
                              <ListItem key={criterion.id}>
                                {criterion.removed && 'Removed | '}
                                {criterion.number}
                                :
                                {' '}
                                <ChplHighlightCures text={criterion.title} />
                              </ListItem>
                            ))}
                        </List>
                      </TableCell>
                      <TableCell>
                        {ucd.name}
                      </TableCell>
                      <TableCell>
                        {ucd.details}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="SED Testing Tasks" />
        <CardContent>
          <Box display="flex" justifyContent="flex-end" pb={4}>
            <ChplSedDownload
              listing={listing}
            />
          </Box>
          { sed.testTasks
            .sort(sortTestTasks)
            .map((task) => (
              <ChplSedTaskView
                key={task.id}
                listing={listing}
                task={task}
              />
            ))}
        </CardContent>
      </Card>
    </Box>
  );
}

export default ChplSed;

ChplSed.propTypes = {
  listing: listingType.isRequired,
};
