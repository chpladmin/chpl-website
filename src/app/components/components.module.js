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
import ChplBrowserViewedWidgetWrapper from './browser/browser-viewed-widget-wrapper';
import ChplChangeRequestsWrapper from './change-request/change-requests-wrapper';
import ChplCmsDisplayWrapper from './cms-widget/cms-display-wrapper';
import ChplCompareDisplayWrapper from './compare-widget/compare-display-wrapper';
import { ChplDeveloper } from './developer';
import ChplDirectReviewsView from './direct-reviews/direct-reviews-view';
import {
  ChplConfirmDeveloperWrapper,
  ChplConfirmListingsWrapper,
  ChplConfirmProduct,
  ChplConfirmProgress,
  ChplConfirmVersion,
} from './listing/confirm';
import ChplCqms from './listing/details/cqms/cqms-wrapper';
import ChplCriteriaWrapper from './listing/details/criteria/criteria-wrapper';
import ChplG1g2 from './listing/details/g1g2/g1g2-wrapper';
import ChplAdditionalinformationWrapper from './listing/details/additional-information/additional-information-wrapper';
import ChplIcsFamily from './listing/details/ics-family/ics-family-wrapper';
import ChplSurveillanceView from './listing/details/surveillance/surveillance-view';
import ChplSed from './listing/details/sed/sed-wrapper';
import ChplSedDetailsEditWrapper from './listing/details/sed/details-edit/wrapper';
import ChplSedTaskView from './listing/details/sed/sed-task-view-wrapper';
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
  .component('chplAdditionalInformationWrapperBridge', reactToAngularComponent(ChplAdditionalinformationWrapper))
  .component('chplApiKeyConfirmBridge', reactToAngularComponent(ChplApiKeyConfirm))
  .component('chplAttestationCreateWrapperBridge', reactToAngularComponent(ChplAttestationCreateWrapper))
  .component('chplAttestationEditWrapperBridge', reactToAngularComponent(ChplAttestationEditWrapper))
  .component('chplAttestationsViewWrapperBridge', reactToAngularComponent(ChplAttestationsViewWrapper))
  .component('chplBrowserComparedWidgetBridge', reactToAngularComponent(ChplBrowserComparedWidgetWrapper))
  .component('chplBrowserViewedWidgetBridge', reactToAngularComponent(ChplBrowserViewedWidgetWrapper))
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
  .component('chplCqmsBridge', reactToAngularComponent(ChplCqms))
  .component('chplCriteriaBridge', reactToAngularComponent(ChplCriteriaWrapper))
  .component('chplDirectReviewsViewBridge', reactToAngularComponent(ChplDirectReviewsView))
  .component('chplDeveloperBridge', reactToAngularComponent(ChplDeveloper))
  .component('chplEllipsisBridge', reactToAngularComponent(ChplEllipsis))
  .component('chplG1g2Bridge', reactToAngularComponent(ChplG1g2))
  .component('chplIcsFamilyBridge', reactToAngularComponent(ChplIcsFamily))
  .component('chplLinkBridge', reactToAngularComponent(ChplLink))
  .component('chplNonProdIndicatorBridge', reactToAngularComponent(ChplNonProdIndicator))
  .component('chplSedBridge', reactToAngularComponent(ChplSed))
  .component('chplSedDetailsEditWrapperBridge', reactToAngularComponent(ChplSedDetailsEditWrapper))
  .component('chplSedTaskViewBridge', reactToAngularComponent(ChplSedTaskView))
  .component('chplSurveillanceActivityReportingDateSelectorBridge', reactToAngularComponent(ChplSurveillanceActivityReportingDateSelector))
  .component('chplSurveillanceViewBridge', reactToAngularComponent(ChplSurveillanceView))
  .component('chplUploadPromotingInteroperabilityBridge', reactToAngularComponent(ChplUploadPromotingInteroperability))
  .component('chplUploadWrapperBridge', reactToAngularComponent(ChplUploadWrapper))
  .component('chplUsersBridge', reactToAngularComponent(ChplUsers))
  .component('indexWrapperBridge', reactToAngularComponent(IndexWrapper));
