(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('CmsController', CmsController)
        .directive('aiCmsManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'chpl.admin/components/cms/cms.html',
                scope: {},
                bindToController: {
                    //admin: '='
                },
                controllerAs: 'vm',
                controller: 'CmsController',
            };
        });

    /** @ngInject */
    function CmsController ($location, $log, $state, API, FileUploader, authService, networkService) {
        var vm = this;

        vm.getDownload = getDownload;
        vm.hasAnyRole = authService.hasAnyRole;
        vm.setAccurateDate = setAccurateDate;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.muuAccurateAsOfDateObject = new Date();

            vm.uploader = new FileUploader({
                url: API + '/meaningful_use/upload',
                removeAfterUpload: true,
                headers: {
                    Authorization: 'Bearer ' + authService.getToken(),
                    'API-Key': authService.getApiKey(),
                },
            });

            if (angular.isUndefined(vm.uploader.filters)) {
                vm.uploader.filters = [];
            }
            vm.uploader.filters.push({
                name: 'csvFilter',
                fn: function (item) {
                    var extension = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
                    return '|csv|'.indexOf(extension) !== -1;
                },
            });
            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                $log.info('onSuccessItem', fileItem, response, status, headers);
                if ($location.url() !== '/admin/jobsManagement') {
                    $location.url('/admin/jobsManagement');
                } else {
                    $state.go($state.$current, null, { reload: true });
                }
            };
            vm.uploader.onCompleteItem = function (fileItem, response, status, headers) {
                $log.info('onCompleteItem', fileItem, response, status, headers);
            };
            vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
                $log.info('onErrorItem', fileItem, response, status, headers);
                vm.uploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
                vm.uploadErrors = response.errorMessages;
                vm.uploadSuccess = false;
            };
            vm.uploader.onCancelItem = function (fileItem, response, status, headers) {
                $log.info('onCancelItem', fileItem, response, status, headers);
            };
            vm.filename = 'CMS_IDs_' + new Date().getTime() + '.csv';
            if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
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
            networkService.getCmsDownload()
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

        function setAccurateDate (item) {
            vm.uploader.url += '?accurate_as_of=' + vm.muuAccurateAsOfDateObject.getTime();
            item.url += '?accurate_as_of=' + vm.muuAccurateAsOfDateObject.getTime();
            item.upload();
        }
    }
})();
