import { ChplApiKeyConfirm, ChplApiKeyRegistration } from './api-key';
import { ChplComplaintEdit, ChplComplaintView, ChplComplaints } from './surveillance/complaints';
import { ChplConfirmDeveloper, ChplConfirmListings } from './listing/confirm';
import { ChplCriteria } from './listing/details/criteria';
import { ChplConfirmation, ChplEllipsis, ChplLink, ChplNonProdIndicator } from './util';
import { ChplFuzzyType } from './fuzzy-type';
import ChplSurveillanceView from './listing/details/surveillance/surveillance-view';
import { ChplSurveillanceActivityReportingDateSelector } from './surveillance/manage';
import { ChplUploadListings, ChplUploadMeaningfulUse, ChplUploadSurveillance } from './upload';
import { ChplUsers } from './user';
import { reactToAngularComponent } from '../services/angular-react-helper';

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
  .component('chplComplaintViewBridge', reactToAngularComponent(ChplComplaintView))
  .component('chplComplaintEditBridge', reactToAngularComponent(ChplComplaintEdit))
  .component('chplComplaintsBridge', reactToAngularComponent(ChplComplaints))
  .component('chplConfirmationBridge', reactToAngularComponent(ChplConfirmation))
  .component('chplConfirmDeveloperBridge', reactToAngularComponent(ChplConfirmDeveloper))
  .component('chplConfirmListingsBridge', reactToAngularComponent(ChplConfirmListings))
  .component('chplCriteriaBridge', reactToAngularComponent(ChplCriteria))
  .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis))
  .component('chplFuzzyTypeBridge', reactToAngularComponent(ChplFuzzyType))
  .component('chplLinkBridge', reactToAngularComponent(ChplLink))
  .component('chplNonProdIndicatorBridge', reactToAngularComponent(ChplNonProdIndicator))
  .component('chplSurveillanceActivityReportingDateSelectorBridge', reactToAngularComponent(ChplSurveillanceActivityReportingDateSelector))
  .component('chplSurveillanceViewBridge', reactToAngularComponent(ChplSurveillanceView))
  .component('chplUploadListingsBridge', reactToAngularComponent(ChplUploadListings))
  .component('chplUploadMeaningfulUseBridge', reactToAngularComponent(ChplUploadMeaningfulUse))
  .component('chplUsersBridge', reactToAngularComponent(ChplUsers))
  .component('chplUploadSurveillanceBridge', reactToAngularComponent(ChplUploadSurveillance));
