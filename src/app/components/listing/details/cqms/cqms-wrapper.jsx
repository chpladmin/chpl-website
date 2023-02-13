import React from 'react';
import { arrayOf, bool } from 'prop-types';

import ChplCqms from './cqms';

import AppWrapper from 'app-wrapper';
import { certificationEdition, cqm } from 'shared/prop-types';

function ChplCqmsWrapper(props) {
  const { cqms, edition, viewAll } = props;

  return (
    <AppWrapper>
      <ChplCqms cqms={cqms} edition={edition} viewAll={viewAll} />
    </AppWrapper>
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
