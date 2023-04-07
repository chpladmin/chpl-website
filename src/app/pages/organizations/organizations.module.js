import { ChplDevelopersWrapper } from './developers';
import ChplDevelopersJoin from './developers/developer/join-wrapper';

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
  .component('chplDevelopersJoinBridge', reactToAngularComponent(ChplDevelopersJoin))
  .component('chplDevelopersWrapperBridge', reactToAngularComponent(ChplDevelopersWrapper));
