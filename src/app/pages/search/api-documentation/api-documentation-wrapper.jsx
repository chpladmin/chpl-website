import React from 'react';

import ChplApiDocumentationSearchPage from './api-documentation';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from '../../../components/util';

function ChplApiDocumentationSearchWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader 
        text="API Information"
        subtitle="This list includes all health IT products that have been certified to at least one of the API Criteria. The Mandatory Disclosures URL is also provided for each health IT product in this list. This is a hyperlink to a page on the developer's official website that provides in plain language any limitations and/or additional costs associated with the implementation and/or use of the developer's certified health IT. Please note that by default, only listings that are active or suspended are shown in the search results."
      />
      <ChplPageBody>
        <ChplApiDocumentationSearchPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplApiDocumentationSearchWrapper;

ChplApiDocumentationSearchWrapper.propTypes = {
};
