export const SurveillanceComponent = {
    templateUrl: 'chpl.components/listing/details/surveillance/view.html',
    bindings: {
        allowEditing: '<',
        certifiedProduct: '<',
    },
    controller: class SurveillanceController {
        constructor ($filter, $log, $uibModal, API, authService, networkService, utilService) {
            'ngInject';
            this.$filter = $filter;
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.API = API;
            this.authService = authService;
            this.networkService = networkService;
            this.utilService = utilService;
        }

        $onInit () {
            this.API_KEY = this.authService.getApiKey();
            this.sortRequirements = this.utilService.sortRequirements;
            this.surveillanceTypes = this.networkService.getSurveillanceLookups();
            this.sortResults = (result) => {
                var req = result.substring(result.indexOf(' for ') + 5);
                return this.sortRequirements(req);
            };
        }

        $onChanges (changes) {
            if (changes.certifiedProduct) {
                this.certifiedProduct = angular.copy(changes.certifiedProduct.currentValue);
            }
            if (changes.allowEditing) {
                this.allowEditing = angular.copy(changes.allowEditing.currentValue);
            }
        }

        editSurveillance (surveillance) {
            this._fixRequirementOptions();
            this.uibModalInstance = this.$uibModal.open({
                component: 'aiSurveillanceEdit',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    surveillance: () => { return surveillance; },
                    surveillanceTypes: () => { return this.surveillanceTypes; },
                    workType: () => { return 'edit'; },
                },
            });
            this.uibModalInstance.result.then(() => {
                this.networkService.getListing(this.certifiedProduct.id, true)
                    .then((result) => {
                        this.certifiedProduct = result;
                    });
            }, (result) => {
                if (result !== 'cancelled') {
                    this.$log.info(result);
                }
            });
        }

        getTitle (surv) {
            var title = surv.endDate
                ? 'Closed Surveillance, Ended ' + this.$filter('date')(surv.endDate, 'mediumDate', 'UTC') + ': '
                : 'Open Surveillance, Began ' + this.$filter('date')(surv.startDate, 'mediumDate', 'UTC') + ': ';
            var open = 0;
            var closed = 0;
            for (var i = 0; i < surv.requirements.length; i++) {
                for (var j = 0; j < surv.requirements[i].nonconformities.length; j++) {
                    if (surv.requirements[i].nonconformities[j].status.name === 'Open') {
                        open += 1;
                    }
                    if (surv.requirements[i].nonconformities[j].status.name === 'Closed') {
                        closed += 1;
                    }
                }
            }
            if (open && closed) {
                title += open + ' Open and ' + closed + ' Closed Non-Conformities Were Found';
            } else if (open) {
                if (open === 1) {
                    title += '1 Open Non-Conformity Was Found';
                } else {
                    title += open + ' Open Non-Conformities Were Found';
                }
            } else if (closed) {
                if (closed === 1) {
                    title += '1 Closed Non-Conformity Was Found';
                } else {
                    title += closed + ' Closed Non-Conformities Were Found';
                }
            } else {
                title += 'No Non-Conformities Were Found';
            }
            return title;
        }

        initiateSurveillance () {
            this._fixRequirementOptions();
            this.uibModalInstance = this.$uibModal.open({
                component: 'aiSurveillanceEdit',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    surveillance: () => { return { certifiedProduct: this.certifiedProduct }; },
                    surveillanceTypes: () => { return this.surveillanceTypes; },
                    workType: () => { return 'initiate'; },
                },
            });
            this.uibModalInstance.result.then(() => {
                this.networkService.getListing(this.certifiedProduct.id, true)
                    .then((result) => {
                        this.certifiedProduct = result;
                    });
            }, (result) => {
                if (result !== 'cancelled') {
                    this.$log.info(result);
                }
            });
        }

        surveillanceResults (surv) {
            var results = [];
            for (var i = 0; i < surv.requirements.length; i++) {
                for (var j = 0; j < surv.requirements[i].nonconformities.length; j++) {
                    results.push(surv.requirements[i].nonconformities[j].status.name + ' Non-Conformity Found for ' + surv.requirements[i].requirement);
                }
            }
            if (results.length === 0) {
                results.push('No Non-Conformities Found');
            }
            return results;
        }

        ////////////////////////////////////////////////////////////////////

        _fixRequirementOptions () {
            if (this.certifiedProduct.certificationEdition.name === '2015') {
                this.surveillanceTypes.surveillanceRequirements.criteriaOptions = this.surveillanceTypes.surveillanceRequirements.criteriaOptions2015;
            } else if (this.certifiedProduct.certificationEdition.name === '2014') {
                this.surveillanceTypes.surveillanceRequirements.criteriaOptions = this.surveillanceTypes.surveillanceRequirements.criteriaOptions2014;
            }
        }
    },
}

angular
    .module('chpl.components')
    .component('aiSurveillance', SurveillanceComponent);
