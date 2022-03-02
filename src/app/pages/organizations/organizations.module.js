import { reactToAngularComponent } from 'services/angular-react-helper';

import { ChplDevelopersWrapper } from './developers';

angular
  .module('chpl.organizations', [
    'chpl.components',
    'chpl.services',
    'feature-flags',
    'toaster',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplDevelopersWrapperBridge', reactToAngularComponent(ChplDevelopersWrapper));
