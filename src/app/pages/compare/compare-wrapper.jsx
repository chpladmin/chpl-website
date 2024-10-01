import React from 'react';
import { string } from 'prop-types';

import ChplComparePage from './compare';

import AppWrapper from 'app-wrapper';

function ChplCompareWrapper({ ids }) {
  return (
    <AppWrapper>
      <ChplComparePage
        ids={ids}
      />
    </AppWrapper>
  );
}

export default ChplCompareWrapper;

ChplCompareWrapper.propTypes = {
  ids: string.isRequired,
};
