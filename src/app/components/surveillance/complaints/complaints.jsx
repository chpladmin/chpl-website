import React, { useContext } from 'react';
import {
  ButtonGroup,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf, bool, func, string,
} from 'prop-types';

import ChplComplaint from './complaint';
import ChplComplaintAdd from './complaint-add';
import ChplComplaintsDownload from './complaints-download';
import ChplComplaintsView from './complaints-view';

import { UserContext } from 'shared/contexts';
import { complaint as complaintPropType, listing as listingPropType } from 'shared/prop-types';
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
  const {
    complaints,
    dispatch,
    displayAdd,
    isViewing,
    isEditing,
  } = props;
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();

  if (isViewing || isEditing) {
    return (
      <ChplComplaint
        {...props}
      />
    );
  }

  return (
    <>
      <div className={classes.tableResultsHeaderContainer}>
        <ButtonGroup size="small" className={classes.wrap}>
          { displayAdd
            && (
              <ChplComplaintAdd
                dispatch={dispatch}
              />
            )}
          { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF'])
            && (
              <ChplComplaintsDownload />
            )}
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
  complaint: complaintPropType.isRequired,
  complaints: arrayOf(complaintPropType).isRequired,
  listings: arrayOf(listingPropType).isRequired,
  errors: arrayOf(string).isRequired,
  dispatch: func.isRequired,
  displayAdd: bool.isRequired,
  isViewing: bool.isRequired,
  isEditing: bool.isRequired,
};
