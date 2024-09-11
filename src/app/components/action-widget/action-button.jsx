import React from 'react';
import {
  Box,
  makeStyles,
} from '@material-ui/core';
import { bool, node } from 'prop-types';

import CompareButton from 'components/compare-widget/compare-button';
import CmsButton from 'components/cms-widget/cms-button';
import { listing as listingPropType } from 'shared/prop-types';

const useStyles = makeStyles({
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
});

function ChplActionButton(props) {
  const { children, horizontal, listing } = props;
  const classes = useStyles();

  return (
    <Box className={horizontal ? classes.tableActionsHorizontal : classes.tableActions}>
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

ChplActionButton.defaultProps = {
  children: undefined,
  horizontal: false,
};
