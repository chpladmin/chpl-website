import React from 'react';
import {
  ButtonGroup,
} from '@material-ui/core';
import { node } from 'prop-types';

import CompareButton from 'components/compare-widget/compare-button';
import CmsButton from 'components/cms-widget/cms-button';
import { listing as listingPropType } from 'shared/prop-types';

function ChplActionButton(props) {
  const { children, listing } = props;

  return (
    <ButtonGroup>
      { children }
      <CompareButton listing={listing} />
      <CmsButton listing={listing} />
    </ButtonGroup>
  );
}

export default ChplActionButton;

ChplActionButton.propTypes = {
  listing: listingPropType.isRequired,
  children: node,
};

ChplActionButton.defaultProps = {
  children: undefined,
};
