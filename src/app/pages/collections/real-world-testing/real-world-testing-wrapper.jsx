import React from 'react';

import ChplRealWorldTestingCollectionPage from './real-world-testing';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

function ChplRealWorldTestingCollectionWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagWrapper>
          <ChplRealWorldTestingCollectionPage />
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplRealWorldTestingCollectionWrapper;

ChplRealWorldTestingCollectionWrapper.propTypes = {
};
