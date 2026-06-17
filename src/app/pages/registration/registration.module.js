import ChplRegisterUser from './register-user-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.registration', [
    'chpl.services',
    'feature-flags',
  ])
  .component('chplRegisterUserBridge', reactToAngularComponent(ChplRegisterUser));
