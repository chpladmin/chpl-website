export const ConfirmDeveloperComponent = {
    templateUrl: 'chpl.components/listing/confirm/developer.html',
    bindings: {
        developer: '<',
        developers: '<',
        listing: '<',
        //onSelect: '&',
        //setChoice: '&',
    },
    controller: class ConfirmDeveloperController {
        constructor ($log, networkService) {
            'ngInject';
            this.$log = $log;
            this.networkService = networkService;
            //this.choice = 'choose';
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
            //this.setChoice({choice: this.choice});
            if (this.developer && this.listing) {
                this.analyzeDifferences();
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

        toggle () {
            if (this.choice === 'choose') {
                this.choice = 'create';
            } else {
                this.choice = 'choose';
            }
        }

        selectConfirmingDeveloper () {
            this.listing.developer.developerId = this.developerSelect.developerId;
            this.onSelect({developerId: this.developerSelect.developerId});
        }

        saveConfirmingDeveloper () {
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
            let that = this;
            this.networkService.updateDeveloper(dev)
                .then(() => that.onSelect({developerId: dev.developer.developerId}));
        }
    },
};

angular.module('chpl.components')
    .component('chplConfirmDeveloper', ConfirmDeveloperComponent);
