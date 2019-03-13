export const DeveloperComponent = {
    templateUrl: 'chpl.components/developer/developer.html',
    bindings: {
        allowedAcbs: '<',
        developer: '<',
        canEdit: '<',
        canMerge: '<',
        canSplit: '<',
        isEditing: '<',
        isInvalid: '<',
        isSplitting: '<',
        onCancel: '&?',
        onEdit: '&?',
        onSplit: '&?',
        products: '<',
        showFull: '<',
        showProducts: '<',
        takeAction: '&',
    },
    controller: class DeveloperComponent {
        constructor ($filter, $log, authService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.valid = {
                address: true,
                contact: true,
            }
        }

        $onChanges (changes) {
            if (changes.allowedAcbs) {
                this.allowedAcbs = angular.copy(changes.allowedAcbs.currentValue);
            }
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
                this.developer.statusEvents = this.developer.statusEvents.map(e => {
                    e.statusDateObject = new Date(e.statusDate);
                    return e;
                });
                this.transMap = {};
                this.developer.transparencyAttestations.forEach(att => {
                    this.transMap[att.acbName] = att.attestation;
                });
            }
            if (changes.canEdit) {
                this.canEdit = angular.copy(changes.canEdit.currentValue);
            }
            if (changes.canMerge) {
                this.canMerge = angular.copy(changes.canMerge.currentValue);
            }
            if (changes.canSplit) {
                this.canSplit = angular.copy(changes.canSplit.currentValue);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
            }
            if (changes.isInvalid) {
                this.isInvalid = angular.copy(changes.isInvalid.currentValue);
            }
            if (changes.isSplitting) {
                this.isSplitting = angular.copy(changes.isSplitting.currentValue);
            }
            if (changes.products) {
                this.products = angular.copy(changes.products.currentValue);
            }
            if (changes.productContact) {
                this.productContact = angular.copy(changes.productContact.currentValue);
            }
            if (changes.showFull) {
                this.showFull = angular.copy(changes.showFull.currentValue);
            }
            if (changes.showProducts) {
                this.showProducts = angular.copy(changes.showProducts.currentValue);
            }
        }

        /*
         * Initiate changes
         */
        edit () {
            this.takeAction({
                developerId: this.developer.developerId,
                action: 'edit',
            });
        }

        merge () {
            this.takeAction({
                developerId: this.developer.developerId,
                action: 'merge',
            });
        }

        split () {
            this.takeAction({
                developerId: this.developer.developerId,
                action: 'split',
            });
        }

        /*
         * Resolve changes
         */
        save () {
            if (this.isEditing) {
                this.developer.statusEvents = this.developer.statusEvents.map(e => {
                    e.statusDate = e.statusDateObject.getTime();
                    return e;
                });
                this.developer.transparencyAttestations = Object.keys(this.transMap).map(key => { return {acbName: key, attestation: this.transMap[key]}; });
                this.onEdit({developer: this.developer});
            }
            if (this.isSplitting) {
                this.onSplit({
                    oldDeveloper: this.developer,
                    newDeveloper: this.newDeveloper,
                });
            }
        }

        cancel () {
            this.onCancel();
        }

        /*
         * Handle callbacks
         */
        editAddress (address, errors, validForm) {
            this.developer.address = angular.copy(address);
            this.valid.address = validForm;
        }

        editContact (contact, errors, validForm) {
            this.developer.contact = angular.copy(contact);
            this.valid.contact = validForm;
        }

        /*
         * Form validation
         */
        isValid () {
            return this.form.$valid // basic form validation
                && !this.isInvalid // validation from outside
                && this.valid.address && this.valid.contact // validation from sub-components
                && this.developer.statusEvents && this.developer.statusEvents.length > 0 // status history exists
                && this.developer.statusEvents.reduce((acc, e) => acc && !this.matchesPreviousStatus(e) && !this.matchesPreviousDate(e), true); // no duplicate status history data
        }

        matchesPreviousStatus (status) {
            let orderedStatus = this.developer.statusEvents.sort((a, b) => a.statusDateObject < b.statusDateObject ? -1 : a.statusDateObject > b.statusDateObject ? 1 : 0); // earliest first
            let idx = orderedStatus.indexOf(status);
            return idx > 0 && status.status.status === orderedStatus[idx - 1].status.status;
        }

        matchesPreviousDate (status) {
            let orderedStatus = this.developer.statusEvents.sort((a, b) => a.statusDateObject < b.statusDateObject ? -1 : a.statusDateObject > b.statusDateObject ? 1 : 0); // earliest first
            let idx = orderedStatus.indexOf(status);
            return idx > 0 && this.$filter('date')(status.statusDateObject, 'mediumDate', 'UTC') === this.$filter('date')(orderedStatus[idx - 1].statusDateObject, 'mediumDate', 'UTC');
        }

        isBeingActivatedFromOncInactiveStatus () {
            let orderedStatus = this.developer.statusEvents.sort((a, b) => a.statusDateObject < b.statusDateObject ? 1 : a.statusDateObject > b.statusDateObject ? -1 : 0); // latest first
            return this.developer.status.status !== 'Active' && orderedStatus[0].status.status === 'Active';
        }

        /*
         * Form actions
         */
        addStatus () {
            this.developer.statusEvents.push({statusDateObject: new Date()});
        }

        removeStatus (idx) {
            this.developer.statusEvents.splice(idx, 1);
        }
    },
}

angular.module('chpl.components')
    .component('chplDeveloper', DeveloperComponent);
