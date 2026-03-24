import ChplDashboardWrapper from './dashboard-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

export default angular
  .module('chpl.dashboard', [])
  .component('chplDashboardBridge', reactToAngularComponent(ChplDashboardWrapper));
