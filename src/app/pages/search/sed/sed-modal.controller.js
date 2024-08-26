(function () {
  'use strict';

  angular.module('chpl.search')
    .controller('ViewSedModalController', ViewSedModalController);

  /** @ngInject */
  function ViewSedModalController ($analytics, $uibModal, $uibModalInstance, id, networkService) {
    var vm = this;

    vm.close = close;

    activate();

    ////////////////////////////////////////////////////////////////////

    function activate () {
      networkService.getListing(id)
        .then(data => {
          $analytics.eventTrack('Open SED Information', { category: 'SED Information for 2015 Edition Products', label: data.chplProductNumber });
          vm.listing = data;
        });
    }

    function close () {
      $uibModalInstance.close('cancelled');
    }
  }
})();
