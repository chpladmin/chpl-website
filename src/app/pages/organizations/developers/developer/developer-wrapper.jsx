import React from 'react';
import { number, oneOfType, string } from 'prop-types';

import ChplDeveloperPage from './developer';

import AppWrapper from 'app-wrapper';

function ChplDeveloperWrapper({ id }) {
  return (
    <AppWrapper>
      <ChplDeveloperPage
        id={id}
      />
    </AppWrapper>
  );
}

export default ChplDeveloperWrapper;

ChplDeveloperWrapper.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
