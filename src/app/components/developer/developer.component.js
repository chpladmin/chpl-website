export const DeveloperComponent = {
    templateUrl: 'chpl.components/developer/developer.html',
    bindings: {
        developer: '<',
        allowedAcbs: '<',
        canEdit: '<',
        canMerge: '<',
        canSplit: '<',
        isChangeRequest: '<',
        isEditing: '<',
        isInvalid: '<',
        isMerging: '<',
        isSplitting: '<',
        mergingDevelopers: '<',
        onCancel: '&?',
        onEdit: '&?',
        showFormErrors: '<',
        takeAction: '&',
    },
    controller: class DeveloperComponent {
        constructor ($filter, $log, authService, featureFlags) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.isOn = featureFlags.isOn;
            this.mergeOptions = {};
            this.errorMessages = [];
        }

        $onChanges (changes) {
            if (changes.allowedAcbs) {
                this.allowedAcbs = angular.copy(changes.allowedAcbs.currentValue);
            }
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
                if (!this.developer.contact) {
                    this.developer.contact = {};
                }
                if (!this.developer.address) {
                    this.developer.address = {};
                }
                if (this.developer.statusEvents) {
                    this.developer.statusEvents = this.developer.statusEvents.map(e => {
                        e.statusDateObject = new Date(e.statusDate);
                        return e;
                    });
                }
                this.transMap = {};
                if (this.developer.transparencyAttestations) {
                    this.developer.transparencyAttestations.forEach(att => {
                        this.transMap[att.acbName] = att.attestation;
                    });
                }
                this.developerBackup = angular.copy(this.developer);
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
            if (changes.isChangeRequest) {
                this.isChangeRequest = angular.copy(changes.isChangeRequest.currentValue);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
            }
            if (changes.isInvalid) {
                this.isInvalid = angular.copy(changes.isInvalid.currentValue);
            }
            if (changes.isMeging) {
                this.isMerging = angular.copy(changes.isMerging.currentValue);
            }
            if (changes.isSplitting) {
                this.isSplitting = angular.copy(changes.isSplitting.currentValue);
            }
            if (changes.mergingDevelopers) {
                this.mergingDevelopers = angular.copy(changes.mergingDevelopers.currentValue);
                this.generateErrorMessages();
            }
            if (changes.showFormErrors) {
                this.showFormErrors = angular.copy(changes.showFormErrors.currentValue);
            }
            if (this.developer && this.mergingDevelopers) {
                this.generateMergeOptions()
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

        showFooter () {
            return this.can('edit') || this.can('merge') || this.can('split');
        }

        isEffectiveRuleDatePlusOneWeekOn () {
            return this.isOn('effective-rule-date-plus-one-week');
        }

        isEffectiveRuleDateOn () {
            return this.isOn('effective-rule-date');
        }

        isTransparencyAttestationEditable () {
            if (this.isEffectiveRuleDatePlusOneWeekOn()) {
                return this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
            } else {
                return true;
            }
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
        formUpdate () {
            if (this.isChangeRequest) {
                this.onEdit({developer: this.developer});
            }
        }

        editAddress (address) {
            this.developer.address = angular.copy(address);
            if (this.isChangeRequest) {
                this.onEdit({developer: this.developer});
            }
            this.generateErrorMessages();
        }

        editContact (contact) {
            this.developer.contact = angular.copy(contact);
            if (this.isChangeRequest) {
                this.onEdit({developer: this.developer});
            }
            this.generateErrorMessages();
        }

        takeActionBarAction (action) {
            switch (action) {
            case 'cancel':
                this.cancel();
                break;
            case 'mouseover':
                this.showFormErrors = true;
                this.generateErrorMessages();
                break;
            case 'save':
                this.save();
                break;
                //no default
            }
        }

        /*
         * Form validation
         */
        generateErrorMessages () {
            let messages = [];
            if (this.showFormErrors) {
                if (this.isMerging && (!this.mergingDevelopers || this.mergingDevelopers.length === 0)) {
                    messages.push('At least one other Developer must be selected to merge');
                }
            }
            this.errorMessages = messages;
        }

        isValid () {
            return this.form.$valid // basic form validation
                && !this.isInvalid // validation from outside
                && this.developer.statusEvents && this.developer.statusEvents.length > 0 // status history exists
                && this.developer.statusEvents.reduce((acc, e) => acc && !this.matchesPreviousStatus(e) && !this.matchesPreviousDate(e), true) // no duplicate status history data
                && this.errorMessages.length === 0; // business logic error messages
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

        /*
         * Pill generation
         */
        generateMergeOptions () {
            this.mergeOptions = {
                name: Array.from(new Set([this.developerBackup.name].concat(this.mergingDevelopers.map(d => d.name)))),
                website: [],
            };
            this.contactOptions = {
                fullName: [],
                title: [],
                email: [],
                phoneNumber: [],
            };
            this.addressOptions = {
                line1: [],
                line2: [],
                city: [],
                state: [],
                zipcode: [],
                country: [],
            };
            this.fillMergeOptionByDeveloper(this.developerBackup);
            this.mergingDevelopers.forEach(d => this.fillMergeOptionByDeveloper(d));
            this.mergeOptions.website = Array.from(new Set(this.mergeOptions.website));
            this.contactOptions.fullName = Array.from(new Set(this.contactOptions.fullName));
            this.contactOptions.title = Array.from(new Set(this.contactOptions.title));
            this.contactOptions.email = Array.from(new Set(this.contactOptions.email));
            this.contactOptions.phoneNumber = Array.from(new Set(this.contactOptions.phoneNumber));
            this.addressOptions.line1 = Array.from(new Set(this.addressOptions.line1));
            this.addressOptions.line2 = Array.from(new Set(this.addressOptions.line2));
            this.addressOptions.city = Array.from(new Set(this.addressOptions.city));
            this.addressOptions.state = Array.from(new Set(this.addressOptions.state));
            this.addressOptions.zipcode = Array.from(new Set(this.addressOptions.zipcode));
            this.addressOptions.country = Array.from(new Set(this.addressOptions.country));
        }

        fillMergeOptionByDeveloper (developer) {
            if (developer.website) {
                this.mergeOptions.website.push(developer.website);
            }
            if (developer.contact) {
                if (developer.contact.fullName) {
                    this.contactOptions.fullName.push(developer.contact.fullName);
                }
                if (developer.contact.title) {
                    this.contactOptions.title.push(developer.contact.title);
                }
                if (developer.contact.email) {
                    this.contactOptions.email.push(developer.contact.email);
                }
                if (developer.contact.phoneNumber) {
                    this.contactOptions.phoneNumber.push(developer.contact.phoneNumber);
                }
            }
            if (developer.address) {
                if (developer.address.line1) {
                    this.addressOptions.line1.push(developer.address.line1);
                }
                if (developer.address.line2) {
                    this.addressOptions.line2.push(developer.address.line2);
                }
                if (developer.address.city) {
                    this.addressOptions.city.push(developer.address.city);
                }
                if (developer.address.state) {
                    this.addressOptions.state.push(developer.address.state);
                }
                if (developer.address.zipcode) {
                    this.addressOptions.zipcode.push(developer.address.zipcode);
                }
                if (developer.address.country) {
                    this.addressOptions.country.push(developer.address.country);
                }
            }
        }

        getDifferences (predicate) {
            if (!this.developer || !this.mergeOptions[predicate]) { return; }
            return this.mergeOptions[predicate]
                .filter(e => e && e.length > 0 && e !== this.developer[predicate])
                .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
        }

        selectDifference (predicate, value) {
            this.developer[predicate] = value;
        }
    },
}

angular.module('chpl.components')
    .component('chplDeveloper', DeveloperComponent);
