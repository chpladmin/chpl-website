import ChplApiDocumentationCollectionWrapper from './api-documentation/api-documentation-wrapper';
import { ChplRealWorldTestingCollectionPage } from './real-world-testing';

import { reactToAngularComponent } from 'services/angular-react-helper';

export default angular
  .module('chpl.collections', [
    'angulartics',
    'feature-flags',
    'ngStorage',
    'chpl.services',
    'chpl.constants',
    'ui.bootstrap',
  ])
  .component('chplApiDocumentationCollectionWrapperBridge', reactToAngularComponent(ChplApiDocumentationCollectionWrapper))
  .component('chplRealWorldTestingCollectionPageBridge', reactToAngularComponent(ChplRealWorldTestingCollectionPage));
