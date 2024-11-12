import React from 'react';
import { arrayOf, func } from 'prop-types';

import ChplSedDetailsEdit from './details-edit';

import AppWrapper from 'app-wrapper';
import { criterion, listing, ucdProcessType } from 'shared/prop-types';

function ChplWrapper(props) {
  return (
    <AppWrapper>
      <ChplSedDetailsEdit {...props} />
    </AppWrapper>
  );
}

export default ChplWrapper;

ChplWrapper.propTypes = {
  criteria: arrayOf(criterion),
  dispatch: func.isRequired,
  listing,
  ucdProcesses: arrayOf(ucdProcessType),
};

ChplWrapper.defaultProps = {
  criteria: [],
  listing: {},
  ucdProcesses: [],
};
