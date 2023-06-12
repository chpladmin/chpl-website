import { reactToAngularComponent } from '../../services/angular-react-helper.jsx';

import ChplListingHistory from './history';
import ChplListingPage from './listing-wrapper';

angular
  .module('chpl.listing', [
    'angulartics',
    'chpl.services',
    'feature-flags',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplListingHistoryBridge', reactToAngularComponent(ChplListingHistory))
  .component('chplListingPageBridge', reactToAngularComponent(ChplListingPage));
