import ChplNotFound from './not-found';
import ChplResourcesDownload from './download';
import ChplSwagger from './chpl-api';

import { reactToAngularComponent } from '../../services/angular-react-helper';

angular
  .module('chpl.resources', [
    'angulartics',
    'chpl.constants',
    'chpl.services',
    'ngStorage',
  ])
  .component('chplNotFoundBridge', reactToAngularComponent(ChplNotFound))
  .component('chplResourcesDownloadBridge', reactToAngularComponent(ChplResourcesDownload))
  .component('chplSwaggerBridge', reactToAngularComponent(ChplSwagger));
