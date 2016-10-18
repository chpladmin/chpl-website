;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('CmsController', ['$log', 'commonService', 'authService', function ($log, commonService, authService) {
            var vm = this;

            vm.getDownload = getDownload;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                self.isAcbAdmin = authService.isAcbAdmin();
                self.isOncStaff = authService.isOncStaff();

                vm.filename = 'CMS_IDs_' + new Date().getTime() + '.csv';
                if (authService.isChplAdmin() || authService.isOncStaff()) {
                    vm.csvHeader = ['CMS ID', 'Creation Date', 'CHPL Product(s)'];
                    vm.csvColumnOrder = ['certificationId', 'created', 'products'];
                } else {
                    vm.csvHeader = ['CMS ID', 'Creation Date'];
                    vm.csvColumnOrder = ['certificationId', 'created'];
                }
                vm.isReady = false;
                vm.getDownload();
            }

            function getDownload () {
                commonService.getCmsDownload()
                    .then(function (result) {
                        for (var i = 0; i < result.length; i++) {
                            result[i].created = new Date(result[i].created).toISOString().substring(0, 10);
                        }
                        vm.cmsArray = result
                        vm.isReady = true;
                    }, function (error) {
                        $log.debug('error in app.admin.cmsController.getDownload', error);
                    });
            }
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
