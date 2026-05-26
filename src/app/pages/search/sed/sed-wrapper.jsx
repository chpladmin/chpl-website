import React from 'react';
import { Typography } from '@material-ui/core';

import ChplSedSearchPage from './sed';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from '../../../components/util';

function ChplSedSearchWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader 
        text="SED Information"
        subtitle={
          <>
            <div>This list includes all health IT products that have been certified with Safety Enhanced Design (SED). Please note that by default, only listings that are active or suspended are shown in the search results.</div>
            <div>
              <h2>SED Information Dataset</h2>
              <Typography variant="body1" gutterBottom>
                Please note the SED Details file contains information for certified product listings and is not filtered based on search results.
              </Typography>
            </div>
          </>
        }
      />
      <ChplPageBody>
        <ChplSedSearchPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplSedSearchWrapper;

ChplSedSearchWrapper.propTypes = {
};
