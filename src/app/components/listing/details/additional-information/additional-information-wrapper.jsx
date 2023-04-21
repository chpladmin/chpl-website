import React from 'react';
import { arrayOf } from 'prop-types';

import ChplAdditionalinformation from './additional-information';

import AppWrapper from 'app-wrapper';
import { measure } from 'shared/prop-types';

function ChplAdditionalinformationWrapper(props) {
  const { measures } = props;

  return (
    <AppWrapper>
      <ChplAdditionalinformation/>
    </AppWrapper>
  );
}

export default ChplAdditionalinformationWrapper;

ChplAdditionalinformationWrapper.propTypes = {
  measures: arrayOf(measure).isRequired,
};
