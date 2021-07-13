(function () {
  'use strict';

  angular.module('chpl.resources')
    .controller('ChplApiController', ChplApiController);

  /** @ngInject */
  function ChplApiController ($log, authService) {
    var vm = this;

    activate();

    ////////////////////////////////////////////////////////////////////

    function activate () {
      vm.apiKey = authService.getApiKey();
    }
  }
})();
