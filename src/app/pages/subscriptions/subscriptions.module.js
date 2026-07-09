import ChplConfirmSubscription from './confirm-subscription-wrapper';
import ChplUnsubscribeAll from './unsubscribe-all-wrapper';
import ChplManageSubscription from './manage-subscription-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

angular
  .module('chpl.subscriptions', [
    'chpl.services',
  ])
  .component('chplConfirmSubscriptionBridge', reactToAngularComponent(ChplConfirmSubscription))
  .component('chplUnsubscribeAllBridge', reactToAngularComponent(ChplUnsubscribeAll))
  .component('chplManageSubscriptionBridge', reactToAngularComponent(ChplManageSubscription));
