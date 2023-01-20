import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';

import ChplCmsButton from './cms-button';
import CmsWrapper from './cms-wrapper';

import { listing as listingPropType } from 'shared/prop-types';
import theme from 'themes/theme';

function ChplCmsButtonWrapper(props) {
  const { listing } = props;

  return (
    <ThemeProvider theme={theme}>
      <CmsWrapper>
        <ChplCmsButton listing={listing} />
      </CmsWrapper>
    </ThemeProvider>
  );
}

export default ChplCmsButtonWrapper;

ChplCmsButtonWrapper.propTypes = {
  listing: listingPropType.isRequired,
};
