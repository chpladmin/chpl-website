import React from 'react';

import ChplDecisionSupportInterventionsSearchPage from './decision-support-interventions';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from '../../../components/util';

function ChplDecisionSupportInterventionsSearchWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader 
        text="Decision Support Interventions"
        subtitle="This list includes all health IT products that have been certified to §170.315 (b)(11): Decision Support Interventions. Certified Health IT developers are required to apply intervention risk management practices to Predictive DSIs they supply as part of their (b)(11)-certified products. These practices, including risk analysis, risk mitigation, and governance, are summarized and made publicly available through URLs listed in the Risk Management Summary Information column. Please note that by default, only listings that are active or suspended are shown in the search results."
      />
      <ChplPageBody>
        <ChplDecisionSupportInterventionsSearchPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplDecisionSupportInterventionsSearchWrapper;

ChplDecisionSupportInterventionsSearchWrapper.propTypes = {
};
