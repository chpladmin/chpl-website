import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';
import { arrayOf, bool } from 'prop-types';

import ChplCqms from './cqms';

import { certificationEdition, cqm } from 'shared/prop-types';
import theme from 'themes/theme';

function ChplCqmsWrapper(props) {
  const { cqms, edition, viewAll } = props;

  return (
    <ThemeProvider theme={theme}>
      <ChplCqms cqms={cqms} edition={edition} viewAll={viewAll} />
    </ThemeProvider>
  );
}

export default ChplCqmsWrapper;

ChplCqmsWrapper.propTypes = {
  cqms: arrayOf(cqm).isRequired,
  edition: certificationEdition.isRequired,
  viewAll: bool,
};

ChplCqmsWrapper.defaultProps = {
  viewAll: false,
};
