import React from 'react';
import { number } from 'prop-types';

import ChplIcsFamily from './ics-family';

import AppWrapper from 'app-wrapper';

function ChplIcsFamilyWrapper(props) {
  return (
    <AppWrapper>
      <ChplIcsFamily {...props} />
    </AppWrapper>
  );
}

export default ChplIcsFamilyWrapper;

ChplIcsFamilyWrapper.propTypes = {
  id: number.isRequired,
};
