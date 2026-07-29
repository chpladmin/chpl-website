import IndexWrapper from '../index-wrapper';

import ChplChangeRequestsWrapper from './change-request/change-requests-wrapper';
import ChplListingView from './listing/listing-view-wrapper';
import { ChplConfirmListingsWrapper } from './listing/confirm';
import ChplCriteriaWrapper from './listing/details/criteria/criteria-wrapper';
import ChplComplaintsWrapper from './surveillance/complaints/complaints-wrapper';
import ChplUsersWrapper from './user/users-wrapper';
import {
  ChplConfirmation,
  ChplEllipsis,
} from './util';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.components', [
    'chpl.services',
    'ngCytoscape',
    'ngFileUpload',
    'ngResource',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplChangeRequestsWrapperBridge', reactToAngularComponent(ChplChangeRequestsWrapper))
  .component('chplComplaintsWrapperBridge', reactToAngularComponent(ChplComplaintsWrapper))
  .component('chplConfirmListingsWrapperBridge', reactToAngularComponent(ChplConfirmListingsWrapper))
  .component('chplConfirmationBridge', reactToAngularComponent(ChplConfirmation))
  .component('chplCriteriaBridge', reactToAngularComponent(ChplCriteriaWrapper))
  .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis))
  .component('chplListingViewBridge', reactToAngularComponent(ChplListingView))
  .component('chplUsersBridge', reactToAngularComponent(ChplUsersWrapper))
  .component('indexWrapperBridge', reactToAngularComponent(IndexWrapper));
