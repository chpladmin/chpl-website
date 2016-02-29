;(function () {
    'use strict';

    angular.module('app.registration')
        .controller('ApiKeyTosController', ['$modalInstance', function ($modalInstance) {
            var vm = this;

            vm.cancel = cancel;
            vm.close = close;

            ////////////////////////////////////////////////////////////////////

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function close () {
                $modalInstance.close('closed');
            }
        }]);
})();
