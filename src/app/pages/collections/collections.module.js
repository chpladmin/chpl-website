import ChplApiDocumentationCollectionWrapper from './api-documentation/api-documentation-wrapper';
import ChplRealWorldTestingCollectionWrapper from './real-world-testing/real-world-testing-wrapper';
import ChplBannedDevelopersCollectionPage from './banned-developers/banned-developers';

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
  .component('chplBannedDevelopersCollectionPageBridge', reactToAngularComponent(ChplBannedDevelopersCollectionPage))
  .component('chplRealWorldTestingCollectionWrapperBridge', reactToAngularComponent(ChplRealWorldTestingCollectionWrapper));
