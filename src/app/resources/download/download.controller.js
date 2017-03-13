(function () {
    'use strict';

    angular.module('chpl.download')
        .controller('DownloadController', DownloadController);

    /** @ngInject */
    function DownloadController ($scope, $log, API, authService) {
        var vm = this;

        vm.getToken = authService.getToken;
        vm.showRestricted = showRestricted;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.API = API;
            vm.API_KEY = authService.getApiKey();
            vm.downloadOption= vm.API + '/download?api_key=' + vm.API_KEY;
        }

        function showRestricted () {
            return authService.isChplAdmin() ||
                authService.isOncStaff();
        }
    }
})();
