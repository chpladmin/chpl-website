import ChplApiDocumentationCollectionWrapper from './api-documentation/api-documentation-wrapper';
import ChplBannedDevelopersCollectionWrapper from './banned-developers/banned-developers-wrapper';
import ChplCorrectiveActionCollectionWrapper from './corrective-action/corrective-action-wrapper';
import ChplDecertifiedProductsCollectionWrapper from './decertified-products/decertified-products-wrapper';
import ChplInactiveCertificatesCollectionWrapper from './inactive-certificates/inactive-certificates-wrapper';
import ChplRealWorldTestingCollectionWrapper from './real-world-testing/real-world-testing-wrapper';
import ChplSearchWrapper from './search/search-wrapper';
import ChplSedCollectionWrapper from './sed/sed-wrapper';
import ChplSvapCollectionWrapper from './svap/svap-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

export default angular
  .module('chpl.collections', [
    'angulartics',
    'chpl.services',
    'ui.bootstrap',
  ])
  .component('chplApiDocumentationCollectionWrapperBridge', reactToAngularComponent(ChplApiDocumentationCollectionWrapper))
  .component('chplBannedDevelopersCollectionPageBridge', reactToAngularComponent(ChplBannedDevelopersCollectionWrapper))
  .component('chplCorrectiveActionCollectionWrapperBridge', reactToAngularComponent(ChplCorrectiveActionCollectionWrapper))
  .component('chplDecertifiedProductsCollectionWrapperBridge', reactToAngularComponent(ChplDecertifiedProductsCollectionWrapper))
  .component('chplInactiveCertificatesCollectionWrapperBridge', reactToAngularComponent(ChplInactiveCertificatesCollectionWrapper))
  .component('chplRealWorldTestingCollectionWrapperBridge', reactToAngularComponent(ChplRealWorldTestingCollectionWrapper))
  .component('chplSearchWrapperBridge', reactToAngularComponent(ChplSearchWrapper))
  .component('chplSedCollectionWrapperBridge', reactToAngularComponent(ChplSedCollectionWrapper))
  .component('chplSvapCollectionWrapperBridge', reactToAngularComponent(ChplSvapCollectionWrapper));
