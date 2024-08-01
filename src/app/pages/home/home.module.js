import ChplHomeWrapper from './home-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

export default angular
  .module('chpl.home', [
    'angulartics',
    'chpl.services',
    'ui.bootstrap',
  ])
  .component('chplHomeWrapperBridge', reactToAngularComponent(ChplHomeWrapper));
