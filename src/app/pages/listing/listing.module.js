import ChplListingPage from './listing-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.listing', [
    'chpl.services',
    'ui.router',
  ])
  .component('chplListingPageBridge', reactToAngularComponent(ChplListingPage));
