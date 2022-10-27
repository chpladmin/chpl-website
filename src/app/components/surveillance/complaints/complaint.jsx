import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';

import ChplComplaintEdit from './complaint-edit';
import ChplComplaintView from './complaint-view';

import { BreadcrumbContext, UserContext } from 'shared/contexts';
import {
  complaint as complaintPropType,
  listing as listingPropType,
} from 'shared/prop-types';

function ChplComplaint(props) {
  const { complaint, dispatch, showBreadcrumbs } = props;
  const { append, display, hide } = useContext(BreadcrumbContext);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (showBreadcrumbs) {
      append(
        <Button
          key="view"
          variant="text"
          onClick={() => setIsEditing(false)}
        >
          View Complaint
        </Button>,
      );
      append(
        <Button
          key="add.disabled"
          variant="text"
          disabled
        >
          Add Complaint
        </Button>,
      );
      append(
        <Button
          key="edit.disabled"
          variant="text"
          disabled
        >
          Edit Complaint
        </Button>,
      );
      append(
        <Button
          key="view.disabled"
          variant="text"
          disabled
        >
          View Complaint
        </Button>,
      );
    }
  }, [showBreadcrumbs]);

  useEffect(() => {
    if (isEditing) {
      display('view');
      display(complaint.id ? 'edit.disabled' : 'add.disabled');
      hide('view.disabled');
    } else {
      display('view.disabled');
      hide('add.disabled');
      hide('edit.disabled');
      hide('view');
    }
  }, [isEditing]);

  const handleDispatch = ({action, payload}) => {
    switch (action) {
      case 'cancel':
      case 'close':
        dispatch({action: 'close'});
        break;
      case 'create':
        create(payload);
        break;
      case 'edit':
        setIsEditing(true);
        break;
      case 'update':
        update(payload);
        break;
        // no default
    };
  };

  const create = (payload) => {
    console.log({action: 'creating', payload});
    handleDispatch({action: 'close'});
  };

  const update = (payload) => {
    console.log({update: 'updating', payload});
    handleDispatch({action: 'close'});
  };

  if (!complaint.id || isEditing) {
    return (
      <ChplComplaintEdit
        complaint={complaint}
        dispatch={handleDispatch}
      />
    );
  }

  return (
    <ChplComplaintView
      complaint={complaint}
      dispatch={handleDispatch}
    />
  );
}

export default ChplComplaint;

ChplComplaint.propTypes = {
  complaint: complaintPropType.isRequired,
  //listings: arrayOf(listingPropType).isRequired,
  //errors: arrayOf(string).isRequired,
  dispatch: func.isRequired,
  showBreadcrumbs: bool,
};

ChplComplaint.defaultProps = {
  showBreadcrumbs: true,
};
