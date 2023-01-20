import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';

import ChplCompareButton from './compare-button';
import CompareWrapper from './compare-wrapper';

import { listing as listingPropType } from 'shared/prop-types';
import theme from 'themes/theme';

function ChplCompareButtonWrapper(props) {
  const { listing } = props;

  return (
    <ThemeProvider theme={theme}>
      <CompareWrapper>
        <ChplCompareButton listing={listing} />
      </CompareWrapper>
    </ThemeProvider>
  );
}

export default ChplCompareButtonWrapper;

ChplCompareButtonWrapper.propTypes = {
  listing: listingPropType.isRequired,
};
