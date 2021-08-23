import 'angular-swagger-ui';
import ChplNotFound from './not-found';
import ChplResourcesDownload from './download';
import { reactToAngularComponent } from '../../services/angular-react-helper';

angular
  .module('chpl.resources', [
    'angulartics',
    'chpl.constants',
    'chpl.services',
    'ngStorage',
    'swaggerUi',
  ])
  .component('chplNotFoundBridge', reactToAngularComponent(ChplNotFound))
  .component('chplResourcesDownloadBridge', reactToAngularComponent(ChplResourcesDownload));
