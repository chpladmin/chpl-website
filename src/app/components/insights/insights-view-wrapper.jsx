import React from 'react';

import ChplInsightsView from './insights-view';

import AppWrapper from 'app-wrapper';
import { developer as developerPropType } from 'shared/prop-types';

function ChplInsightsViewWrapper(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <AppWrapper>
      <ChplInsightsView
        {...props}
      />
    </AppWrapper>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplInsightsViewWrapper;

ChplInsightsViewWrapper.propTypes = {
  developer: developerPropType.isRequired,
};
