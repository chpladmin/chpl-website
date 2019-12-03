export const DeveloperComponent = {
    templateUrl: 'chpl.components/developer/developer.html',
    bindings: {
        developer: '<',
        allowedAcbs: '<',
        canEdit: '<',
        canMerge: '<',
        canSplit: '<',
        isEditing: '<',
        isInvalid: '<',
        isSplitting: '<',
        onCancel: '&?',
        onEdit: '&?',
        showFull: '<',
        takeAction: '&',
    },
    controller: class DeveloperComponent {
        constructor ($filter, $log, authService, featureFlags) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.isOn = featureFlags.isOn;
            this.valid = {
                address: true,
                contact: true,
            }
            this.isAcbAdmin = this.hasAnyRole(['ROLE_ACB']);
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
            if (changes.showFull) {
                this.showFull = angular.copy(changes.showFull.currentValue);
            }
        }

        /*
         * Allowed actions
         */
        can (action) {
            if (action === 'edit') {
                return this.canEdit // allowed by containing component
                    && (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
                        || this.hasAnyRole(['ROLE_ACB']) && this.developer.status.status === 'Active' // allowed for ACB iff Developer is "Active"
                        || this.hasAnyRole(['ROLE_DEVELOPER']) && this.developer.status.status === 'Active' && this.isOn('change-request')) // allowed for DEVELOPER iff Developer is "Active"
            }
            if (action === 'merge') {
                return this.canMerge // allowed by containing component
                    && this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']); // always allowed as ADMIN/ONC
            }
            if (action === 'split') {
                return this.canSplit // allowed by containing component
                    && (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
                        || this.hasAnyRole(['ROLE_ACB']) && this.developer.status.status === 'Active') // allowed for ACB iff Developer is "Active"
            }
        }

        isEffectiveRuleDatePlusOneWeekOn () {
            return this.isOn('effective-rule-date-plus-one-week');
        }

        isTransparencyAttestationViewable () {
            if (this.isEffectiveRuleDatePlusOneWeekOn()) {
                return !this.isAcbAdmin;
            }
            // Allows any non-ACB to view if flag is off
            return true;
        }

        isTransparencyAttestationEditable () {
            if (this.isEffectiveRuleDatePlusOneWeekOn()) {
                return !this.isAcbAdmin;
            }
            // Enforces existing contract in this case prior to flag requiring ACB to edit, whereas after flag, only non-ACBs can edit
            return this.isAcbAdmin;
        }

        /*
         * Initiate changes
         */
        edit () {
            this.takeAction({
                action: 'edit',
                developerId: this.developer.developerId,
            });
        }

        merge () {
            this.takeAction({
                action: 'merge',
                developerId: this.developer.developerId,
            });
        }

        split () {
            this.takeAction({
                action: 'split',
                developerId: this.developer.developerId,
            });
        }

        /*
         * Resolve changes
         */
        save () {
            this.developer.statusEvents = this.developer.statusEvents.map(e => {
                e.statusDate = e.statusDateObject.getTime();
                return e;
            });
            this.developer.transparencyAttestations = Object.keys(this.transMap).map(key => { return {acbName: key, attestation: this.transMap[key]}; });
            this.onEdit({developer: this.developer});
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
            return this.developer.status.status !== 'Active' && orderedStatus[0].status && orderedStatus[0].status.status === 'Active';
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
