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
                self.isChplAdmin = authService.isChplAdmin();
                
                if (self.isChplAdmin || self.isOncStaff) {
                	self.refreshPending();
                	self.uploader = new FileUploader({
                        url: API + '/meaningful_use_users/upload',
                        removeAfterUpload: true,
                        headers: {
                            Authorization: 'Bearer ' + authService.getToken(),
                            'API-Key': authService.getApiKey()
                        }
                	});
                	
                	if (angular.isUndefined(self.uploader.filters)) {
                        self.uploader.filters = [];
                    }
                    self.uploader.filters.push({
                        name: 'csvFilter',
                        fn: function(item, options) {
                            var extension = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
                            return '|csv|'.indexOf(extension) !== -1;
                        }
                    });
                    self.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                        //$log.info('onSuccessItem', fileItem, response, status, headers);
                        self.uploadMessage = 'File "' + fileItem.file.name + '" was uploaded successfully. ' + response.pendingCertifiedProducts.length + ' pending products are ready for confirmation.';
                        self.uploadErrors = [];
                        self.uploadSuccess = true;
                    };
                    self.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                        self.refreshPending();
                    };
                    self.uploader.onErrorItem = function(fileItem, response, status, headers) {
                        self.uploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
                        self.uploadErrors = response.errorMessages;
                        self.uploadSuccess = false;
                    };
                    self.uploader.onCancelItem = function(fileItem, response, status, headers) {
                        //$log.info('onCancelItem', fileItem, response, status, headers);
                    };
                }

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
            
            function refreshPending () {
                commonService.getUploadingMeaningfulUseUsers()
                    .then(function (muus) {
                        self.uploadingMuus = [].concat(muus.pendingCertifiedProducts);
                        self.pendingMuus = self.uploadingMuus.length;
                    })
            }
            
            function parseUploadError (muu) {
                var ret = '';
                if (muu.recordStatus.toLowerCase() !== 'new') {
                    ret = 'Existing Certified Product found';
                } else {
                    if (muu.errorMessages.length > 0) {
                        ret += 'Errors:&nbsp;' + muu.errorMessages.length;
                    }
                    if (muu.warningMessages.length > 0) {
                        if (ret.length > 0)
                            ret += '<br />';
                        ret += 'Warnings:&nbsp;' + muu.warningMessages.length;
                    }
                    if (ret.length === 0) {
                        ret = 'OK';

                    }
                }
                return ret;
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
