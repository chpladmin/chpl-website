export const DeveloperComponent = {
    templateUrl: 'chpl.components/developer/developer.html',
    bindings: {
        developer: '<',
        canEdit: '<',
        canMerge: '<',
        canSplit: '<',
        onEdit: '&?',
        onSplit: '&?',
        products: '<',
        productContact: '<?',
        showProducts: '<',
    },
    controller: class DeveloperComponent {
        constructor ($filter, $log, $state, authService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.isEditing = false;
            this.isSplitting = false;
            this.valid = {
                address: true,
                contact: true,
            }
        }

        $onChanges (changes) {
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
                this.developer.statusEvents = this.developer.statusEvents.map(e => {
                    e.statusDateObject = new Date(e.statusDate);
                    return e;
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
            if (changes.products) {
                this.products = angular.copy(changes.products.currentValue);
            }
            if (changes.productContact) {
                this.productContact = angular.copy(changes.productContact.currentValue);
            }
            if (changes.showProducts) {
                this.showProducts = angular.copy(changes.showProducts.currentValue);
            }
            this.canSplit = this.canSplit && this.products && this.products.length > 1;
        }

        /*
         * Initiate changes
         */
        edit () {
            this.backup = angular.copy(this.developer);
            this.isEditing = true;
        }

        merge () {
            this.$state.go('administration.merge.developers', { developerId: this.developer.developerId });
        }

        split () {
            this.backup = angular.copy(this.developer);
            this.isSplitting = true;
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
                this.onEdit({developer: this.developer});
                this.isEditing = false;
            }
            if (this.isSplitting) {
                this.onSplit({
                    oldDeveloper: this.developer,
                    newDeveloper: this.newDeveloper,
                });
                this.isSplitting = false;
            }
        }

        cancel () {
            this.developer = angular.copy(this.backup);
            this.isEditing = false;
            this.isSplitting = false;
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
