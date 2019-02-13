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
                filters: [{
                    name: 'csvFilter',
                    fn: function (item) {
                        var extension = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
                        return '|csv|'.indexOf(extension) !== -1;
                    },
                }],
                onSuccessItem: function () {
                    $location.url('/admin/jobsManagement');
                },
                onErrorItem: function (fileItem, response) {
                    vm.uploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
                    vm.uploadErrors = response.errorMessages;
                    vm.uploadSuccess = false;
                },
            });
            vm.filename = 'CMS_IDs_' + new Date().getTime() + '.csv';
            vm.csvHeader = ['CMS ID', 'Creation Date'];
            vm.csvColumnOrder = ['certificationId', 'created'];
            if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                vm.csvHeader.push('CHPL Product(s)');
                vm.csvColumnOrder.push('products');
            }
            vm.isReady = false;
            vm.isProcessing = false;
        }

        function getDownload () {
            vm.isProcessing = true;
            networkService.getCmsDownload()
                .then(result => {
                    vm.cmsArray = result.map(res => {
                        res.created = new Date(res.created).toISOString().substring(0, 10);
                        return res;
                    });
                    vm.cmsArray = result
                    vm.isProcessing = false;
                    vm.isReady = true;
                });
        }

        function setAccurateDate (item) {
            vm.uploader.url += '?accurate_as_of=' + vm.muuAccurateAsOfDateObject.getTime();
            item.url += '?accurate_as_of=' + vm.muuAccurateAsOfDateObject.getTime();
            item.upload();
        }
    }
})();
