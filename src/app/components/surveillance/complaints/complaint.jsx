import React, { useState } from 'react';
import { bool, func } from 'prop-types';

import ChplComplaintEdit from './complaint-edit';
import ChplComplaintView from './complaint-view';

import { complaint as complaintPropType } from 'shared/prop-types';

function ChplComplaint({ complaint, dispatch, canEdit = true }) {
  const [isEditing, setIsEditing] = useState(false);

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
      canEdit={canEdit}
    />
  );
}

export default ChplComplaint;

ChplComplaint.propTypes = {
  complaint: complaintPropType.isRequired,
  dispatch: func.isRequired,
  canEdit: bool,
};
