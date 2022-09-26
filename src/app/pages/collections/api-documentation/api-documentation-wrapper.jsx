import React from 'react';

import ChplApiDocumentationCollectionPage from './api-documentation';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

function ChplApiDocumentationCollectionWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagWrapper>
          <ChplApiDocumentationCollectionPage />
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplApiDocumentationCollectionWrapper;

ChplApiDocumentationCollectionWrapper.propTypes = {
};
