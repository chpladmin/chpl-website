import React from 'react';
import { number } from 'prop-types';

import ChplSedTaskView from './sed-task-view';

import AppWrapper from 'app-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';
import { listing as listingType } from 'shared/prop-types/listing';

function ChplSedTaskViewWrapper(props) {
  const { listing, sedTaskId } = props;

  return (
    <AppWrapper>
      <BreadcrumbWrapper title="SED Information">
        <ChplSedTaskView
          listing={listing}
          sedTaskId={sedTaskId}
        />
      </BreadcrumbWrapper>
    </AppWrapper>
  );
}

export default ChplSedTaskViewWrapper;

ChplSedTaskViewWrapper.propTypes = {
  listing: listingType.isRequired,
  sedTaskId: number.isRequired,
};
