export const VersionComponent = {
    templateUrl: 'chpl.components/version/version.html',
    bindings: {
        version: '<',
        developer: '<',
        canEdit: '<',
        canMerge: '<',
        canSplit: '<',
        canView: '<',
        isEditing: '<',
        isInvalid: '<',
        isSplitting: '<',
        onCancel: '&',
        onEdit: '&',
        showFull: '<',
        takeAction: '&',
    },
    controller: class VersionComponent {
        constructor ($filter, $log, authService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }

        $onChanges (changes) {
            if (changes.version) {
                this.version = angular.copy(changes.version.currentValue);
            }
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
            if (changes.canView) {
                this.canView = angular.copy(changes.canView.currentValue);
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
            if (changes.showFull) {
                this.showFull = angular.copy(changes.showFull.currentValue);
            }
        }

        /*
         * Allowed actions
         */
        can (action) {
            switch (action) {
            case 'edit':
                return this.canEdit // allowed by containing component
                    && (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
                        || this.hasAnyRole(['ROLE_ACB']) && this.developer.status.status === 'Active') // allowed for ACB iff Developer is "Active"
            case 'merge':
                return this.canMerge // allowed by containing component
                    && this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']); // always allowed as ADMIN/ONC
            case 'split':
                return this.canSplit // allowed by containing component
                    && (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
                        || this.hasAnyRole(['ROLE_ACB']) && this.developer.status.status === 'Active') // allowed for ACB iff Developer is "Active"o
            default:
                return false;
            }
        }

        /*
         * Initiate changes
         */
        edit () {
            this.takeAction({
                action: 'edit',
                versionId: this.version.versionId,
            });
        }

        merge () {
            this.takeAction({
                action: 'merge',
                versionId: this.version.versionId,
            });
        }

        split () {
            this.takeAction({
                action: 'split',
                versionId: this.version.versionId,
            });
        }

        view () {
            this.takeAction({
                versionId: this.version.versionId,
            });
        }

        /*
         * Resolve changes
         */
        save () {
            this.onEdit({version: this.version});
        }

        cancel () {
            this.onCancel();
        }

        /*
         * Form validation
         */
        isValid () {
            return this.form.$valid // basic form validation
                && !this.isInvalid; // validation from outside
        }
    },
}

angular.module('chpl.components')
    .component('chplVersion', VersionComponent);
