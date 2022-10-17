import React from 'react';
import { arrayOf, func } from 'prop-types';

import ChplSedDetailsEdit from './details-edit';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';
import { criterion, listing, ucdProcess } from 'shared/prop-types';

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
  criteria: arrayOf(criterion),
  dispatch: func,
  listing,
  ucdProcesses: arrayOf(ucdProcess),
};

ChplWrapper.defaultProps = {
  criteria: [],
  dispatch: () => {},
  listing: {},
  ucdProcesses: [],
};
