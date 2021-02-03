export const SvapsComponent = {
    templateUrl: 'chpl.administration/svaps/svaps.html',
    bindings: {
        svaps: '<',
        availableCriteria: '<',
    },
    controller: class SvapsComponent {
        constructor ($log, networkService, utilService) {
            'ngInject';
            this.$log = $log;
            this.networkService = networkService;
            this.sortCerts = utilService.sortCert;
            this.isCures = utilService.isCures;

            this.svap = null;
            this.isEditting = false;
            this.options = {maxMessageCharacters: 100};
        }

        $onChanges (changes) {
            if (changes.svaps) {
                this.svaps = angular.copy(changes.svaps.currentValue);
            }
            if (changes.availableCriteria) {
                this.availableCriteria = angular.copy(changes.availableCriteria.currentValue);
                this.availableCriteria = this.availableCriteria.filter(crit => crit.certificationEditionId === 3);
            }
        }

        addSvap () {
            this.svap = {};
            this.errors = [];
            this.isEditting = true;
        }

        delete () {
            let that = this;
            this.networkService.deleteSvap(this.svap)
                .then(() => {
                    that.cancel();
                }, error => {
                    that.errors = error.data.errorMessages;
                });
        }

        editSvap (svap) {
            this.svap = svap;
            this.errors = [];
            this.isEditting = true;
        }

        cancel () {
            let that = this;
            this.svap = null;
            this.isEditting = false;
            this.networkService.getSvaps()
                .then(response => that.svaps = response);
        }

        save () {
            let that = this;
            if (this.svap.svapId) {
                this.networkService.updateSvap(this.svap)
                    .then(() => {
                        that.cancel();
                    }, error => {
                        that.errors = error.data.errorMessages;
                    });
            } else {
                this.networkService.createSvap(this.svap)
                    .then(() => {
                        that.cancel();
                    }, error => {
                        that.errors = error.data.errorMessages;
                    });
            }
        }

        getCriteriaForSelectableList () {
            if (Array.isArray(this.svap.criteria)) {
                return this.availableCriteria.filter(crit => !this.svap.criteria.map(c => c.id).includes(crit.id));
            } else {
                return this.availableCriteria;
            }
        }

        removeCriteriaFromSvap (criterion) {
            this.svap.criteria = this.svap.criteria.filter(crit => crit.id !== criterion.id);
        }

        selectCriteriaForSvap () {
            if (!Array.isArray(this.svap.criteria)) {
                this.svap.criteria = [];
            }
            this.svap.criteria.push(angular.copy(this.selectedCriteria));
            this.selectedCriteria = null;
        }

        takeActionBarAction (action) {
            switch (action) {
            case 'cancel':
                this.cancel();
                break;
            case 'delete':
                this.delete();
                break;
            case 'mouseover':
                this.showFormErrors = true;
                break;
            case 'save':
                this.save();
                break;
                //no default
            }
        }

        canActionBar (action) {
            if (action === 'delete') {
                //If the current svap has an id, we can delete since it is an existing svap
                return this.svap.svapId;
            } else {
                return true;
            }
        }
    },
};

angular.module('chpl.administration')
    .component('chplSvapsPage', SvapsComponent);
