import { reactToAngularComponent } from '../../services/angular-react-helper';

import ChplCmsLookupWrapper from './cms-lookup/cms-lookup-wrapper';
import ChplDashboardWrapper from './dashboard/dashboard-wrapper';
import ChplReportsDashboardWrapper from './reports-dashboard/reports-dashboard-wrapper';
import ChplForgotPassword from './forgot-password/forgot-password-wrapper';
import ChplNotFound from './not-found/not-found';
import ChplResourcesApi from './api/api-wrapper';
import ChplResourcesDownloadWrapper from './download/download-wrapper';
import ChplResourcesOverview from './overview/overview-wrapper';

angular
  .module('chpl.resources', [
    'angulartics',
    'chpl.constants',
    'chpl.services',
    'ngStorage',
  ])
  .component('chplCmsLookupWrapperBridge', reactToAngularComponent(ChplCmsLookupWrapper))
  .component('chplDashboardWrapperBridge', reactToAngularComponent(ChplDashboardWrapper))
  .component('chplReportsDashboardWrapperBridge', reactToAngularComponent(ChplReportsDashboardWrapper))
  .component('chplForgotPasswordBridge', reactToAngularComponent(ChplForgotPassword))
  .component('chplNotFoundBridge', reactToAngularComponent(ChplNotFound))
  .component('chplResourcesApiBridge', reactToAngularComponent(ChplResourcesApi))
  .component('chplResourcesDownloadWrapperBridge', reactToAngularComponent(ChplResourcesDownloadWrapper))
  .component('chplResourcesOverviewBridge', reactToAngularComponent(ChplResourcesOverview));
