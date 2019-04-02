export const ProductComponent = {
    templateUrl: 'chpl.components/product/product.html',
    bindings: {
        developer: '<',
        product: '<',
        developers: '<',
        canEdit: '<',
        canMerge: '<',
        canSplit: '<',
        canView: '<',
        isEditing: '<',
        isInvalid: '<',
        isMerging: '<',
        isSplitting: '<',
        onCancel: '&?',
        onEdit: '&?',
        versions: '<',
        showFull: '<',
        showVersions: '<',
        takeAction: '&',
    },
    controller: class ProductComponent {
        constructor ($filter, $log, authService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.valid = {
                contact: true,
            }
        }

        $onChanges (changes) {
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (changes.product) {
                this.product = angular.copy(changes.product.currentValue);
                this.product.ownerHistory = this.product.ownerHistory.map(o => {
                    o.transferDateObject = new Date(o.transferDate);
                    return o;
                });
            }
            if (changes.developers) {
                this.developers = angular.copy(changes.developers.currentValue);
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
            if (changes.canView) {
                this.canView = angular.copy(changes.canView.currentValue);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
            }
            if (changes.isInvalid) {
                this.isInvalid = angular.copy(changes.isInvalid.currentValue);
            }
            if (changes.isMerging) {
                this.isMerging = angular.copy(changes.isMerging.currentValue);
            }
            if (changes.isSplitting) {
                this.isSplitting = angular.copy(changes.isSplitting.currentValue);
            }
            if (changes.versions) {
                this.versions = angular.copy(changes.versions.currentValue);
            }
            if (changes.versionContact) {
                this.versionContact = angular.copy(changes.versionContact.currentValue);
            }
            if (changes.showFull) {
                this.showFull = angular.copy(changes.showFull.currentValue);
            }
            if (changes.showVersions) {
                this.showVersions = angular.copy(changes.showVersions.currentValue);
            }
        }

        /*
         * Allowed actions
         */
        can (action) {
            if (action === 'edit') {
                return this.canEdit // allowed by containing component
                    && (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
                        || this.hasAnyRole(['ROLE_ACB']) && this.developer.status.status === 'Active') // allowed for ACB iff Developer is "Active"
            }
            if (action === 'merge') {
                return this.canMerge // allowed by containing component
                    && this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']); // always allowed asADMIN/ONC
            }
            if (action === 'split') {
                return this.canSplit // allowed by containing component
                    && (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
                        || this.hasAnyRole(['ROLE_ACB']) && this.developer.status.status === 'Active') // allowed for ACB iff Developer is "Active"
            }
        }

        /*
         * Initiate changes
         */
        edit () {
            this.takeAction({
                action: 'edit',
                productId: this.product.productId,
            });
        }

        merge () {
            this.takeAction({
                action: 'merge',
                productId: this.product.productId,
            });
        }

        split () {
            this.takeAction({
                action: 'split',
                productId: this.product.productId,
            });
        }

        view () {
            this.takeAction({
                productId: this.product.productId,
            });
        }

        /*
         * Resolve changes
         */
        save () {
            if (!this.isSplitting) {
                this.product.owner = angular.copy(this.developers.filter(d => d.developerId === this.product.owner.developerId)[0]);
                this.product.ownerHistory = this.product.ownerHistory.map(o => {
                    o.transferDate = o.transferDateObject.getTime();
                    return o;
                });
            }
            this.onEdit({product: this.product});
        }

        cancel () {
            this.onCancel();
        }

        /*
         * Handle callbacks
         */
        editContact (contact, errors, validForm) {
            this.product.contact = angular.copy(contact);
            this.valid.contact = validForm;
        }

        /*
         * Form validation
         */
        isValid () {
            return this.form.$valid // basic form validation
                && !this.isInvalid // validation from outside
                && this.valid.contact; // validation from sub-components
        }

        /*
         * Form actions
         */
        addOwnerHistory () {
            this.product.ownerHistory.push({transferDateObject: new Date()});
        }

        changeCurrentOwner (developerId) {
            this.product.ownerHistory.push({
                developer: angular.copy(this.developers.filter(d => d.developerId === developerId)[0]),
                transferDateObject: new Date(),
            });
        }

        removeOwnerHistory (idx) {
            this.product.ownerHistory.splice(idx, 1);
        }
    },
}

angular.module('chpl.components')
    .component('chplProduct', ProductComponent);
