import { reactToAngularComponent } from '../../services/angular-react-helper';

import { ChplRealWorldTestingCollectionPageWrapper } from './real-world-testing';

export default angular
  .module('chpl.collections', [
    'angulartics',
    'feature-flags',
    'ngStorage',
    'chpl.services',
    'chpl.constants',
    'ui.bootstrap',
  ])
  .component('chplRealWorldTestingCollectionPageWrapperBridge', reactToAngularComponent(ChplRealWorldTestingCollectionPageWrapper));
