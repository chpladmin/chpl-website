import React from 'react';
import { number, oneOfType, string } from 'prop-types';

import ChplDeveloperPage from './developer';

function ChplDeveloperWrapper({ id }) {
  return (
    <>
      <ChplDeveloperPage
        id={id}
      />
    </>
  );
}

export default ChplDeveloperWrapper;

ChplDeveloperWrapper.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
