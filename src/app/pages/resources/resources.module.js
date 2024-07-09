import { reactToAngularComponent } from '../../services/angular-react-helper';

import ChplCmsLookupWrapper from './cms-lookup/cms-lookup-wrapper';
import ChplNotFound from './not-found';
import ChplResourcesApi from './api';
import ChplResourcesDownloadWrapper from './download/download-wrapper';
import ChplResourcesOverview from './overview';
import ChplStyleGuide from './style-guide';
import PowerBI from './power-bi';

angular
  .module('chpl.resources', [
    'angulartics',
    'chpl.constants',
    'chpl.services',
    'ngStorage',
  ])
  .component('chplCmsLookupWrapperBridge', reactToAngularComponent(ChplCmsLookupWrapper))
  .component('chplNotFoundBridge', reactToAngularComponent(ChplNotFound))
  .component('chplResourcesApiBridge', reactToAngularComponent(ChplResourcesApi))
  .component('chplResourcesDownloadWrapperBridge', reactToAngularComponent(ChplResourcesDownloadWrapper))
  .component('chplResourcesOverviewBridge', reactToAngularComponent(ChplResourcesOverview))
  .component('chplStyleGuideBridge', reactToAngularComponent(ChplStyleGuide))
  .component('powerBIBridge', reactToAngularComponent(PowerBI));
