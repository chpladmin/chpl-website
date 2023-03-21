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
  Typography,
  makeStyles,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import { number } from 'prop-types';

import { ChplLink, ChplTooltip } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { getAngularService } from 'services/angular-react-helper';
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

function ChplSedTaskView({ listing, sedTaskId }) {
  const $state = getAngularService('$state');
  const [task, setTask] = useState({});
  const classes = useStyles();

  useEffect(() => {
    setTask(listing.sed.testTasks.find((task) => task.id === sedTaskId));
  }, [listing, sedTaskId]);

  const downloadDetails = () => {
    console.log('downloading details');
  };

  const goBack = () => {
    $state.go('^');
  };

  return (
    <>
      SED Task details
      { task.description }
      <Button
        onClick={goBack}
      >
        Back to Listing
      </Button>
    </>
  );
}

export default ChplSedTaskView;

ChplSedTaskView.propTypes = {
  listing: listingType.isRequired,
  sedTaskId: number.isRequired,
};
