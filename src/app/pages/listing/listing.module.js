import ChplListingPage from './listing-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.listing', [
    'chpl.services',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplListingPageBridge', reactToAngularComponent(ChplListingPage));
