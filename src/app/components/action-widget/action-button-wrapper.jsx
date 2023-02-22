import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';
import { bool } from 'prop-types';

import ChplActionButton from './action-button';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import CmsWrapper from 'components/cms-widget/cms-wrapper';
import CompareWrapper from 'components/compare-widget/compare-wrapper';
import { UserWrapper } from 'components/login';
import { listing as listingPropType } from 'shared/prop-types';
import theme from 'themes/theme';

function ChplActionButtonWrapper(props) {
  return (
    <ThemeProvider theme={theme}>
      <UserWrapper>
        <ApiWrapper showQueryTools={false}>
          <FlagWrapper>
            <CmsWrapper>
              <CompareWrapper>
                <ChplActionButton {...props} />
              </CompareWrapper>
            </CmsWrapper>
          </FlagWrapper>
        </ApiWrapper>
      </UserWrapper>
    </ThemeProvider>
  );
}

export default ChplActionButtonWrapper;

ChplActionButtonWrapper.propTypes = {
  listing: listingPropType.isRequired,
  horizontal: bool,
};

ChplActionButtonWrapper.defaultProps = {
  children: undefined,
  horizontal: true,
};
