import ChplListingEdit from './listing-edit-wrapper';
import ChplListingEditUploadPage from './listing-edit-upload-wrapper';
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
  .component('chplListingEditBridge', reactToAngularComponent(ChplListingEdit))
  .component('chplListingEditUploadBridge', reactToAngularComponent(ChplListingEditUploadPage))
  .component('chplListingPageBridge', reactToAngularComponent(ChplListingPage));
