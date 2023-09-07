import React from 'react';
import { arrayOf, number, oneOfType, string } from 'prop-types';

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
  ids: arrayOf(oneOfType([number, string])).isRequired,
};
