(() => {
  /** @ngInject */
  function ChplApiController($location) {
    const vm = this;

    function activate() {
      vm.swaggerUrl = `${$location.absUrl().split('#')[0]}rest/v3/api-docs`;
    }

    activate();
  }

  angular.module('chpl.resources')
    .controller('ChplApiController', ChplApiController);
})();
