import React from 'react';
import {
  arrayOf, bool, func, string,
} from 'prop-types';

import ChplComplaints from './complaints';

import AppWrapper from 'app-wrapper';
import {
  complaint as complaintPropType,
  listing as listingPropType,
} from 'shared/prop-types';

function ChplComplaintsWrapper(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <AppWrapper>
      <ChplComplaints
        {...props}
      />
    </AppWrapper>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplComplaintsWrapper;

ChplComplaintsWrapper.propTypes = {
  complaint: complaintPropType,
  complaints: arrayOf(complaintPropType),
  listings: arrayOf(listingPropType),
  errors: arrayOf(string),
  dispatch: func,
  displayAdd: bool,
  isViewing: bool,
  isEditing: bool,
};

ChplComplaintsWrapper.defaultProps = {
  complaint: undefined,
  complaints: [],
  listings: [],
  errors: [],
  dispatch: () => {},
  displayAdd: false,
  isViewing: false,
  isEditing: false,
};
