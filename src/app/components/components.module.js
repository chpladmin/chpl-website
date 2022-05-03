import IndexWrapper from '../index-wrapper';

import { ChplAnnouncementsWrapper } from './announcement';
import { ChplApiKeyConfirm } from './api-key';
import { ChplChangeRequestsWrapper } from './change-request';
import {
  ChplAttestationCreateWrapper,
  ChplAttestationEditWrapper,
  ChplAttestationsViewWrapper,
} from './attestation';
import ChplCronGen from './cron-gen';
import { ChplDeveloper } from './developer';
import { ChplFuzzyType } from './fuzzy-type';
import {
  ChplConfirmDeveloper,
  ChplConfirmListingsWrapper,
  ChplConfirmProduct,
  ChplConfirmProgress,
  ChplConfirmVersion,
} from './listing/confirm';
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
import { ChplActionBar, ChplActionBarWrapper } from './action-bar';
import { UserWrapper } from './login';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.components', [
    'angulartics',
    'chpl.services',
    'feature-flags',
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
  .component('chplActionBarBridge', reactToAngularComponent(ChplActionBar))
  .component('chplActionBarWrapperBridge', reactToAngularComponent(ChplActionBarWrapper))
  .component('chplApiKeyConfirmBridge', reactToAngularComponent(ChplApiKeyConfirm))
  .component('chplAttestationCreateWrapperBridge', reactToAngularComponent(ChplAttestationCreateWrapper))
  .component('chplAttestationEditWrapperBridge', reactToAngularComponent(ChplAttestationEditWrapper))
  .component('chplAttestationsViewWrapperBridge', reactToAngularComponent(ChplAttestationsViewWrapper))
  .component('chplAnnouncementsWrapperBridge', reactToAngularComponent(ChplAnnouncementsWrapper))
  .component('chplChangeRequestsWrapperBridge', reactToAngularComponent(ChplChangeRequestsWrapper))
  .component('chplComplaintAddBridge', reactToAngularComponent(ChplComplaintAdd))
  .component('chplComplaintEditBridge', reactToAngularComponent(ChplComplaintEdit))
  .component('chplComplaintViewBridge', reactToAngularComponent(ChplComplaintView))
  .component('chplComplaintsBridge', reactToAngularComponent(ChplComplaints))
  .component('chplConfirmDeveloperBridge', reactToAngularComponent(ChplConfirmDeveloper))
  .component('chplConfirmListingsWrapperBridge', reactToAngularComponent(ChplConfirmListingsWrapper))
  .component('chplConfirmProductBridge', reactToAngularComponent(ChplConfirmProduct))
  .component('chplConfirmProgressBridge', reactToAngularComponent(ChplConfirmProgress))
  .component('chplConfirmVersionBridge', reactToAngularComponent(ChplConfirmVersion))
  .component('chplConfirmationBridge', reactToAngularComponent(ChplConfirmation))
  .component('chplCriteriaBridge', reactToAngularComponent(ChplCriteria))
  .component('chplCronGenBridge', reactToAngularComponent(ChplCronGen))
  .component('chplDeveloperBridge', reactToAngularComponent(ChplDeveloper))
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
