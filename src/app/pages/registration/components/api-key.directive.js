(function () {
  'use strict';

  angular.module('chpl.registration')
    .directive('aiApiKey', aiApiKey)
    .controller('ApiKeyController', ApiKeyController);

  /** @ngInject */
  function aiApiKey () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'chpl.registration/components/api-key.html',
      scope: {},
      bindToController: {
        admin: '=',
      },
      controllerAs: 'vm',
      controller: 'ApiKeyController',
    };
  }

  /** @ngInject */
  function ApiKeyController ($analytics, $log, networkService) {
    var vm = this;

    vm.loadUsers = loadUsers;
    vm.revoke = revoke;

    ////////////////////////////////////////////////////////////////////

    this.$onInit = function () {
      vm.hasKey = false;
      if (vm.admin) {
        vm.loadUsers();
      }
    };

    function loadUsers () {
      networkService.getApiUsers()
        .then(function (result) {
          vm.users = result;
        }, function (error) {
          $log.debug('error in app.registration.apiKey.controller.loadUsers', error);
        });
    }

    function revoke (user) {
      if (user.key) {
        networkService.revokeApi(user)
          .then(function () {
            vm.loadUsers();
          }, function (error) {
            $log.debug('error in app.registration.apiKey.controller.revoke', error);
          });
      }
    }
  }
})();
