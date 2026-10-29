import React from 'react';
import { Box } from '@mui/material';
import { bool, node } from 'prop-types';

import CompareButton from 'components/compare-widget/compare-button';
import CmsButton from 'components/cms-widget/cms-button';
import { listing as listingPropType } from 'shared/prop-types';

const styles = {
  tableActions: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    alignContent: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  tableActionsHorizontal: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
};

function ChplActionButton({ children = undefined, horizontal = false, listing }) {
  return (
    <Box sx={horizontal ? styles.tableActionsHorizontal : styles.tableActions}>
      {children}
      <CompareButton listing={listing} />
      <CmsButton listing={listing} />
    </Box>
  );
}

export default ChplActionButton;

ChplActionButton.propTypes = {
  listing: listingPropType.isRequired,
  children: node,
  horizontal: bool,
};
