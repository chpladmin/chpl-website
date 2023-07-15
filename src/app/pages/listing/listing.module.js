import ChplListingPage from './listing-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.listing', [
    'angulartics',
    'chpl.services',
    'feature-flags',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplListingPageBridge', reactToAngularComponent(ChplListingPage));
