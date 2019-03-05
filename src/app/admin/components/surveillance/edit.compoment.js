export const SurveillanceEditComponent = {
    templateUrl: 'chpl.admin/components/surveillance/edit.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&',
    },
    controller: class SurveillanceEditController {
        constructor ($log, $uibModal, authService, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.$uibModal = $uibModal
            this.authService = authService;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.utilService = utilService;
            this.sortRequirements = utilService.sortRequirements;
        }

        $onInit () {
            this.surveillance = angular.copy(this.resolve.surveillance);
            this.workType = this.resolve.workType;
            this.data = angular.copy(this.resolve.surveillanceTypes);

            this.showFormErrors = false;
            this.authorities = [];
            if (this.hasAnyRole(['ROLE_ACB'])) {
                this.authorities.push('ROLE_ACB');
            }
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                this.authorities.push('ROLE_ONC');
            }
            if (this.surveillance.startDate) {
                this.surveillance.startDateObject = new Date(this.surveillance.startDate);
            }
            if (this.surveillance.endDate) {
                this.surveillance.endDateObject = new Date(this.surveillance.endDate);
            }
            this.disableValidation = this.surveillance.errorMessages && this.surveillance.errorMessages.length > 0;
            if (this.surveillance.type) {
                this.surveillance.type = this.utilService.findModel(this.surveillance.type, this.data.surveillanceTypes.data, 'name');
            }
        }

        addRequirement () {
            this.modalInstance = this.$uibModal.open({
                component: 'aiSurveillanceRequirementEdit',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    disableValidation: () => false,
                    randomized: () => this.surveillance.type.name === 'Randomized',
                    randomizedSitesUsed: () => this.surveillance.randomizedSitesUsed,
                    requirement: () => { return {nonconformities: []} },
                    surveillanceId: () => this.surveillance.id,
                    surveillanceTypes: () => this.data,
                    workType: () => 'add',
                },
                size: 'lg',
            });
            this.modalInstance.result.then(response => {
                if (!this.surveillance.requirements) {
                    this.surveillance.requirements = [];
                }
                this.surveillance.requirements.push(response);
            }, result => {
                this.$log.info(result);
            });
        }

        cancel () {
            this.dismiss();
        }

        deleteRequirement (req) {
            for (var i = 0; i < this.surveillance.requirements.length; i++) {
                if (angular.equals(this.surveillance.requirements[i],req)) {
                    this.surveillance.requirements.splice(i,1);
                }
            }
        }

        deleteSurveillance () {
            if (this.reason) {
                this.networkService.deleteSurveillance(this.surveillance.id, this.reason)
                    .then(response => {
                        if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                            this.close({$value: response});
                        } else {
                            this.errorMessages = [response];
                        }
                    },error => {
                        this.errorMessages = [error.statusText];
                    });
            }
        }

        editRequirement (req) {
            req.guiId = req.id ? req.id : (new Date()).getTime();
            this.modalInstance = this.$uibModal.open({
                component: 'aiSurveillanceRequirementEdit',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    disableValidation: () => this.disableValidation,
                    randomized: () => this.surveillance.type.name === 'Randomized',
                    randomizedSitesUsed: () => this.surveillance.randomizedSitesUsed,
                    requirement: () => req,
                    surveillanceId: () => this.surveillance.id,
                    surveillanceTypes: () => this.data,
                    workType: () => this.workType,
                },
                size: 'lg',
            });
            this.modalInstance.result.then(response => {
                var found = false;
                for (var i = 0; i < this.surveillance.requirements.length; i++) {
                    if (this.surveillance.requirements[i].guiId === response.guiId) {
                        this.surveillance.requirements[i] = response;
                        found = true;
                    }
                }
                if (!found) {
                    this.surveillance.requirements.push(response);
                }
            }, result => {
                this.$log.info(result);
            });
        }

        inspectNonconformities (noncons) {
            this.modalInstance = this.$uibModal.open({
                component: 'aiSurveillanceNonconformityInspect',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    nonconformities: () => noncons,
                },
                size: 'lg',
            });
        }

        missingEndDate () {
            var noNcs = true;
            var allClosed = true;
            if (this.surveillance.requirements) {
                for (var i = 0; i < this.surveillance.requirements.length; i++) {
                    noNcs = noNcs && (!this.surveillance.requirements[i].nonconformities || this.surveillance.requirements[i].nonconformities.length === 0);
                    for (var j = 0; j < this.surveillance.requirements[i].nonconformities.length; j++) {
                        allClosed = allClosed && (this.surveillance.requirements[i].nonconformities[j].status.name === 'Closed');
                    }
                }
            }
            return this.surveillance.requirements && (noNcs || allClosed) && !this.surveillance.endDateObject;
        }

        save () {
            this.surveillance.startDate = this.surveillance.startDateObject.getTime();
            if (this.surveillance.endDateObject) {
                this.surveillance.endDate = this.surveillance.endDateObject.getTime();
            } else {
                this.surveillance.endDate = null;
            }
            if (this.workType === 'confirm') {
                this.close({$value: this.surveillance});
            } else if (this.workType === 'initiate') {
                if (!this.surveillance.authority){
                    if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])){
                        this.surveillance.authority = 'ROLE_ONC';
                    }
                    else if (this.hasAnyRole(['ROLE_ACB'])){
                        this.surveillance.authority = 'ROLE_ACB';
                    }
                }
                this.surveillance.certifiedProduct.edition = this.surveillance.certifiedProduct.certificationEdition.name;
                this.networkService.initiateSurveillance(this.surveillance)
                    .then(response => {
                        if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                            this.close({$value: response});
                        } else {
                            this.errorMessages = [response];
                        }
                    }, error => {
                        if (error.data.errorMessages && error.data.errorMessages.length > 0) {
                            this.errorMessages = error.data.errorMessages;
                        } else if (error.data.error) {
                            this.errorMessages = [error.data.error];
                        } else {
                            this.errorMessages = [error.statusText];
                        }
                    });
            } else if (this.workType === 'edit') {
                this.networkService.updateSurveillance(this.surveillance)
                    .then(response => {
                        if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                            this.close({$value: response});
                        } else {
                            this.errorMessages = [response];
                        }
                    }, error => {
                        if (error.data.errorMessages && error.data.errorMessages.length > 0) {
                            this.errorMessages = error.data.errorMessages;
                        } else {
                            this.errorMessages = [error.statusText];
                        }
                    });
            }
        }
    },
}

angular
    .module('chpl.admin')
    .component('aiSurveillanceEdit', SurveillanceEditComponent);
