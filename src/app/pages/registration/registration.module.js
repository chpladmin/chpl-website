import ChplApiKeyConfirmWrapper from './api-key-confirm-wrapper';
import ChplRegisterUser from './register-user-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.registration', [
    'chpl.services',
    'feature-flags',
  ])
  .component('chplApiKeyConfirmBridge', reactToAngularComponent(ChplApiKeyConfirmWrapper))
  .component('chplRegisterUserBridge', reactToAngularComponent(ChplRegisterUser));
