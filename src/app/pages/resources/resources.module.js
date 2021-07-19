import 'angular-swagger-ui';
import ChplAttestations from './attestations';
import ChplNotFound from './not-found';
import ChplStyleGuide from './style-guide';
import { reactToAngularComponent } from '../../services/angular-react-helper';

angular
  .module('chpl.resources', [
    'angulartics',
    'chpl.constants',
    'chpl.services',
    'ngStorage',
    'swaggerUi',
  ])
  .component('chplAttestationsBridge', reactToAngularComponent(ChplAttestations))
  .component('chplNotFoundBridge', reactToAngularComponent(ChplNotFound))
  .component('chplStyleGuideBridge', reactToAngularComponent(ChplStyleGuide));
