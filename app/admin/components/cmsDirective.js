;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('CmsController', ['$log', 'commonService', 'authService', 'API', function ($log, commonService, authService, API) {
            var vm = this;

            vm.getDownload = getDownload();

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.API = API;
                vm.API_KEY = authService.getApiKey();
                //vm.loadAnnouncements();
                //vm.isChplAdmin = authService.isChplAdmin();
                //vm.errorMessage = '';
            }

            function getDownload () {
            }

            /*
            function loadAnnouncements () {
            	commonService.getAnnouncements(true)
            		.then (function (result) {
            			vm.announcements = result.announcements;
            		}, function (error) {
            			$log.debug('error in app.admin.announcement.controller.loadAnnouncements', error);
            		});
            }
*/
        }])
        .directive('aiCmsManagement', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/cms.html',
                scope: {},
                bindToController: {
                    //admin: '='
                },
                controllerAs: 'vm',
                controller: 'CmsController'
            };
        }]);
})();
