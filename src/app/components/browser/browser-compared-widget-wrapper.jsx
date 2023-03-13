import React from 'react';

import ChplBrowserComparedWidget from './browser-compared-widget';

import { listing as listingPropType } from 'shared/prop-types';
import AppWrapper from 'app-wrapper';

function ChplBrowserComparedWidgetWrapper(props) {
  const { listing } = props;

  return (
    <AppWrapper>
      <ChplBrowserComparedWidget listing={listing} />
    </AppWrapper>
  );
}

export default ChplBrowserComparedWidgetWrapper;

ChplBrowserComparedWidgetWrapper.propTypes = {
  listing: listingPropType.isRequired,
};
