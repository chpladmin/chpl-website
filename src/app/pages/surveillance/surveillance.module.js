import 'ng-file-upload';
import ChplSurveillanceReporting from './reporting/reporting-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.surveillance', [
    'chpl.components',
    'chpl.services',
    'feature-flags',
    'ncy-angular-breadcrumb',
    'ngFileUpload',
    'smart-table',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplSurveillanceReportingBridge', reactToAngularComponent(ChplSurveillanceReporting));
