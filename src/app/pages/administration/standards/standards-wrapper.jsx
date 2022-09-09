import React from 'react';

import ChplStandards from './standards';

import ApiWrapper from 'api/api-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';
import { UserWrapper } from 'components/login';

function ChplStandardsWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <BreadcrumbWrapper>
          <ChplStandards />
        </BreadcrumbWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplStandardsWrapper;

ChplStandardsWrapper.propTypes = {
};
