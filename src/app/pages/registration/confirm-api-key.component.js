export const ConfirmApiKeyPage = {
  templateUrl: 'chpl.registration/confirm-api-key.html',
  bindings: {
    hash: '<',
  },
  controller: class ApiKeyComponent {
    constructor ($log) {
      'ngInject';
      this.$log = $log;
    }

    $onChanges (changes) {
      this.hash = angular.copy(changes.hash.currentValue);
    }
  },
};

angular.module('chpl.administration')
  .component('chplConfirmApiKeyPage', ConfirmApiKeyPage);
