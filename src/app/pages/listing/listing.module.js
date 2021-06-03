import ChplListingHistory from './history';
import { reactToAngularComponent } from '../../services/angular-react-helper.jsx';

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
;
