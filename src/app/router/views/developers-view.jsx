import React from 'react';
import { UIView } from '@uirouter/react';

import ChplDevelopersWrapper from 'pages/organizations/developers/developers-wrapper';

// organizations.developers is both a page and a parent: it renders the
// developers list when no child state is active, and the developer detail page
// when one is. UIView renders its children as that default content, which is
// what the AngularJS `<ui-view><chpl-developers-wrapper-bridge/></ui-view>`
// template did.
function DevelopersView() {
  return (
    <UIView>
      <ChplDevelopersWrapper />
    </UIView>
  );
}

export default DevelopersView;
