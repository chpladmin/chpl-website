import React from 'react';

import ChplRealWorldTestingSearchPage from './real-world-testing';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from '../../../components/util';

function ChplRealWorldTestingSearchWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader 
        text="Real World Testing"
        subtitle="This list includes Health IT Module(s) eligible for Real World Testing, which is an annual Condition and Maintenance of Certification requirement for health IT developers participating in the ONC Health IT Certification Program. If applicable, Real World Testing plans are required to be made publicly available on the CHPL annually by December 15th. Additionally, Real World Testing results are to be made publicly available on the CHPL by March 15th of the subsequent year. Please note that by default, only listings that are active or suspended are shown in the search results."
      />
      <ChplPageBody>
        <ChplRealWorldTestingSearchPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplRealWorldTestingSearchWrapper;

ChplRealWorldTestingSearchWrapper.propTypes = {
};
