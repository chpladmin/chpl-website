import React from 'react';

import ChplInactiveCertificatesSearchPage from './inactive-certificates';

import AppWrapper from 'app-wrapper';
import { ChplLink } from 'components/util';
import { ChplPageBody, ChplPageHeader } from '../../../components/util';
import { useAnalyticsContext } from 'shared/contexts';

function ChplInactiveCertificatesSearchWrapper() {
  const { analytics } = useAnalyticsContext();

  return (
    <AppWrapper>
      <ChplPageHeader
        text="Inactive Certificates"
        subtitle={(
          <>
            This list includes all health IT products that have had their status changed to an &quot;inactive&quot; status on the Certified Health IT Products List (CHPL). This may be simply because the developer no longer supports the product or for other reasons that are not in response to ONC-ACB surveillance, ONC direct review, or a finding of non-conformity. For further descriptions of the certification statuses, please consult the
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
            . For more information on how an inactive certificate may affect your attestation to the CMS EHR Incentive Programs, please consult the
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
            . For additional information about how an inactive certificate may affect your participation in other CMS programs, please reach out to that program.
          </>
        )}
      />
      <ChplPageBody>
        <ChplInactiveCertificatesSearchPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplInactiveCertificatesSearchWrapper;

ChplInactiveCertificatesSearchWrapper.propTypes = {
};
