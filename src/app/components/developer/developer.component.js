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
        constructor ($log) {
            'ngInject'
            this.$log = $log;
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

        cancel () {
            this.developer = angular.copy(this.backup);
            this.isEditing = false;
            this.isSplitting = false;
        }

        edit () {
            this.backup = angular.copy(this.developer);
            this.isEditing = true;
        }

        editAddress (address, errors, validForm) {
            this.developer.address = angular.copy(address);
            this.valid.address = validForm;
        }

        editContact (contact, errors, validForm) {
            this.developer.contact = angular.copy(contact);
            this.valid.contact = validForm;
        }

        isValid () {
            this.$log.info(this.form, this.valid);
            return this.form.$valid && this.valid.address && this.valid.contact;
        }

        save () {
            if (this.isEditing) {
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

        split () {
            this.backup = angular.copy(this.developer);
            this.isSplitting = true;
        }
    },
}

angular.module('chpl.components')
    .component('chplDeveloper', DeveloperComponent);
