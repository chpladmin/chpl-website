(function () {
    'use strict';

    angular.module('chpl.product')
        .controller('ProductController', ProductController);

    /** @ngInclude */
    function ProductController ($log, $routeParams, commonService, authService) {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.productId = $routeParams.id;
            commonService.getProduct(vm.productId)
                .then(function (data) {
                    vm.product = data;
                }, function (error) {
                    $log.error(error);
                });
            commonService.getCap(vm.productId)
                .then(function (data) {
                    vm.correctiveActionPlan = data.plans;
                }, function (error) {
                    $log.error (error);
                });
            vm.isAuthed = authService.isAuthed();
        }
    }
})();
