import ChplApiDocumentationCollectionWrapper from './api-documentation/api-documentation-wrapper';
import ChplBannedDevelopersCollectionPage from './banned-developers/banned-developers';
import ChplCorrectiveActionCollectionWrapper from './corrective-action/corrective-action-wrapper';
import ChplDecertifiedProductsCollectionWrapper from './decertified-products/decertified-products-wrapper';
import ChplInactiveCertificatesCollectionWrapper from './inactive-certificates/inactive-certificates-wrapper';
import ChplRealWorldTestingCollectionWrapper from './real-world-testing/real-world-testing-wrapper';
import ChplSedCollectionWrapper from './sed/sed-wrapper';

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
  .component('chplCorrectiveActionCollectionWrapperBridge', reactToAngularComponent(ChplCorrectiveActionCollectionWrapper))
  .component('chplDecertifiedProductsCollectionWrapperBridge', reactToAngularComponent(ChplDecertifiedProductsCollectionWrapper))
  .component('chplInactiveCertificatesCollectionWrapperBridge', reactToAngularComponent(ChplInactiveCertificatesCollectionWrapper))
  .component('chplRealWorldTestingCollectionWrapperBridge', reactToAngularComponent(ChplRealWorldTestingCollectionWrapper))
  .component('chplSedCollectionWrapperBridge', reactToAngularComponent(ChplSedCollectionWrapper));
