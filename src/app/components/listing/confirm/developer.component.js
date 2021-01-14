export const ConfirmDeveloperComponent = {
    templateUrl: 'chpl.components/listing/confirm/developer.html',
    bindings: {
        developer: '<',
        developers: '<',
        listing: '<',
        takeAction: '&',
        showFormErrors: '<',
    },
    controller: class ConfirmDeveloperController {
        constructor ($log, networkService) {
            'ngInject';
            this.$log = $log;
            this.networkService = networkService;
            this.backup = {};
        }

        $onChanges (changes) {
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
                this.backup.developer = angular.copy(this.developer);
            }
            if (changes.developers && changes.developers.currentValue) {
                this.developers = changes.developers.currentValue
                    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
                this.developers.splice(0, 0, {
                    name: '--- Create a new Developer ---',
                    developerId: undefined,
                });
            }
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
            }
            if (this.developer && this.developers) {
                this.developerSelect = this.developers.find(d => d.developerId === this.developer.developerId);
            }
            if (this.developer && this.listing) {
                this.analyzeDifferences();
            }
            if (!this.developer && this.listing) {
                this.developerSelect = this.developers.find(d => d.developerId === undefined);
                this.developer = angular.copy(this.listing.developer);
            }
        }

        analyzeDifferences () {
            this.developer.styles = {};
            this.listing.developer.styles = {};
            if (this.developer.selfDeveloper !== this.listing.developer.selfDeveloper) {
                this.developer.styles.selfDeveloper = 'confirm__item--modified';
                this.listing.developer.styles.selfDeveloper = 'confirm__item--modified';
            }
            this.applyStyles('website', this.developer.website, this.listing.developer.website);
            if (!this.developer.address) {
                this.developer.address = {};
            }
            this.applyStyles('line1', this.developer.address.line1, this.listing.developer.address.line1);
            this.applyStyles('line2', this.developer.address.line2, this.listing.developer.address.line2);
            this.applyStyles('city', this.developer.address.city, this.listing.developer.address.city);
            this.applyStyles('state', this.developer.address.state, this.listing.developer.address.state);
            this.applyStyles('zipcode', this.developer.address.zipcode, this.listing.developer.address.zipcode);
            this.applyStyles('country', this.developer.address.country, this.listing.developer.address.country);
            if (!this.developer.contact) {
                this.developer.contact = {};
            }
            this.applyStyles('fullName', this.developer.contact.fullName, this.listing.developer.contact.fullName);
            this.applyStyles('title', this.developer.contact.title, this.listing.developer.contact.title);
            this.applyStyles('email', this.developer.contact.email, this.listing.developer.contact.email);
            this.applyStyles('phoneNumber', this.developer.contact.phoneNumber, this.listing.developer.contact.phoneNumber);
        }

        applyStyles (key, system, upload) {
            switch (this.differenceClass(system, upload)) {
            case 'modified':
                this.developer.styles[key] = 'confirm__item--modified';
                this.listing.developer.styles[key] = 'confirm__item--modified';
                break;
            case 'added':
                this.listing.developer.styles[key] = 'confirm__item--added';
                break;
            case 'removed':
                this.developer.styles[key] = 'confirm__item--removed';
                break;
                // no default
            }
        }

        differenceClass (system, upload) {
            if (system === upload) {
                return '';
            }
            if (system && upload) {
                return 'modified';
            }
            if (system) {
                return 'removed';
            }
            if (upload) {
                return 'added';
            }
        }

        selectConfirmingDeveloper () {
            this.listing.developer.developerId = this.developerSelect.developerId;
            this.takeAction({action: 'select', developerId: this.developerSelect.developerId});
            this.form.$setPristine();
        }

        saveConfirmingDeveloper () {
            let developer = {
                address: this.developer.address,
                contact: this.developer.contact,
                developerCode: this.developer.developerCode,
                developerId: this.developer.developerId,
                name: this.developer.name,
                selfDeveloper: this.developer.selfDeveloper,
                status: this.developer.status,
                statusEvents: this.developer.statusEvents,
                website: this.developer.website,
            };
            if (!developer.address.country) {
                developer.address.country = 'USA';
            }
            let that = this;
            this.networkService.updateDeveloper(developer)
                .then(() => {
                    that.takeAction({action: 'select', developerId: developer.developerId});
                    that.form.$setPristine();
                });
        }

        undoEdits () {
            this.developer = angular.copy(this.backup.developer);
            this.form.$setPristine();
            this.analyzeDifferences();
            this.takeAction({action: 'clear'});
        }
    },
};

angular.module('chpl.components')
    .component('chplConfirmDeveloper', ConfirmDeveloperComponent);
