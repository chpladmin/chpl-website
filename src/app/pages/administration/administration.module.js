import 'ng-file-upload';
import ChplCmsWrapper from './cms/cms-wrapper';
import ChplConfirmWrapper from './confirm/confirm-wrapper';
import ChplLoginPage from './login/login-wrapper';
import ChplReportsWrapper from './reports/reports-wrapper';
import ChplSystemMaintenanceWrapper from './system-maintenance/system-maintenance-wrapper';
import ChplUploadPageWrapper from './upload/upload-page-wrapper';
import ChplUrlCheckerWrapper from './url-checker/url-checker-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.administration', [
    'angular-confirm',
    'chpl.constants',
    'chpl.services',
    'feature-flags',
    'ngIdle',
    'ngFileUpload',
    'ngSanitize',
    'smart-table',
    'toaster',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplCmsWrapperBridge', reactToAngularComponent(ChplCmsWrapper))
  .component('chplConfirmBridge', reactToAngularComponent(ChplConfirmWrapper))
  .component('chplLoginPageBridge', reactToAngularComponent(ChplLoginPage))
  .component('chplReportsWrapperBridge', reactToAngularComponent(ChplReportsWrapper))
  .component('chplSystemMaintenanceWrapperBridge', reactToAngularComponent(ChplSystemMaintenanceWrapper))
  .component('chplUploadPageWrapperBridge', reactToAngularComponent(ChplUploadPageWrapper))
  .component('chplUrlCheckerWrapperBridge', reactToAngularComponent(ChplUrlCheckerWrapper));
