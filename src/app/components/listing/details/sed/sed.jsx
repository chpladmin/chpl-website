import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
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
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

import ChplSedDownload from './sed-download';

import { ChplHighlightCures, ChplLink } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat } from 'services/date-util';
import { listing as listingType } from 'shared/prop-types/listing';

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
  const $state = getAngularService('$state');
  const [hasSed, setHasSed] = useState(false);

  useEffect(() => {
    setHasSed(certificationResults.some((cr) => cr.success && cr.sed));
  }, [certificationResults]);

  const viewTask = (task) => {
    $state.go('.sedTask', { sedTaskId: task.id });
  };

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
          <CardHeader title="SED Summary"></CardHeader>        
          <CardContent>
          <Box display="flex" gridGap={8} flexDirection="row" flexWrap="wrap">
            <Box width="100%">
              <Typography variant="subtitle1">
                Full Usability Report
              </Typography>
              <Typography>
                {sedReportFileLocation
                  && (
                    <ChplLink
                      href={sedReportFileLocation}
                      analytics={{ event: 'Usability Report', category: 'Download Details', label: sedReportFileLocation }}
                    />
                  )}
                {!sedReportFileLocation && 'No report on file'}
              </Typography>
            </Box>
            <Box width="48%">
              <Typography variant="subtitle1">
                Description of Intended Users
              </Typography>
              <Typography>
                {sedIntendedUserDescription ?? 'N/A'}
              </Typography>
            </Box>
            <Box width="48%">
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
                {sed.ucdProcesses
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
        <Box display="flex" justifyContent="flex-end" pt={4} pr={4} pl={4}>
          <ChplSedDownload
            listing={listing}
          />
        </Box>
        <CardContent>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Task Rating and Scale Type</TableCell>
                  <TableCell>Certification Criteria</TableCell>
                  <TableCell><span className="sr-only">Actions</span></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sed.testTasks
                  .sort(sortTestTasks)
                  .map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        {task.description}
                      </TableCell>
                      <TableCell>
                        {task.taskRating}
                        {' '}
                        (
                        {task.taskRatingScale}
                        )
                      </TableCell>
                      <TableCell>
                        {task.criteria
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
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          endIcon={<VisibilityIcon />}
                          onClick={() => viewTask(task)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ChplSed;

ChplSed.propTypes = {
  listing: listingType.isRequired,
};
