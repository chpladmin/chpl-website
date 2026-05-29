import React, { useEffect, useState } from 'react';

import ChplOncOrganizations from './onc-organizations';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplOncOrganizationsWrapper() {
  const [title, setTitle] = useState('ONC Organizations');

  useEffect(() => {
    const orgType = window.location.href.includes('onc-acbs') ? 'acb' : 'atl';
    setTitle(orgType === 'acb' ? 'ONC-ACBs' : 'ONC-ATLs');
  }, []);

  return (
    <AppWrapper>
      <ChplPageHeader text={title} />
      <ChplPageBody>
        <ChplOncOrganizations />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplOncOrganizationsWrapper;

ChplOncOrganizationsWrapper.propTypes = {
};
