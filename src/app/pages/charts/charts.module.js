import ChplChartsWrapper from './charts-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

export default angular
  .module('chpl.charts', [])
  .component('chplChartsBridge', reactToAngularComponent(ChplChartsWrapper));
