export const SurveillanceRequirementEditComponent = {
    templateUrl: 'chpl.admin/components/surveillance/requirement/edit.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&',
    },
    controller: class SurveillanceRequirementEditController {
        constructor ($log, $uibModal, utilService) {
            'ngInject'
            this.$log = $log;
            this.$uibModal = $uibModal
            this.utilService = utilService;
            this.sortCriteria = utilService.sortCert;
        }

        $onInit () {
            this.data = angular.copy(this.resolve.surveillanceTypes);
            this.disableValidation = this.resolve.disableValidation;
            this.randomized = this.resolve.randomized;
            this.randomizedSitesUsed = this.resolve.randomizedSitesUsed;
            this.requirement = angular.copy(this.resolve.requirement);
            this.showFormErrors = false;
            this.surveillanceId = this.resolve.surveillanceId;
            this.workType = this.resolve.workType;
            if (this.requirement.type) {
                this.requirement.type = this.utilService.findModel(this.requirement.type, this.data.surveillanceRequirementTypes.data, 'name');
            }
            if (this.requirement.result) {
                this.requirement.result = this.utilService.findModel(this.requirement.result, this.data.surveillanceResultTypes.data, 'name');
            }
        }

        addNonconformity () {
            this.modalInstance = this.$uibModal.open({
                component: 'aiSurveillanceNonconformityEdit',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    disableValidation: () => false,
                    nonconformity: () => { return {}},
                    randomized: () => this.randomized,
                    randomizedSitesUsed: () => this.randomizedSitesUsed,
                    requirementId: () => this.requirement.id,
                    surveillanceId: () => this.surveillanceId,
                    surveillanceTypes: () => this.data,
                    workType: () => 'add',
                },
                size: 'lg',
            });
            this.modalInstance.result.then(response => {
                if (!this.requirement.nonconformities) {
                    this.requirement.nonconformities = [];
                }
                this.requirement.nonconformities.push(response);
            }, result => {
                this.$log.info(result);
            });
        }

        cancel () {
            this.dismiss();
        }

        deleteNonconformity (noncon) {
            for (var i = 0; i < this.requirement.nonconformities.length; i++) {
                if (angular.equals(this.requirement.nonconformities[i], noncon)) {
                    this.requirement.nonconformities.splice(i,1);
                }
            }
        }

        editNonconformity (noncon) {
            noncon.guiId = noncon.id ? noncon.id : (new Date()).getTime();
            this.modalInstance = this.$uibModal.open({
                component: 'aiSurveillanceNonconformityEdit',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    disableValidation: () => this.disableValidation,
                    nonconformity: () => noncon,
                    randomized: () => this.randomized,
                    randomizedSitesUsed: () => this.randomizedSitesUsed,
                    requirementId: () => this.requirement.id,
                    surveillanceId: () => this.surveillanceId,
                    surveillanceTypes: () => this.data,
                    workType: () => this.workType,
                },
                size: 'lg',
            });
            this.modalInstance.result.then(response => {
                var found = false;
                for (var i = 0; i < this.requirement.nonconformities.length; i++) {
                    if (this.requirement.nonconformities[i].guiId === response.guiId) {
                        this.requirement.nonconformities[i] = response;
                        found = true;
                    }
                }
                if (!found) {
                    this.requirement.nonconformities.push(response);
                }
            }, result => {
                this.$log.info(result);
            });
        }

        isNonconformityRequired () {
            return this.requirement.result.name === 'Non-Conformity' &&
                (!this.requirement.nonconformities || this.requirement.nonconformities.length === 0);
        }

        save () {
            if (this.requirement.result.name === 'No Non-Conformity') {
                this.requirement.nonconformities = [];
            }
            this.close({$value: this.requirement});
        }
    },
}

angular
    .module('chpl.admin')
    .component('aiSurveillanceRequirementEdit', SurveillanceRequirementEditComponent);
