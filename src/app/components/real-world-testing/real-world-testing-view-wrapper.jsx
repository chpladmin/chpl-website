import React from 'react';

import ChplRealWorldTestingView from './real-world-testing-view';

import AppWrapper from 'app-wrapper';
import { developer as developerPropType } from 'shared/prop-types';

function ChplRealWorldTestingViewWrapper(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <AppWrapper>
      <ChplRealWorldTestingView
        {...props}
      />
    </AppWrapper>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplRealWorldTestingViewWrapper;

ChplRealWorldTestingViewWrapper.propTypes = {
  developer: developerPropType.isRequired,
};
