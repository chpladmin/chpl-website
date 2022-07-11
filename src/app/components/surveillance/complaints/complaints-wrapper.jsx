import React from 'react';
import { func, array } from 'prop-types';

import ChplComplaints from './complaints';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';

function ChplComplaintsWrapper(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplComplaints
          {...props}
        />
      </ApiWrapper>
    </UserWrapper>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplComplaintsWrapper;

ChplComplaintsWrapper.propTypes = {
  complaints: array.isRequired,
  dispatch: func.isRequired,
};
