export const ConfirmDeveloperComponent = {
    templateUrl: 'chpl.components/listing/confirm/developer.html',
    bindings: {
        developer: '<',
        developers: '<',
        listing: '<',
        onSelect: '&',
        setChoice: '&',
    },
    controller: class ConfirmDeveloperController {
        constructor ($log, networkService) {
            'ngInject';
            this.$log = $log;
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
