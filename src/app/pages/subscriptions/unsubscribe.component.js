const UnsubscribeAllComponent = {
  template: '<chpl-unsubscribe-all-bridge hash="$ctrl.hash"></chpl-unsubscribe-all-bridge>',
  bindings: {
    hash: '<',
  },
  controller: class UnsubscribeAllComponent {
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
  .component('chplSubscriptionsUnsubscribeAll', UnsubscribeAllComponent);

export default UnsubscribeAllComponent;
