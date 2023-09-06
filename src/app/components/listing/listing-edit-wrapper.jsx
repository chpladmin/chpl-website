import React from 'react';
import { bool, func, string } from 'prop-types';

import ChplListingEdit from './listing-edit';

import AppWrapper from 'app-wrapper';
import { resources as resourcesPropType, listing as listingPropType } from 'shared/prop-types';

function ChplListingEditWrapper({
  listing,
  onChange,
  resources,
  showFormErrors,
  workType,
}) {
  return (
    <AppWrapper>
      <ChplListingEdit
        listing={listing}
        onChange={onChange}
        resources={resources}
        showFormErrors={showFormErrors}
        workType={workType} />
    </AppWrapper>
  );
}

export default ChplListingEditWrapper;

ChplListingEditWrapper.propTypes = {
  listing: listingPropType.isRequired,
  onChange: func.isRequired,
  resources: resourcesPropType.isRequired,
  showFormErrors: bool.isRequired,
  workType: string.isRequired,
};
