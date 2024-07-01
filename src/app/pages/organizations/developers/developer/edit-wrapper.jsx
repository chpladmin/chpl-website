import React from 'react';

import ChplEditDeveloper from './edit';

import AppWrapper from 'app-wrapper';
import { developer as developerPropType } from 'shared/prop-types';

function ChplEditDeveloperWrapper({ developer }) {
  return (
    <AppWrapper>
      <ChplEditDeveloper developer={developer} />
    </AppWrapper>
  );
}

export default ChplEditDeveloperWrapper;

ChplEditDeveloperWrapper.propTypes = {
  developer: developerPropType.isRequired,
};
