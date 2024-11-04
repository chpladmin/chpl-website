import React from 'react';

import ChplProducts from './products';

import AppWrapper from 'app-wrapper';
import { DeveloperContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

function ChplProductsWrapper({ developer }) {
  const developerState = {
    developer,
  };

  return (
    <AppWrapper>
      <DeveloperContext.Provider value={developerState}>
        <ChplProducts />
      </DeveloperContext.Provider>
    </AppWrapper>
  );
}

export default ChplProductsWrapper;

ChplProductsWrapper.propTypes = {
  developer: developerPropType.isRequired,
};
