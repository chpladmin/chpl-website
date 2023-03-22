import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { number } from 'prop-types';

import ChplSedTaskParticipantsView from './sed-task-participants-view';

import { ChplHighlightCures } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { getAngularService } from 'services/angular-react-helper';
import { listing as listingType } from 'shared/prop-types/listing';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuItems: {
    padding: '8px',
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: '#000',
      backgroundColor: '#f9f9f9',
      fontWeight: 600,
    },
  },
  taskData: {
    display: 'grid',
    flexDirection: 'column',
    gridTemplateColumns: '1fr 1fr',
  },
});

const makeRounded = (val) => Math.round(val * 1000) / 1000;

const makePercentage = (val) => `${makeRounded(val * 100)}%`;

function ChplSedTaskView({ listing, sedTaskId }) {
  const $state = getAngularService('$state');
  const [meanExperience, setMeanExperience] = useState(0);
  const [occupations, setOccupations] = useState([]);
  const [task, setTask] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    const inputTask = listing.sed.testTasks.find((t) => t.id === sedTaskId);
    if (!inputTask) { return; }
    setTask(inputTask);
    setMeanExperience(makeRounded(inputTask.testParticipants.reduce((sum, participant) => sum + participant.productExperienceMonths, 0) / inputTask.testParticipants.length));
    const occupationsObj = inputTask.testParticipants.reduce((obj, participant) => {
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
        percentage: makePercentage(value / inputTask.testParticipants.length),
      }))
      .sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [listing, sedTaskId]);

  const goBack = () => {
    $state.go('^');
  };

  const scroll = (target) => {
    const section = document.querySelector(`#${target}`);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!task) { return null; }

  return (
    <div className={classes.container}>
      <div className={classes.navigation}>
        <Card>
          <Button
            onClick={() => scroll('summary')}
            id="sed-task-view-scroll-to-summary"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            Summary
          </Button>
          <Button
            onClick={() => scroll('rating')}
            id="sed-task-view-scroll-to-rating"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            Rating &amp; Task Time
          </Button>
          <Button
            onClick={() => scroll('success')}
            id="sed-task-view-scroll-to-success"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            Task Success &amp; Error
          </Button>
          <Button
            onClick={() => scroll('participants')}
            id="sed-task-view-scroll-to-participants"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            Participants
          </Button>
          <Button
            onClick={goBack}
            id="sed-task-view-go-back"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowBackIcon />}
            className={classes.menuItems}
          >
            Back to Listing
          </Button>
        </Card>
      </div>
      <div className={classes.taskData}>
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
                <TableCell>Criteria</TableCell>
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
                <TableCell>Task Task Path - Observed/Optimal (# of Steps)</TableCell>
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
          <ChplSedTaskParticipantsView
            participants={task.testParticipants}
          />
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
      </div>
    </div>
  );
}

export default ChplSedTaskView;

ChplSedTaskView.propTypes = {
  listing: listingType.isRequired,
  sedTaskId: number.isRequired,
};
