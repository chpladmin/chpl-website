import React from 'react';

import ChplDecertifiedProductsCollectionPage from './decertified-products';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

function ChplDecertifiedProductsCollectionWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagWrapper>
          <ChplDecertifiedProductsCollectionPage />
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplDecertifiedProductsCollectionWrapper;

ChplDecertifiedProductsCollectionWrapper.propTypes = {
};
