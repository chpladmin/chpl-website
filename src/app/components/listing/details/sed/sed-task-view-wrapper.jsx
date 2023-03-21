import React from 'react';
import { number } from 'prop-types';

import ChplSedTaskView from './sed-task-view';

import AppWrapper from 'app-wrapper';
import { listing as listingType } from 'shared/prop-types/listing';

function ChplSedTaskViewWrapper(props) {
  const { listing, sedTaskId } = props;

  return (
    <AppWrapper>
      <ChplSedTaskView
        listing={listing}
        sedTaskId={sedTaskId}
      />
    </AppWrapper>
  );
}

export default ChplSedTaskViewWrapper;

ChplSedTaskViewWrapper.propTypes = {
  listing: listingType.isRequired,
  sedTaskId: number.isRequired,
};
