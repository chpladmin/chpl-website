import ChplSurveillanceActivityReporting from './activity-reporting/activity-reporting-wrapper';
import ChplSurveillanceReporting from './reporting/reporting-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.surveillance', [
    'chpl.services',
  ])

  .component('chplSurveillanceActivityReportingBridge', reactToAngularComponent(ChplSurveillanceActivityReporting))
  .component('chplSurveillanceReportingBridge', reactToAngularComponent(ChplSurveillanceReporting));
