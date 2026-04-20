import ChplComplianceDashboardWrapper from './compliance-dashboard-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

export default angular
  .module('chpl.compliance-dashboard', [])
  .component('chplComplianceDashboardBridge', reactToAngularComponent(ChplComplianceDashboardWrapper));
