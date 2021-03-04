import { ChplConfirmListings } from './listing/confirm/';
import { ChplEllipsis } from './util/';
import { ChplFuzzyType } from './fuzzy-type/';
import { ChplUploadListings } from './upload/';
import { reactToAngularComponent } from '../services/angular-react-helper.jsx';

angular
  .module('chpl.components', [
    'angularMoment',
    'angulartics',
    'chpl.services',
    'feature-flags',
    'ngAvatar',
    'ngCytoscape',
    'ngFileUpload',
    'ngIdle',
    'ngResource',
    'ngStorage',
    'smart-table',
    'toaster',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplConfirmListingsBridge', reactToAngularComponent(ChplConfirmListings))
  .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis))
  .component('chplFuzzyTypeBridge', reactToAngularComponent(ChplFuzzyType))
  .component('chplUploadListingsBridge', reactToAngularComponent(ChplUploadListings))
;
