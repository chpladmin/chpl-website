import { ChplDevelopersWrapper } from './developers';

import { reactToAngularComponent } from 'services/angular-react-helper';

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
