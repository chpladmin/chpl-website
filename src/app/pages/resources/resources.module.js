import ChplNotFound from './not-found';
import ChplResourcesDownload from './download';
import ChplResourcesApi from './api';

import { reactToAngularComponent } from '../../services/angular-react-helper';

angular
  .module('chpl.resources', [
    'angulartics',
    'chpl.constants',
    'chpl.services',
    'ngStorage',
  ])
  .component('chplNotFoundBridge', reactToAngularComponent(ChplNotFound))
  .component('chplResourcesApiBridge', reactToAngularComponent(ChplResourcesApi))
  .component('chplResourcesDownloadBridge', reactToAngularComponent(ChplResourcesDownload));
