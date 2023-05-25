import ChplConfirmSubscription from './confirm-subscription-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.subscriptions', [
    'angulartics',
    'chpl.services',
    'feature-flags',
  ])
  .component('chplConfirmSubscriptionBridge', reactToAngularComponent(ChplConfirmSubscription));
