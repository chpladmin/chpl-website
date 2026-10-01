import React from 'react';
import { UIView, useRouter } from '@uirouter/react';

import { ChplConfirmListingsWrapper } from 'components/listing/confirm';

// Replaces the chplConfirmListings Angular component, whose only jobs were to
// host a <ui-view> and to hand the page an onProcess callback that navigated to
// the child state. The Angular version used the relative name '.listing';
// this uses the absolute name, which does not depend on the view's position in
// the tree.
function ConfirmListingsView() {
  const router = useRouter();

  const handleProcess = (listingId) => {
    router.stateService.go('administration.confirm.listings.listing', { id: listingId });
  };

  return (
    <UIView>
      <ChplConfirmListingsWrapper onProcess={handleProcess} />
    </UIView>
  );
}

export default ConfirmListingsView;
