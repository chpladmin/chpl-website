(function () {
    'use strict';

    angular.module('chpl.download')
        .controller('DownloadController', DownloadController);

    /** @ngInject */
    function DownloadController ($log, API, authService) {
        var vm = this;

        vm.changeDownload = changeDownload;
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
                { value: vm.API + '/surveillance/download?api_key=' + vm.API_KEY + '&type=all', label: 'Surveillance', display: 'Surveillance Activity'},
                { value: vm.API + '/surveillance/download?api_key=' + vm.API_KEY, label: 'Non-Conformities', display: 'Non-Conformities'}
            ]
            vm.definitionOptions = [
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&definition=true', label: 'Complete XML', display: 'Complete listing (xml) Definition File'},
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&edition=2015&definition=true', label: '2015 XML', display: '2015 edition products (xml) Definition File'},
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&edition=2014&definition=true', label: '2014 XML', display: '2014 edition products (xml) Definition File'},
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&edition=2011&definition=true', label: '2011 XML', display: '2011 edition products (xml) Definition File'},
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&edition=2015&format=csv&definition=true', label: '2015 CSV', display: '2015 edition summary (csv) Definition File'},
                { value: vm.API + '/download?api_key=' + vm.API_KEY + '&edition=2014&format=csv&definition=true', label: '2014 CSV', display: '2014 edition summary (csv) Definition File'},
                { value: vm.API + '/surveillance/download?api_key=' + vm.API_KEY + '&type=all&definition=true', label: 'Surveillance', display: 'Surveillance Activity Definition File'},
                { value: vm.API + '/surveillance/download?api_key=' + vm.API_KEY + '&definition=true', label: 'Non-Conformities', display: 'Non-Conformities Definition File'}
            ]

            if (vm.showRestricted()) {
                vm.downloadOptions.splice(7, 0, { value: vm.API + '/surveillance/download?api_key=' + vm.API_KEY + '&type=basic&authorization=Bearer%20' + vm.getToken(), label: 'Surveillance (Basic)', display: 'Surveillance (Basic)'});
                vm.definitionOptions.splice(7, 0, { value: vm.API + '/surveillance/download?api_key=' + vm.API_KEY + '&type=basic&definition=true&authorization=Bearer%20' + vm.getToken(), label: 'Surveillance (Basic)', display: 'Surveillance (Basic) Definition File'});
            }

            vm.downloadOption = vm.downloadOptions[0];
            vm.definitionOption = vm.definitionOptions[0];
        }

        function changeDownload () {
            for (var i = 0; i < vm.downloadOptions.length; i++) {
                if (vm.downloadOption === vm.downloadOptions[i]) {
                    vm.definitionOption = vm.definitionOptions[i];
                    break;
                }
            }
        }

        function showRestricted () {
            return authService.isChplAdmin() ||
                authService.isOncStaff();
        }
    }
})();
