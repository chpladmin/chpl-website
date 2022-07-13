import React from 'react';
import {
  ButtonGroup,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';

import ChplComplaintAdd from './complaint-add';
import ChplComplaintsDownload from './complaints-download';
import ChplComplaintsView from './complaints-view';

import { complaint as complaintPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const useStyles = makeStyles(() => ({
  ...utilStyles,
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'end',
  },
  wrap: {
    flexFlow: 'wrap',
  },
}));

function ChplComplaints(props) {
  const { complaints, dispatch } = props;
  const classes = useStyles();

  return (
    <>
      <div className={classes.tableResultsHeaderContainer}>
        <ButtonGroup size="small" className={classes.wrap}>
          <ChplComplaintAdd
            dispatch={dispatch}
          />
          <ChplComplaintsDownload />
        </ButtonGroup>
      </div>
      <ChplComplaintsView
        complaints={complaints}
        dispatch={dispatch}
      />
    </>
  );
}

export default ChplComplaints;

ChplComplaints.propTypes = {
  complaints: arrayOf(complaintPropType).isRequired,
  dispatch: func.isRequired,
};
