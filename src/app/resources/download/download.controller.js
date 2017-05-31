(function () {
    'use strict';

    angular.module('chpl.download')
        .controller('DownloadController', DownloadController);

    /** @ngInject */
    function DownloadController ($log, API, authService) {
        var vm = this;

        vm.getToken = authService.getToken;
        vm.showRestricted = showRestricted;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.API = API;
            vm.API_KEY = authService.getApiKey();

            vm.downloadOptions = [
                { value: vm.API + '/download?api_key=' + vm.API_KEY, label: 'Complete XML', display: 'Complete listing (xml)'},
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&edition=2015', label: '2015 XML', display: '2015 edition products (xml)'},
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&edition=2014', label: '2014 XML', display: '2014 edition products (xml)'},
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&edition=2011', label: '2011 XML', display: '2011 edition products (xml)'},
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&edition=2015&format=csv', label: '2015 CSV', display: '2015 edition summary (csv)'},
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&edition=2014&format=csv', label: '2014 CSV', display: '2014 edition summary (csv)'},
                { value: vm.API + '/surveillance/download?api_key=' + vm.API_KEY + '&type=all', label: 'Surveillance', display: 'Surveillance Activity'}
            ]
            if (vm.showRestricted()) {
                vm.downloadOptions.push({ value: vm.API + '/surveillance/download?api_key=' + vm.API_KEY + '&type=basic&authorization=Bearer%20' + vm.getToken(), label: 'Surveillance (Basic)', display: 'Surveillance (Basic)'});
            }
            vm.downloadOptions.push({ value: vm.API + '/surveillance/download?api_key=' + vm.API_KEY, label: 'Non-Conformities', display: 'Non-Conformities'});

            vm.downloadOption = vm.downloadOptions[0];
        }

        function showRestricted () {
            return authService.isChplAdmin() ||
                authService.isOncStaff();
        }
    }
})();
