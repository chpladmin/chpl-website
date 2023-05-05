import React from 'react';
import { arrayOf } from 'prop-types';

import Compliance from './compliance.jsx';

import AppWrapper from 'app-wrapper';
import { measure } from 'shared/prop-types';

function ChplComplianceWrapper(props) {
  const { measures } = props;

  return (
    <AppWrapper>
      <Compliance />
    </AppWrapper>
  );
}

export default ChplComplianceWrapper;

ChplComplianceWrapper.propTypes = {
  measures: arrayOf(measure).isRequired,
};
