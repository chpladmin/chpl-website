import React from 'react';

import AppWrapper from 'app-wrapper';
import { surveillance as surveillancePropType} from 'shared/prop-types';
import ChplCompliance from './compliance.jsx';

function ChplComplianceWrapper(props) {

  return (
    <AppWrapper>
      <ChplCompliance/>
    </AppWrapper>
  );
}

export default ChplComplianceWrapper;

ChplComplianceWrapper.propTypes = {
  surveillance: surveillancePropType
};