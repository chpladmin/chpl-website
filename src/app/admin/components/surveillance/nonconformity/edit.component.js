export const SurveillanceNonconformityEditComponent = {
    templateUrl: 'chpl.admin/components/surveillance/nonconformity/edit.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&',
    },
    controller: class SurveillanceNonconformityEditController {
        constructor ($log, API, FileUploader, authService, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.API = API;
            this.FileUploader = FileUploader;
            this.authService = authService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.sortNonconformityTypes = utilService.sortNonconformityTypes;
        }

        $onInit () {
            this.data = angular.copy(this.resolve.surveillanceTypes);
            this.disableValidation = this.resolve.disableValidation;
            this.nonconformity = angular.copy(this.resolve.nonconformity);
            this.randomized = this.resolve.randomized;
            this.randomizedSitesUsed = this.resolve.randomizedSitesUsed;
            this.requirementId = this.resolve.requirementId;
            this.showFormErrors = false;
            this.surveillanceId = this.resolve.surveillanceId;
            this.workType = this.resolve.workType;

            if (this.nonconformity.status) {
                this.nonconformity.status = this.utilService.findModel(this.nonconformity.status, this.data.nonconformityStatusTypes.data, 'name');
            }
            if (this.nonconformity.dateOfDetermination) {
                this.nonconformity.dateOfDeterminationObject = new Date(this.nonconformity.dateOfDetermination);
            }
            if (this.nonconformity.capApprovalDate) {
                this.nonconformity.capApprovalDateObject = new Date(this.nonconformity.capApprovalDate);
            }
            if (this.nonconformity.capStartDate) {
                this.nonconformity.capStartDateObject = new Date(this.nonconformity.capStartDate);
            }
            if (this.nonconformity.capEndDate) {
                this.nonconformity.capEndDateObject = new Date(this.nonconformity.capEndDate);
            }
            if (this.nonconformity.capMustCompleteDate) {
                this.nonconformity.capMustCompleteDateObject = new Date(this.nonconformity.capMustCompleteDate);
            }
            if (this.workType === 'edit') {
                this.buildFileUploader();
            }
        }

        cancel () {
            this.dismiss();
        }

        deleteDoc (docId) {
            this.networkService.deleteSurveillanceDocument(this.surveillanceId, docId)
                .then(() => {
                    for (var i = 0; i < this.nonconformity.documents.length; i++) {
                        if (this.nonconformity.documents[i].id === docId) {
                            this.nonconformity.documents.splice(i,1);
                        }
                    }
                });
        }

        save () {
            if (this.nonconformity.dateOfDeterminationObject) {
                this.nonconformity.dateOfDetermination = this.nonconformity.dateOfDeterminationObject.getTime();
            } else {
                this.nonconformity.dateOfDetermination = null;
            }
            if (this.nonconformity.capApprovalDateObject) {
                this.nonconformity.capApprovalDate = this.nonconformity.capApprovalDateObject.getTime();
            } else {
                this.nonconformity.capApprovalDate = null;
            }
            if (this.nonconformity.capStartDateObject) {
                this.nonconformity.capStartDate = this.nonconformity.capStartDateObject.getTime();
            } else {
                this.nonconformity.capStartDate = null;
            }
            if (this.nonconformity.capEndDateObject) {
                this.nonconformity.capEndDate = this.nonconformity.capEndDateObject.getTime();
            } else {
                this.nonconformity.capEndDate = null;
            }
            if (this.nonconformity.capMustCompleteDateObject) {
                this.nonconformity.capMustCompleteDate = this.nonconformity.capMustCompleteDateObject.getTime();
            } else {
                this.nonconformity.capMustCompleteDate = null;
            }
            this.close(this.nonconformity);
        }

        ////////////////////////////////////////////////////////////////////

        buildFileUploader () {
            this.uploader = new this.FileUploader({
                url: this.API + '/surveillance/' + this.surveillanceId + '/nonconformity/' + this.nonconformity.id + '/document',
                removeAfterUpload: true,
                headers: {
                    Authorization: 'Bearer ' + this.authService.getToken(),
                    'API-Key': this.authService.getApiKey(),
                },
            });
            this.uploader.onSuccessItem = (fileItem, response, status, headers) => {
                this.$log.info('onSuccessItem', fileItem, response, status, headers);
                this.nonconformity.documents.push({fileName: fileItem.file.name + ' is pending'});
            };
            this.uploader.onCompleteItem = (fileItem, response, status, headers) => {
                this.$log.info('onCompleteItem', fileItem, response, status, headers);
            };
            this.uploader.onErrorItem = (fileItem, response, status, headers) => {
                this.$log.info('onErrorItem', fileItem, response, status, headers);
            };
            this.uploader.onCancelItem = (fileItem, response, status, headers) => {
                this.$log.info('onCancelItem', fileItem, response, status, headers);
            };
        }
    },
}

angular
    .module('chpl.admin')
    .component('aiSurveillanceNonconformityEdit', SurveillanceNonconformityEditComponent);
