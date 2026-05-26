import React from 'react';

import ChplDecertifiedProductsSearchPage from './decertified-products';

import AppWrapper from 'app-wrapper';
import { ChplLink } from 'components/util';
import { ChplPageBody, ChplPageHeader } from '../../../components/util';
import { useAnalyticsContext } from 'shared/contexts';

function ChplDecertifiedProductsSearchWrapper() {
  const { analytics } = useAnalyticsContext();

  return (
    <AppWrapper>
      <ChplPageHeader
        text="Decertified Products"
        subtitle={(
          <>
            This list includes all health IT products that have had their status changed to a &quot;decertified&quot; status on the Certified Health IT Products List (CHPL). A product may be decertified for the following reasons: certificate terminated by ONC, certificate withdrawn by an ONC-ACB, or certification withdrawn by an ONC-ACB because the health IT developer requested it to be withdrawn when the product was under ONC-ACB surveillance or ONC direct review. For further descriptions of the certification statuses, please consult the
            {' '}
            <ChplLink
              href="https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf"
              text="CHPL Public User Guide"
              analytics={{
                ...analytics,
                event: 'Go to CHPL Public User Guide',
              }}
              external={false}
              inline
            />
            . For more information on how a decertified product may affect your attestation to the CMS EHR Incentive Programs, please consult the
            {' '}
            <ChplLink
              href="https://www.cms.gov/Regulations-and-Guidance/Legislation/EHRIncentivePrograms/FAQ.html"
              text="CMS FAQ"
              analytics={{
                ...analytics,
                event: 'Go to CMS FAQ',
              }}
              external={false}
              inline
            />
            . For additional information about how a decertified product may affect your participation in other CMS programs, please reach out to that program.
          </>
        )}
      />
      <ChplPageBody>
        <ChplDecertifiedProductsSearchPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplDecertifiedProductsSearchWrapper;

ChplDecertifiedProductsSearchWrapper.propTypes = {
};
