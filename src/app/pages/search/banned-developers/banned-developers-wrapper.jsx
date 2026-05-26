import React from 'react';

import ChplBannedDevelopersSearchPage from './banned-developers';

import AppWrapper from 'app-wrapper';
import { ChplLink } from 'components/util';
import { ChplPageBody, ChplPageHeader } from '../../../components/util';
import { useAnalyticsContext } from 'shared/contexts';
import { Typography } from '@material-ui/core';

function ChplBannedDevelopersSearchWrapper() {
  const { analytics } = useAnalyticsContext();

  return (
    <AppWrapper>
      <ChplPageHeader
        text="Developers Under Certification Ban"
        subtitle={(
          <>
            <Typography variant="body1" gutterBottom>
              This is a list of health IT developers currently precluded from certifying any health IT products under the ONC Health IT Certification Program - including new products as well as upgraded versions of current products. ONC may lift these statuses if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence. A developer may be precluded from certifying products for two reasons:
            </Typography>
            <ol>
              <li>
                <strong>Developer Failure to Take Appropriate Corrective Action</strong>
                {' '}
                A developer may be precluded from the Program if the developer or one of its products fails to comply with any requirements of certification and the developer fails to take appropriate actions to correct the non-compliance.
              </li>
              <li>
                <strong>Product Withdrawn While Under Surveillance</strong>
                {' '}
                A developer may also be precluded if it fails to cooperate with the surveillance or other oversight of its certified products. ONC may lift the ban if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence.
              </li>
            </ol>
            <Typography variant="body1">
              Health IT products currently listed on the CHPL will maintain their listed certification status regardless of whether their developer is precluded from the program. Please consult your health IT product's details page to confirm its certification status by
              {' '}
              <ChplLink
                href="#/search"
                text="searching for the product"
                analytics={{
                  ...analytics,
                  event: 'Navigate to searching for the product',
                }}
                external={false}
                router={{ sref: 'search' }}
                inline
              />
            </Typography>
          </>
        )}
      />
      <ChplPageBody>
        <ChplBannedDevelopersSearchPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplBannedDevelopersSearchWrapper;

ChplBannedDevelopersSearchWrapper.propTypes = {
};
