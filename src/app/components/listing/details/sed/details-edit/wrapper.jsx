import React from 'react';
import { arrayOf, func, object } from 'prop-types';

import ChplSedDetailsEdit from './details-edit';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';

function ChplWrapper(props) {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplSedDetailsEdit {...props} />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplWrapper;

ChplWrapper.propTypes = {
  criteria: arrayOf(object).isRequired,
  dispatch: func.isRequired,
  listing: object.isRequired,
  ucdProcesses: arrayOf(object).isRequired,
};
