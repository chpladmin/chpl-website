import React from 'react';

import ChplCorrectiveActionSearchPage from './corrective-action';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from '../../../components/util';

function ChplCorrectiveActionSearchWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader 
        text="Products: Corrective Action Status"
        subtitle="This is a list of all health IT products for which a non-conformity has been recorded. A certified product is non-conforming if, at any time, an ONC-Authorized Certification Body (ONC-ACB) or ONC determines that the product does not comply with a requirement of certification. Non-conformities reported as part of surveillance are noted as 'Surveillance NCs', while non-conformities identified though an ONC Direct Review are noted as 'Direct Review NCs'. Not all non-conformities affect a product's functionality, and the existence of a non-conformity does not by itself mean that a product is 'defective.' Developers of certified products are required to notify customers of non-conformities and must take approved corrective actions to address such non-conformities in a timely and effective manner. Detailed information about non-conformities, and associated corrective action plans, can be accessed below by clicking on the product's CHPL ID. Please note that by default, only listings that are active or suspended are shown in the search results."
      />
      <ChplPageBody>
        <ChplCorrectiveActionSearchPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplCorrectiveActionSearchWrapper;

ChplCorrectiveActionSearchWrapper.propTypes = {
};
