import ChplNotFound from './not-found';
import ChplResourcesApi from './api';
import ChplResourcesDownload from './download';
import ChplResourcesOverview from './overview';
import ChplStyleGuide from './style-guide';

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
  .component('chplResourcesDownloadBridge', reactToAngularComponent(ChplResourcesDownload))
  .component('chplResourcesOverviewBridge', reactToAngularComponent(ChplResourcesOverview))
  .component('chplStyleGuideBridge', reactToAngularComponent(ChplStyleGuide));
