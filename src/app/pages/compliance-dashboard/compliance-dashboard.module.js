import ChplComplianceDashboardWrapper from './compliance-dashboard-wrapper';
import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.compliance-dashboard', [
    'chpl.constants',
    'chpl.services',
    'ui.router',
    // other dependencies as needed
  ])
  .component('chplComplianceDashboardWrapperBridge', reactToAngularComponent(ChplComplianceDashboardWrapper));