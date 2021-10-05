import IndexWrapper from '../index-wrapper';
import { reactToAngularComponent } from '../services/angular-react-helper';

import { ChplApiKeyConfirm } from './api-key';
import ChplAttestationChangeRequest from './attestation';
import ChplCronGen from './cron-gen';
import { ChplFuzzyType } from './fuzzy-type';
import { ChplConfirmDeveloper, ChplConfirmListings } from './listing/confirm';
import { ChplCriteria } from './listing/details/criteria';
import ChplSurveillanceView from './listing/details/surveillance/surveillance-view';
import {
  ChplComplaintAdd,
  ChplComplaintEdit,
  ChplComplaintView,
  ChplComplaints,
} from './surveillance/complaints';
import { ChplSurveillanceActivityReportingDateSelector } from './surveillance/manage';
import {
  ChplUploadListings,
  ChplUploadMeaningfulUse,
  ChplUploadPromotingInteroperability,
  ChplUploadSurveillance,
} from './upload';
import { ChplUsers } from './user';
import {
  ChplConfirmation,
  ChplEllipsis,
  ChplLink,
  ChplNonProdIndicator,
} from './util';
import { UserWrapper } from './login';

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
  .component('chplAttestationChangeRequestBridge', reactToAngularComponent(ChplAttestationChangeRequest))
  .component('chplComplaintAddBridge', reactToAngularComponent(ChplComplaintAdd))
  .component('chplComplaintEditBridge', reactToAngularComponent(ChplComplaintEdit))
  .component('chplComplaintViewBridge', reactToAngularComponent(ChplComplaintView))
  .component('chplComplaintsBridge', reactToAngularComponent(ChplComplaints))
  .component('chplConfirmDeveloperBridge', reactToAngularComponent(ChplConfirmDeveloper))
  .component('chplConfirmListingsBridge', reactToAngularComponent(ChplConfirmListings))
  .component('chplConfirmationBridge', reactToAngularComponent(ChplConfirmation))
  .component('chplCriteriaBridge', reactToAngularComponent(ChplCriteria))
  .component('chplCronGenBridge', reactToAngularComponent(ChplCronGen))
  .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis))
  .component('chplFuzzyTypeBridge', reactToAngularComponent(ChplFuzzyType))
  .component('chplLinkBridge', reactToAngularComponent(ChplLink))
  .component('chplNonProdIndicatorBridge', reactToAngularComponent(ChplNonProdIndicator))
  .component('chplSurveillanceActivityReportingDateSelectorBridge', reactToAngularComponent(ChplSurveillanceActivityReportingDateSelector))
  .component('chplSurveillanceViewBridge', reactToAngularComponent(ChplSurveillanceView))
  .component('chplUploadListingsBridge', reactToAngularComponent(ChplUploadListings))
  .component('chplUploadMeaningfulUseBridge', reactToAngularComponent(ChplUploadMeaningfulUse))
  .component('chplUploadPromotingInteroperabilityBridge', reactToAngularComponent(ChplUploadPromotingInteroperability))
  .component('chplUploadSurveillanceBridge', reactToAngularComponent(ChplUploadSurveillance))
  .component('chplUsersBridge', reactToAngularComponent(ChplUsers))
  .component('indexWrapperBridge', reactToAngularComponent(IndexWrapper))
  .component('userWrapperBridge', reactToAngularComponent(UserWrapper));
