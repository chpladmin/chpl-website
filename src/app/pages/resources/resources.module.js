import { reactToAngularComponent } from '../../services/angular-react-helper';

import ChplCmsLookupWrapper from './cms-lookup/cms-lookup-wrapper';
import ChplForgotPassword from './forgot-password/forgot-password-wrapper';
import ChplNotFound from './not-found/not-found';
import ChplResourcesApi from './api';
import ChplResourcesDownloadWrapper from './download/download-wrapper';
import ChplResourcesOverview from './overview';
import ChplStyleGuide from './style-guide';
import PowerBiWrapper from './power-bi/power-bi-wrapper';

angular
  .module('chpl.resources', [
    'angulartics',
    'chpl.constants',
    'chpl.services',
    'ngStorage',
  ])
  .component('chplCmsLookupWrapperBridge', reactToAngularComponent(ChplCmsLookupWrapper))
  .component('chplForgotPasswordBridge', reactToAngularComponent(ChplForgotPassword))
  .component('chplNotFoundBridge', reactToAngularComponent(ChplNotFound))
  .component('chplResourcesApiBridge', reactToAngularComponent(ChplResourcesApi))
  .component('chplResourcesDownloadWrapperBridge', reactToAngularComponent(ChplResourcesDownloadWrapper))
  .component('chplResourcesOverviewBridge', reactToAngularComponent(ChplResourcesOverview))
  .component('chplStyleGuideBridge', reactToAngularComponent(ChplStyleGuide))
  .component('powerBiWrapperBridge', reactToAngularComponent(PowerBiWrapper));
