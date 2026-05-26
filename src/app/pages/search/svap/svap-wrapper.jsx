import React from 'react';
import { Typography } from '@material-ui/core';

import ChplSvapSearchPage from './svap';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from '../../../components/util';

function ChplSvapSearchWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader 
        text="SVAP Information"
        subtitle={
          <>
            <div>This search features Health IT Module(s) that have successfully adopted advanced interoperability standards through the Standards Version Advancement Process (SVAP). Please note that by default, only listings that are active or suspended are shown in the search results.</div>
            <div>
              <h2>SVAP Dataset</h2>
              <Typography variant="body1" gutterBottom>
                Entire search of SVAP values that have been associated with a criterion for a certified product. Multiple rows for a single product will appear in the file for any products containing multiple SVAP values and/or SVAP values for multiple criteria. Available as a CSV file; updated nightly.
              </Typography>
            </div>
          </>
        }
      />
      <ChplPageBody>
        <ChplSvapSearchPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplSvapSearchWrapper;

ChplSvapSearchWrapper.propTypes = {
};
