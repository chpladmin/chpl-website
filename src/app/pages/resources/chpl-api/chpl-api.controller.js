(() => {
  /** @ngInject */
  function ChplApiController($log, authService) {
    const vm = this;

    function activate() {
      vm.apiKey = authService.getApiKey();
    }

    activate();
  }

  angular.module('chpl.resources')
    .controller('ChplApiController', ChplApiController);
})();
