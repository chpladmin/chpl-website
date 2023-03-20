import React from 'react';

import ChplBrowserViewedWidget from './browser-viewed-widget';

import { listing as listingPropType } from 'shared/prop-types';
import AppWrapper from 'app-wrapper';

function ChplBrowserViewedWidgetWrapper(props) {
  const { listing } = props;

  return (
    <AppWrapper>
      <ChplBrowserViewedWidget listing={listing} />
    </AppWrapper>
  );
}

export default ChplBrowserViewedWidgetWrapper;

ChplBrowserViewedWidgetWrapper.propTypes = {
  listing: listingPropType.isRequired,
};
