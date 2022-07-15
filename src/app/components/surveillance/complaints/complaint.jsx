import React from 'react';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';

import ChplComplaintEdit from './complaint-edit';
import ChplComplaintView from './complaint-view';

import {
  complaint as complaintPropType,
  listing as listingPropType,
} from 'shared/prop-types';

function ChplComplaint(props) {
  const { isViewing, isEditing } = props;

  if (!isViewing && !isEditing) {
    return null;
  }

  if (isViewing) {
    return (
      <ChplComplaintView
        {...props}
      />
    );
  }
  return (
    <ChplComplaintEdit
      {...props}
    />
  );
}

export default ChplComplaint;

ChplComplaint.propTypes = {
  complaint: complaintPropType.isRequired,
  listings: arrayOf(listingPropType).isRequired,
  errors: arrayOf(string).isRequired,
  dispatch: func.isRequired,
  isViewing: bool.isRequired,
  isEditing: bool.isRequired,
};
