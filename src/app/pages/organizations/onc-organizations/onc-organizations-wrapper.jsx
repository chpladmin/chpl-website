import React from 'react';
import { oneOf } from 'prop-types';

import ChplOncOrganizations from './onc-organizations';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplOncOrganizationsWrapper({ orgType = 'acb' }) {
  return (
    <>
      <ChplPageHeader text={orgType === 'acb' ? 'ONC-ACBs' : 'ONC-ATLs'} />
      <ChplPageBody>
        <ChplOncOrganizations orgType={orgType} />
      </ChplPageBody>
    </>
  );
}

export default ChplOncOrganizationsWrapper;

ChplOncOrganizationsWrapper.propTypes = {
  orgType: oneOf(['acb', 'atl']),
};
