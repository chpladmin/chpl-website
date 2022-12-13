import IndexWrapper from '../index-wrapper';

import { ChplApiKeyConfirm } from './api-key';
import {
  ChplAttestationCreateWrapper,
  ChplAttestationEditWrapper,
  ChplAttestationsViewWrapper,
} from './attestation';
import ChplChangeRequestsWrapper from './change-request/change-requests-wrapper';
import { ChplDeveloper } from './developer';
import ChplDirectReviewsView from './direct-reviews/direct-reviews-view';
import { ChplFuzzyType } from './fuzzy-type';
import {
  ChplConfirmDeveloperWrapper,
  ChplConfirmListingsWrapper,
  ChplConfirmProduct,
  ChplConfirmProgress,
  ChplConfirmVersion,
} from './listing/confirm';
import { ChplCriteria } from './listing/details/criteria';
import ChplIcsFamily from './listing/details/ics-family/ics-family';
import ChplSurveillanceView from './listing/details/surveillance/surveillance-view';
import ChplSedDetailsEditWrapper from './listing/details/sed/details-edit/wrapper';
import ChplComplaintsWrapper from './surveillance/complaints/complaints-wrapper';
import { ChplSurveillanceActivityReportingDateSelector } from './surveillance/manage';
import {
  ChplUploadPromotingInteroperability,
  ChplUploadWrapper,
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
  .component('chplChangeRequestsWrapperBridge', reactToAngularComponent(ChplChangeRequestsWrapper))
  .component('chplComplaintsWrapperBridge', reactToAngularComponent(ChplComplaintsWrapper))
  .component('chplConfirmDeveloperWrapperBridge', reactToAngularComponent(ChplConfirmDeveloperWrapper))
  .component('chplConfirmListingsWrapperBridge', reactToAngularComponent(ChplConfirmListingsWrapper))
  .component('chplConfirmProductBridge', reactToAngularComponent(ChplConfirmProduct))
  .component('chplConfirmProgressBridge', reactToAngularComponent(ChplConfirmProgress))
  .component('chplConfirmVersionBridge', reactToAngularComponent(ChplConfirmVersion))
  .component('chplConfirmationBridge', reactToAngularComponent(ChplConfirmation))
  .component('chplCriteriaBridge', reactToAngularComponent(ChplCriteria))
  .component('chplDirectReviewsViewBridge', reactToAngularComponent(ChplDirectReviewsView))
  .component('chplDeveloperBridge', reactToAngularComponent(ChplDeveloper))
  .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis))
  .component('chplFuzzyTypeBridge', reactToAngularComponent(ChplFuzzyType))
  .component('chplIcsFamilyBridge', reactToAngularComponent(ChplIcsFamily))
  .component('chplLinkBridge', reactToAngularComponent(ChplLink))
  .component('chplNonProdIndicatorBridge', reactToAngularComponent(ChplNonProdIndicator))
  .component('chplSedDetailsEditWrapperBridge', reactToAngularComponent(ChplSedDetailsEditWrapper))
  .component('chplSurveillanceActivityReportingDateSelectorBridge', reactToAngularComponent(ChplSurveillanceActivityReportingDateSelector))
  .component('chplSurveillanceViewBridge', reactToAngularComponent(ChplSurveillanceView))
  .component('chplUploadPromotingInteroperabilityBridge', reactToAngularComponent(ChplUploadPromotingInteroperability))
  .component('chplUploadWrapperBridge', reactToAngularComponent(ChplUploadWrapper))
  .component('chplUsersBridge', reactToAngularComponent(ChplUsers))
  .component('indexWrapperBridge', reactToAngularComponent(IndexWrapper))
  .component('userWrapperBridge', reactToAngularComponent(UserWrapper));
