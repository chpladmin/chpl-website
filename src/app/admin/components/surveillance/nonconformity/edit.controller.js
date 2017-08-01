(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditNonconformityController', EditNonconformityController);

    /** @ngInject */
    function EditNonconformityController ($log, $uibModalInstance, API, FileUploader, authService, commonService, disableValidation, nonconformity, randomized, requirementId, surveillanceId, surveillanceTypes, utilService, workType) {
        var vm = this;

        vm.cancel = cancel;
        vm.deleteDoc = deleteDoc;
        vm.save = save;
        vm.sortNonconformityTypes = utilService.sortNonconformityTypes;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.data = surveillanceTypes;
            vm.disableValidation = disableValidation;
            vm.nonconformity = angular.copy(nonconformity);
            vm.randomized = randomized;
            vm.requirementId = requirementId;
            vm.showFormErrors = false;
            vm.surveillanceId = surveillanceId;
            vm.workType = workType;
            if (vm.nonconformity.nonconformityType) {
                vm.nonconformity.nonconformityType = utilService.findModel(vm.nonconformity.nonconformityType, vm.data.nonconformityTypes.data);
            }
            if (vm.nonconformity.status) {
                vm.nonconformity.status = utilService.findModel(vm.nonconformity.status, vm.data.nonconformityStatusTypes.data);
            }
            if (vm.nonconformity.dateOfDetermination) {
                vm.nonconformity.dateOfDeterminationObject = new Date(vm.nonconformity.dateOfDetermination);
            }
            if (vm.nonconformity.capApprovalDate) {
                vm.nonconformity.capApprovalDateObject = new Date(vm.nonconformity.capApprovalDate);
            }
            if (vm.nonconformity.capStartDate) {
                vm.nonconformity.capStartDateObject = new Date(vm.nonconformity.capStartDate);
            }
            if (vm.nonconformity.capEndDate) {
                vm.nonconformity.capEndDateObject = new Date(vm.nonconformity.capEndDate);
            }
            if (vm.nonconformity.capMustCompleteDate) {
                vm.nonconformity.capMustCompleteDateObject = new Date(vm.nonconformity.capMustCompleteDate);
            }
            if (vm.workType === 'edit') {
                buildFileUploader();
            }
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function deleteDoc (docId) {
            commonService.deleteSurveillanceDocument(vm.surveillanceId, vm.nonconformity.id, docId)
                .then(function () {
                    for (var i = 0; i < vm.nonconformity.documents.length; i++) {
                        if (vm.nonconformity.documents[i].id === docId) {
                            vm.nonconformity.documents.splice(i,1);
                        }
                    }
                });
        }

        function save () {
            if (vm.nonconformity.dateOfDeterminationObject) {
                vm.nonconformity.dateOfDetermination = vm.nonconformity.dateOfDeterminationObject.getTime();
            } else {
                vm.nonconformity.dateOfDetermination = null;
            }
            if (vm.nonconformity.capApprovalDateObject) {
                vm.nonconformity.capApprovalDate = vm.nonconformity.capApprovalDateObject.getTime();
            } else {
                vm.nonconformity.capApprovalDate = null;
            }
            if (vm.nonconformity.capStartDateObject) {
                vm.nonconformity.capStartDate = vm.nonconformity.capStartDateObject.getTime();
            } else {
                vm.nonconformity.capStartDate = null;
            }
            if (vm.nonconformity.capEndDateObject) {
                vm.nonconformity.capEndDate = vm.nonconformity.capEndDateObject.getTime();
            } else {
                vm.nonconformity.capEndDate = null;
            }
            if (vm.nonconformity.capMustCompleteDateObject) {
                vm.nonconformity.capMustCompleteDate = vm.nonconformity.capMustCompleteDateObject.getTime();
            } else {
                vm.nonconformity.capMustCompleteDate = null;
            }
            $uibModalInstance.close(vm.nonconformity);
        }

        ////////////////////////////////////////////////////////////////////

        function buildFileUploader () {
            vm.uploader = new FileUploader({
                url: API + '/surveillance/' + vm.surveillanceId + '/nonconformity/' + vm.nonconformity.id + '/document/create',
                removeAfterUpload: true,
                headers: {
                    Authorization: 'Bearer ' + authService.getToken(),
                    'API-Key': authService.getApiKey(),
                },
            });
            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                $log.info('onSuccessItem', fileItem, response, status, headers);
                vm.nonconformity.documents.push({fileName: fileItem.file.name + ' is pending'});
            };
            vm.uploader.onCompleteItem = function (fileItem, response, status, headers) {
                $log.info('onCompleteItem', fileItem, response, status, headers);
            };
            vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
                $log.info('onErrorItem', fileItem, response, status, headers);
            };
            vm.uploader.onCancelItem = function (fileItem, response, status, headers) {
                $log.info('onCancelItem', fileItem, response, status, headers);
            };
        }
    }
})();
