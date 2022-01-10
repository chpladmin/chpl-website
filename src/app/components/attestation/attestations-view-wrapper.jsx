import React from 'react';
import { func } from 'prop-types';

import ChplAttestationsView from './attestations-view';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';
import { developer as developerPropType } from 'shared/prop-types';

function ChplAttestationsViewWrapper(props) {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplAttestationsView
          {...props}
        />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplAttestationsViewWrapper;

ChplAttestationsViewWrapper.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
};
