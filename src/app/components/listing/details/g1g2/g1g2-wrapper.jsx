import React from 'react';
import { arrayOf } from 'prop-types';

import ChplG1g2 from './g1g2';

import AppWrapper from 'app-wrapper';
import { measure } from 'shared/prop-types';

function ChplG1g2Wrapper(props) {
  const { measures } = props;

  return (
    <AppWrapper>
      <ChplG1g2 measures={measures} />
    </AppWrapper>
  );
}

export default ChplG1g2Wrapper;

ChplG1g2Wrapper.propTypes = {
  measures: arrayOf(measure).isRequired,
};
