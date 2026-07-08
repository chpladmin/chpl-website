import ChplUsersPage from './users-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

export default angular
  .module('chpl.users', [
    'chpl.components',
    'chpl.services',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('chplUsersPageBridge', reactToAngularComponent(ChplUsersPage));
