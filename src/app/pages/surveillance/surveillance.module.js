import ChplSurveillanceReporting from './reporting/reporting-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.surveillance', [
    'chpl.services',
  ])
  .component('chplSurveillanceReportingBridge', reactToAngularComponent(ChplSurveillanceReporting));
