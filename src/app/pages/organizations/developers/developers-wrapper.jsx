import React from 'react';
import {
  arrayOf, func, object, string,
} from 'prop-types';

import { UserWrapper } from 'components/login';
import ApiWrapper from 'api/api-wrapper';

import ChplDevelopers from './developers';

function ChplDevelopersWrapper(props) {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplDevelopers
        />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplDevelopersWrapper;

ChplDevelopersWrapper.propTypes = {
};
