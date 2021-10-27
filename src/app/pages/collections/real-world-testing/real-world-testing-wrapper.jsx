import React from 'react';

import { UserWrapper } from '../../../components/login';
import ApiWrapper from '../../../api/api-wrapper';

import ChplRealWorldTestingCollectionPage from './real-world-testing';

function ChplRealWorldTestingCollectionPageWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplRealWorldTestingCollectionPage />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplRealWorldTestingCollectionPageWrapper;

ChplRealWorldTestingCollectionPageWrapper.propTypes = {
};
