const ConfirmSubscriptionComponent = {
  template: '<chpl-confirm-subscription-bridge hash="$ctrl.hash"></chpl-confirm-subscription-bridge>',
  bindings: {
    hash: '<',
  },
  controller: class ConfirmSubscriptionComponent {
    constructor($log) {
      'ngInject';

      this.$log = $log;
    }

    $onChanges(changes) {
      if (changes.hash.currentValue) {
        this.hash = changes.hash.currentValue;
      }
    }
  },
};

angular.module('chpl.subscriptions')
  .component('chplSubscriptionsConfirmSubscription', ConfirmSubscriptionComponent);

export default ConfirmSubscriptionComponent;
