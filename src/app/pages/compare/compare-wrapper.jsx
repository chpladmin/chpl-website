import React from 'react';
import { string } from 'prop-types';

import ChplComparePage from './compare';

function ChplCompareWrapper({ ids }) {
  return (
    <>
      <ChplComparePage
        ids={ids}
      />
    </>
  );
}

export default ChplCompareWrapper;

ChplCompareWrapper.propTypes = {
  ids: string.isRequired,
};
