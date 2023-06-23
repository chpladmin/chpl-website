import React from 'react';
import { number, string } from 'prop-types';

import ChplListingPage from './listing';

import AppWrapper from 'app-wrapper';

function ChplListingWrapper({ id, panel }) {
  return (
    <AppWrapper>
      <ChplListingPage
        id={id}
        panel={panel}
      />
    </AppWrapper>
  );
}

export default ChplListingWrapper;

ChplListingWrapper.propTypes = {
  id: number.isRequired,
  panel: string,
};

ChplListingWrapper.defaultProps = {
  panel: undefined,
};
