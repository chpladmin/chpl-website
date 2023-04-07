import React from 'react';
import { string } from 'prop-types';

import ChplJoinDevelopers from './join';

import AppWrapper from 'app-wrapper';

function ChplJoinDevelopersWrapper({ id }) {
  return (
    <AppWrapper>
      <ChplJoinDevelopers id={parseInt(id, 10)} />
    </AppWrapper>
  );
}

export default ChplJoinDevelopersWrapper;

ChplJoinDevelopersWrapper.propTypes = {
  id: string.isRequired,
};
