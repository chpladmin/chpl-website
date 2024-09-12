import ChplApiDocumentationSearchWrapper from './api-documentation/api-documentation-wrapper';
import ChplBannedDevelopersSearchWrapper from './banned-developers/banned-developers-wrapper';
import ChplCorrectiveActionSearchWrapper from './corrective-action/corrective-action-wrapper';
import ChplDecertifiedProductsSearchWrapper from './decertified-products/decertified-products-wrapper';
import ChplInactiveCertificatesSearchWrapper from './inactive-certificates/inactive-certificates-wrapper';
import ChplRealWorldTestingSearchWrapper from './real-world-testing/real-world-testing-wrapper';
import ChplListingsSearchWrapper from './listings/listings-wrapper';
import ChplSedSearchWrapper from './sed/sed-wrapper';
import ChplSvapSearchWrapper from './svap/svap-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

export default angular
  .module('chpl.search', [
    'angulartics',
    'chpl.services',
    'ui.bootstrap',
  ])
  .component('chplApiDocumentationSearchWrapperBridge', reactToAngularComponent(ChplApiDocumentationSearchWrapper))
  .component('chplBannedDevelopersSearchPageBridge', reactToAngularComponent(ChplBannedDevelopersSearchWrapper))
  .component('chplCorrectiveActionSearchWrapperBridge', reactToAngularComponent(ChplCorrectiveActionSearchWrapper))
  .component('chplDecertifiedProductsSearchWrapperBridge', reactToAngularComponent(ChplDecertifiedProductsSearchWrapper))
  .component('chplInactiveCertificatesSearchWrapperBridge', reactToAngularComponent(ChplInactiveCertificatesSearchWrapper))
  .component('chplRealWorldTestingSearchWrapperBridge', reactToAngularComponent(ChplRealWorldTestingSearchWrapper))
  .component('chplListingsSearchWrapperBridge', reactToAngularComponent(ChplListingsSearchWrapper))
  .component('chplSedSearchWrapperBridge', reactToAngularComponent(ChplSedSearchWrapper))
  .component('chplSvapSearchWrapperBridge', reactToAngularComponent(ChplSvapSearchWrapper));
