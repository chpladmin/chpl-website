import ChplComparePage from './compare-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.compare', [
    'chpl.components',
    'chpl.services',
    'feature-flags',
    'ui.router',
  ])
  .component('chplComparePageBridge', reactToAngularComponent(ChplComparePage));
