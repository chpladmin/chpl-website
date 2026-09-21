import ChplChangeRequestsWrapper from './change-request/change-requests-wrapper';
import { ChplConfirmListingsWrapper } from './listing/confirm';
import ChplComplaintsWrapper from './surveillance/complaints/complaints-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.components', [
    'chpl.services',
    'ui.router',
  ])
  .component('chplChangeRequestsWrapperBridge', reactToAngularComponent(ChplChangeRequestsWrapper))
  .component('chplComplaintsWrapperBridge', reactToAngularComponent(ChplComplaintsWrapper))
  .component('chplConfirmListingsWrapperBridge', reactToAngularComponent(ChplConfirmListingsWrapper));
