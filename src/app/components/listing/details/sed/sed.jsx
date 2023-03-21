import React, { useEffect, useState } from 'react';
import {
  Card,
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
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

import { ChplLink, ChplTooltip } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { listing as listingType } from 'shared/prop-types/listing';

const useStyles = makeStyles({
  helperText: {
    padding: '16px 0',
  },
  disabledRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
});

const sortTestTasks = (a, b) => a.description < b.description ? -1 : 1;

const sortUcdProcesses = (a, b) => a.name < b.name ? -1 : 1;

function ChplSed({ listing }) {
  const {
    sed,
    sedIntendedUserDescription,
    sedReportFileLocation,
    sedTestingEndDay,
  } = listing;
  const classes = useStyles();

  return (
    <>
      <Card>
        <Typography>
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
          { !sedReportFileLocation && 'No report on file'}
        </Typography>
        <Typography>
          Description of Intended Users
        </Typography>
        <Typography>
          { sedIntendedUserDescription ?? 'N/A' }
        </Typography>
        <Typography>
          Date SED Testing was Completed
        </Typography>
        <Typography>
          { getDisplayDateFormat(sedTestingEndDay) }
        </Typography>
      </Card>
      <Card>
        <CardHeader title="SED Tested Certification Criteria &amp; Associated UCD Processes" />
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
                           { criterion.removed && 'Removed | ' }
                           { criterion.number }: { criterion.title }
                         </ListItem>
                       ))}
                    </List>
                  </TableCell>
                  <TableCell>
                    { ucd.name }
                  </TableCell>
                  <TableCell>
                    { ucd.details }
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
      <Card>
        <CardHeader title="SED Testing Tasks" />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Task Rating and Scale Type</TableCell>
              <TableCell>Certification Criteria</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { sed.testTasks
              .sort(sortTestTasks)
              .map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    { task.description }
                  </TableCell>
                  <TableCell>
                    { task.taskRating } ({ task.taskRatingScale })
                  </TableCell>
                  <TableCell>
                    {task.criteria
                     .sort(sortCriteria)
                     .map((criterion) => (
                       <ListItem key={criterion.id}>
                         { criterion.removed && 'Removed | ' }
                         { criterion.number }: { criterion.title }
                       </ListItem>
                     ))}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

export default ChplSed;

ChplSed.propTypes = {
  listing: listingType.isRequired,
};
