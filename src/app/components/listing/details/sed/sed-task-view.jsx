import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { object } from 'prop-types';

import ChplSedTaskParticipantsView from './sed-task-participants-view';

import { ChplHighlightCures } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { palette, utilStyles, theme } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  accordion: {
    borderRadius: '4px',
    display: 'grid',
    borderColor: palette.divider,
    borderWidth: '.5px',
    borderStyle: 'solid',
  },
  accordionSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    padding: '0 4px',
    borderBottom: `.5px solid ${palette.divider}`,
  },
  summaryText: {
    textTransform: 'none',
  },
  accordionDetails: {
    borderRadius: '0 0 8px 8px',
  },
  taskData: {
    display: 'grid',
    flexDirection: 'column',
    gridTemplateColumns: '1fr',
    gridGap: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
});

const makeRounded = (val) => Math.round(val * 1000) / 1000;

const makePercentage = (val) => `${makeRounded(val * 100)}%`;

function ChplSedTaskView({ task: initialTask }) {
  const [expanded, setExpanded] = useState(false);
  const [meanExperience, setMeanExperience] = useState(0);
  const [task, setTask] = useState(undefined);
  const [occupations, setOccupations] = useState([]);
  const classes = useStyles();

  const getIcon = () => (expanded
    ? (
      <>
        <Typography color="primary" variant="body2">Hide Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" className={classes.rotate} />
      </>
    )
    : (
      <>
        <Typography color="primary" variant="body2">Show Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" />
      </>
    ));

  useEffect(() => {
    if (!initialTask) { return; }
    setTask(initialTask);
    setMeanExperience(makeRounded(initialTask.testParticipants.reduce((sum, participant) => sum + participant.productExperienceMonths, 0) / initialTask.testParticipants.length));
    const occupationsObj = initialTask.testParticipants.reduce((obj, participant) => {
      if (!obj[participant.occupation]) {
        return {
          ...obj,
          [participant.occupation]: 1,
        };
      }
      return {
        ...obj,
        [participant.occupation]: obj[participant.occupation] + 1,
      };
    }, {});
    setOccupations(Object
      .entries(occupationsObj)
      .map(([key, value]) => ({
        name: key,
        count: value,
        percentage: makePercentage(value / initialTask.testParticipants.length),
      }))
      .sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [initialTask]);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  if (!task) { return null; }

  return (
    <Accordion
      className={classes.accordion}
      onChange={handleAccordionChange}
      id={`task-id-${task.id}`}
    >
      <AccordionSummary
        className={classes.accordionSummary}
        expandIcon={getIcon()}
        id={`task-id-${task.id}-header`}
      >
        <Typography variant="subtitle1" className={classes.summaryText}>
          {task.description}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        className={classes.accordionDetails}
        id={`task-id-${task.id}-details`}
      >
        <CardContent>
          <Box className={classes.taskData}>
            <Card className={classes.fullWidthGridRow} id="summary">
              <CardHeader title="Summary" />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Task Description</TableCell>
                    <TableCell>{ task.description }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Associated Certification Criteria</TableCell>
                    <TableCell>
                      <List>
                        {task.criteria
                          .sort(sortCriteria)
                          .map((criterion) => (
                            <ListItem key={criterion.id}>
                              { criterion.removed && 'Removed | ' }
                              { criterion.number }
                              :
                              {' '}
                              <ChplHighlightCures text={criterion.title} />
                            </ListItem>
                          ))}
                      </List>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
            <Card id="rating">
              <CardHeader title="Rating" />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Rating Scale</TableCell>
                    <TableCell>{ task.taskRatingScale }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Task Rating</TableCell>
                    <TableCell>{ task.taskRating }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Task Rating - Standard Deviation</TableCell>
                    <TableCell>{ task.taskRatingStddev }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
            <Card>
              <CardHeader title="Task Time" />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Task Time - Mean (s) </TableCell>
                    <TableCell>{ task.taskTimeAvg }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Task Time - Standard Deviation (s)</TableCell>
                    <TableCell>{ task.taskTimeStddev }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Task Time Deviation - Observed/Optimal (s)</TableCell>
                    <TableCell>
                      { task.taskTimeDeviationObservedAvg }
                      {' '}
                      /
                      {' '}
                      { task.taskTimeDeviationOptimalAvg }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
            <Card id="success">
              <CardHeader title="Task Success" />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Task Success - Mean (%) </TableCell>
                    <TableCell>{ task.taskSuccessAverage }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Task Success - Standard Deviation (%)</TableCell>
                    <TableCell>{ task.taskSuccessStddev }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
            <Card>
              <CardHeader title="Task Errors" />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Task Errors - Mean (%) </TableCell>
                    <TableCell>{ task.taskErrors }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Task Errors - Standard Deviation (%)</TableCell>
                    <TableCell>{ task.taskErrorsStddev }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Task Path Deviation - Observed/Optimal (# of Steps)</TableCell>
                    <TableCell>
                      { task.taskPathDeviationObserved }
                      {' '}
                      /
                      {' '}
                      { task.taskPathDeviationOptimal }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
            <Card className={classes.fullWidthGridRow} id="participants">
              <CardHeader title="Participants" />
              <Box display="flex" flexDirection="row" justifyContent="flex-end" p={4}>
                <ChplSedTaskParticipantsView
                  participants={task.testParticipants}
                />
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Number of Participants</TableCell>
                    <TableCell>{ task.testParticipants.length }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Occupation Breakdown</TableCell>
                    <TableCell>
                      <List>
                        {occupations
                          .map((occupation) => (
                            <ListItem key={occupation.name}>
                              { occupation.name }
                              :
                              {' '}
                              { occupation.count}
                              {' '}
                              /
                              { task.testParticipants.length }
                              {' '}
                              (
                              { occupation.percentage }
                              )
                            </ListItem>
                          ))}
                      </List>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Product Experience - Mean (Months)</TableCell>
                    <TableCell>{ meanExperience }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </Box>
        </CardContent>
      </AccordionDetails>
    </Accordion>
  );
}

export default ChplSedTaskView;

ChplSedTaskView.propTypes = {
  task: object.isRequired,
};
