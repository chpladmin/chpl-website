import IndexWrapper from '../index-wrapper';

import ChplActionBarWrapper from './action-bar/action-bar-wrapper';
import ChplActionButtonWrapper from './action-widget/action-button-wrapper';
import { ChplApiKeyConfirm } from './api-key';
import {
  ChplAttestationCreateWrapper,
  ChplAttestationEditWrapper,
  ChplAttestationsViewWrapper,
} from './attestation';
import ChplBrowserComparedWidgetWrapper from './browser/browser-compared-widget-wrapper';
import ChplChangeRequestsWrapper from './change-request/change-requests-wrapper';
import ChplCmsDisplayWrapper from './cms-widget/cms-display-wrapper';
import ChplCompareDisplayWrapper from './compare-widget/compare-display-wrapper';
import { ChplDeveloper } from './developer';
import ChplDirectReviewsWrapper from './direct-reviews/direct-reviews-wrapper';
import ChplListingView from './listing/listing-view-wrapper';
import {
  ChplConfirmDeveloperWrapper,
  ChplConfirmListingsWrapper,
  ChplConfirmProduct,
  ChplConfirmProgress,
  ChplConfirmVersion,
} from './listing/confirm';
import ChplCriteriaWrapper from './listing/details/criteria/criteria-wrapper';
import ChplIcsFamily from './listing/details/ics-family/ics-family-wrapper';
import ChplSurveillanceView from './listing/details/surveillance/surveillance-view';
import ChplSedDetailsEditWrapper from './listing/details/sed/details-edit/wrapper';
import ChplComplaintsWrapper from './surveillance/complaints/complaints-wrapper';
import ChplSurveillanceActivityReportingDateSelector from './surveillance/manage/reporting-date-selector';
import {
  ChplUploadPromotingInteroperability,
  ChplUploadWrapper,
} from './upload';
import ChplUsersWrapper from './user/users-wrapper';
import {
  ChplConfirmation,
  ChplEllipsis,
  ChplNonProdIndicator,
} from './util';

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
  .component('chplActionBarWrapperBridge', reactToAngularComponent(ChplActionBarWrapper))
  .component('chplActionButtonWrapperBridge', reactToAngularComponent(ChplActionButtonWrapper))
  .component('chplApiKeyConfirmBridge', reactToAngularComponent(ChplApiKeyConfirm))
  .component('chplAttestationCreateWrapperBridge', reactToAngularComponent(ChplAttestationCreateWrapper))
  .component('chplAttestationEditWrapperBridge', reactToAngularComponent(ChplAttestationEditWrapper))
  .component('chplAttestationsViewWrapperBridge', reactToAngularComponent(ChplAttestationsViewWrapper))
  .component('chplBrowserComparedWidgetBridge', reactToAngularComponent(ChplBrowserComparedWidgetWrapper))
  .component('chplChangeRequestsWrapperBridge', reactToAngularComponent(ChplChangeRequestsWrapper))
  .component('chplComplaintsWrapperBridge', reactToAngularComponent(ChplComplaintsWrapper))
  .component('chplCmsDisplayWrapperBridge', reactToAngularComponent(ChplCmsDisplayWrapper))
  .component('chplCompareDisplayWrapperBridge', reactToAngularComponent(ChplCompareDisplayWrapper))
  .component('chplConfirmDeveloperWrapperBridge', reactToAngularComponent(ChplConfirmDeveloperWrapper))
  .component('chplConfirmListingsWrapperBridge', reactToAngularComponent(ChplConfirmListingsWrapper))
  .component('chplConfirmProductBridge', reactToAngularComponent(ChplConfirmProduct))
  .component('chplConfirmProgressBridge', reactToAngularComponent(ChplConfirmProgress))
  .component('chplConfirmVersionBridge', reactToAngularComponent(ChplConfirmVersion))
  .component('chplConfirmationBridge', reactToAngularComponent(ChplConfirmation))
  .component('chplCriteriaBridge', reactToAngularComponent(ChplCriteriaWrapper))
  .component('chplDirectReviewsViewBridge', reactToAngularComponent(ChplDirectReviewsWrapper))
  .component('chplDeveloperBridge', reactToAngularComponent(ChplDeveloper))
  .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis))
  .component('chplIcsFamilyBridge', reactToAngularComponent(ChplIcsFamily))
  .component('chplListingViewBridge', reactToAngularComponent(ChplListingView))
  .component('chplNonProdIndicatorBridge', reactToAngularComponent(ChplNonProdIndicator))
  .component('chplSedDetailsEditWrapperBridge', reactToAngularComponent(ChplSedDetailsEditWrapper))
  .component('chplSurveillanceActivityReportingDateSelectorBridge', reactToAngularComponent(ChplSurveillanceActivityReportingDateSelector))
  .component('chplSurveillanceViewBridge', reactToAngularComponent(ChplSurveillanceView))
  .component('chplUploadPromotingInteroperabilityBridge', reactToAngularComponent(ChplUploadPromotingInteroperability))
  .component('chplUploadWrapperBridge', reactToAngularComponent(ChplUploadWrapper))
  .component('chplUsersBridge', reactToAngularComponent(ChplUsersWrapper))
  .component('indexWrapperBridge', reactToAngularComponent(IndexWrapper));
