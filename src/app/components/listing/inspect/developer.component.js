export const InspectDeveloperComponent = {
    templateUrl: 'chpl.components/listing/inspect/developer.html',
    bindings: {
        developer: '<',
        developers: '<',
        listing: '<',
        onSelect: '&',
        setChoice: '&',
    },
    controller: class InspectDeveloperController {
        constructor ($log, featureFlags, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.isBlank = utilService.isBlank;
            this.isOn = featureFlags.isOn;
            this.networkService = networkService;
            this.choice = 'choose';
        }

        $onChanges (changes) {
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (changes.developers) {
                this.developers = angular.copy(changes.developers.currentValue);
            }
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
            }
            this.setChoice({choice: this.choice});
        }

        selectInspectingDeveloper () {
            this.listing.developer.developerId = this.developerSelect.developerId;
            this.onSelect({developerId: this.developerSelect.developerId});
        }

        saveInspectingDeveloper () {
            var dev = {
                developer: {
                    address: this.listing.developer.address,
                    contact: this.listing.developer.contact,
                    developerCode: this.developer.developerCode,
                    developerId: this.listing.developer.developerId,
                    name: this.listing.developer.name,
                    selfDeveloper: this.listing.developer.selfDeveloper,
                    status: this.developer.status,
                    statusEvents: this.developer.statusEvents,
                    website: this.listing.developer.website,
                },
                developerIds: [this.listing.developer.developerId],
            };
            if (!dev.developer.address.country) {
                dev.developer.address.country = 'USA';
            }
            if (this.listing.transparencyAttestation && !this.isOn('effective-rule-date-plus-one-week')) {
                dev.transparencyAttestations = [{
                    acbId: this.listing.certifyingBody.id,
                    acbName: this.listing.certifyingBody.name,
                    attestation: { transparencyAttestation: this.listing.transparencyAttestation.transparencyAttestation },
                }];
            }
            let that = this;
            this.networkService.updateDeveloper(dev)
                .then(() => that.onSelect({developerId: dev.developer.developerId}));
        }

        isSystemDevContactInfoValid () {
            this.systemRequirements = [];
            if ((this.choice === 'create')
                || ((this.developer && !this.isBlank(this.developer.name) && !this.isBlank(this.developer.website))
                && (this.developer.contact && !this.isBlank(this.developer.contact.fullName) && !this.isBlank(this.developer.contact.email)
                && !this.isBlank(this.developer.contact.phoneNumber))
                && (this.developer.address && !this.isBlank(this.developer.address.line1) && !this.isBlank(this.developer.address.city)
                && !this.isBlank(this.developer.address.state) && !this.isBlank(this.developer.address.zipcode))
                && (this.getAttestationForCurrentSystemDeveloper())
                && (!this.isBlank(this.getAttestationForCurrentSystemDeveloper().transparencyAttestation)))) {
                return true;
            }
            this.populateDeveloperSystemRequirements();
            return false;
        }

        populateDeveloperSystemRequirements () {
            if (this.developer) {
                const DOES_NOT_EXIST_MSG = ' does not yet exist in the system.'
                const EXISTS_MSG = ' exists in the system.'
                const PLEASE_SAVE_MSG = ' Please select \'Save as Developer Information\' to continue.';
                if (this.isBlank(this.developer.name)) {
                    this.systemRequirements.push('A developer name' + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                }
                if (this.isBlank(this.developer.website)) {
                    this.systemRequirements.push('A developer website' + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                }
                if (this.developer.contact) {
                    if (this.isBlank(this.developer.contact.fullName) || this.isBlank(this.developer.contact.email)
                        || this.isBlank(this.developer.contact.phoneNumber)) {
                        this.systemRequirements.push('At least one type of required developer contact information'
                            + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                    }
                } else {
                    this.systemRequirements.push('None of the required developer contact information'
                        + EXISTS_MSG + PLEASE_SAVE_MSG);
                }
                if (this.developer.address) {
                    if (this.isBlank(this.developer.address.line1) || this.isBlank(this.developer.address.city)
                        || this.isBlank(this.developer.address.state) || this.isBlank(this.developer.address.zipcode)) {
                        this.systemRequirements.push('At least one type of required developer address information'
                            + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                    }
                } else {
                    this.systemRequirements.push('None of the required developer address information'
                        + EXISTS_MSG + PLEASE_SAVE_MSG);
                }
                if (!this.getAttestationForCurrentSystemDeveloper() || this.isBlank(this.getAttestationForCurrentSystemDeveloper().transparencyAttestation)) {
                    this.systemRequirements.push('A transparency attestation' + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                }
            }
        }

        getAttestationForCurrentSystemDeveloper () {
            let that = this;
            if (this.developer && this.developer.transparencyAttestations) {
                let matchingAttestationObj = this.developer.transparencyAttestations.find(function (curAttestationObj) {
                    return curAttestationObj.acbName === that.listing.certifyingBody.name;
                });
                return matchingAttestationObj ? matchingAttestationObj.attestation : undefined;
            }
            return null;
        }
    },
}

angular.module('chpl.components')
    .component('aiInspectDeveloper', InspectDeveloperComponent);
