const ManageSubscriptionComponent = {
  template: '<chpl-manage-subscription-bridge hash="$ctrl.hash"></chpl-manage-subscription-bridge>',
  bindings: {
    hash: '<',
  },
  controller: class ManageSubscriptionComponent {
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
  .component('chplSubscriptionsManageSubscription', ManageSubscriptionComponent);

export default ManageSubscriptionComponent;
