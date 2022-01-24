import { reactToAngularComponent } from '../../services/angular-react-helper';

import { ChplRealWorldTestingCollectionPage } from './real-world-testing';

export default angular
  .module('chpl.collections', [
    'angulartics',
    'feature-flags',
    'ngStorage',
    'chpl.services',
    'chpl.constants',
    'ui.bootstrap',
  ])
  .component('chplRealWorldTestingCollectionPageBridge', reactToAngularComponent(ChplRealWorldTestingCollectionPage));
