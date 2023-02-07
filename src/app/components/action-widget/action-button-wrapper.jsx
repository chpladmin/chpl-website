import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';

import ChplActionButton from './action-button';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import CmsWrapper from 'components/cms-widget/cms-wrapper';
import CompareWrapper from 'components/compare-widget/compare-wrapper';
import { listing as listingPropType } from 'shared/prop-types';
import theme from 'themes/theme';

function ChplActionButtonWrapper(props) {
  const { listing } = props;

  return (
    <ThemeProvider theme={theme}>
      <ApiWrapper showQueryTools={false}>
        <FlagWrapper>
          <CmsWrapper>
            <CompareWrapper>
              <ChplActionButton listing={listing} />
            </CompareWrapper>
          </CmsWrapper>
        </FlagWrapper>
      </ApiWrapper>
    </ThemeProvider>
  );
}

export default ChplActionButtonWrapper;

ChplActionButtonWrapper.propTypes = {
  listing: listingPropType.isRequired,
};
