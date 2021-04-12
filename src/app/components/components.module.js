import { ChplApiKeyConfirm } from './api-key';
import { ChplApiKeyRegistration } from './api-key';
import { ChplEllipsis } from './util';
import { ChplFuzzyType } from './fuzzy-type';
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
  .component('chplApiKeyConfirmBridge', reactToAngularComponent(ChplApiKeyConfirm))
  .component('chplApiKeyRegistrationBridge', reactToAngularComponent(ChplApiKeyRegistration))
  .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis))
  .component('chplFuzzyTypeBridge', reactToAngularComponent(ChplFuzzyType))
;
