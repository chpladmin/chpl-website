import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
} from '@material-ui/core';
import { bool, func } from 'prop-types';

import ChplComplaintEdit from './complaint-edit';
import ChplComplaintView from './complaint-view';

import { BreadcrumbContext } from 'shared/contexts';
import { complaint as complaintPropType } from 'shared/prop-types';

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
      display('edit.disabled');
      hide('view.disabled');
    } else if (complaint.id) {
      display('view.disabled');
      hide('add.disabled');
      hide('edit.disabled');
      hide('view');
    } else {
      display('add.disabled');
    }
  }, [complaint, isEditing]);

  const handleDispatch = ({ action }) => {
    switch (action) {
      case 'cancel':
        setIsEditing(false);
        break;
      case 'close':
      case 'refresh':
        dispatch({ action: 'close' });
        break;
      case 'edit':
        setIsEditing(true);
        break;
        // no default
    }
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
  dispatch: func.isRequired,
  showBreadcrumbs: bool,
};

ChplComplaint.defaultProps = {
  showBreadcrumbs: true,
};
