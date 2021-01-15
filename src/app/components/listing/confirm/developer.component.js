export const ConfirmDeveloperComponent = {
    templateUrl: 'chpl.components/listing/confirm/developer.html',
    bindings: {
        developers: '<',
        pending: '<',
        showFormErrors: '<',
        takeAction: '&',
        uploaded: '<',
    },
    controller: class ConfirmDeveloperController {
        constructor ($log, networkService) {
            'ngInject';
            this.$log = $log;
            this.networkService = networkService;
            this.backup = {};
        }

        $onInit () {
            this.$log.info('init');
            if (this.developers) {
                this.developers.splice(0, 0, {
                    name: '--- Create a new Developer ---',
                    developerId: undefined,
                });
                if (this.pending) {
                    this.pendingSelect = this.developers.find(d => d.developerId === this.pending.developerId);
                } else if (this.uploaded) {
                    this.pendingSelect = this.developers.find(d => d.developerId === undefined);
                    this.pending = angular.copy(this.uploaded);
                }
            }
        }

        $onChanges (changes) {
            if (changes.developers && changes.developers.currentValue) {
                this.developers = changes.developers.currentValue
                    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
            }
            if (changes.pending) {
                this.pending = angular.copy(changes.pending.currentValue);
                this.backup.pending = angular.copy(this.pending);
            }
            if (changes.uploaded) {
                this.uploaded = angular.copy(changes.uploaded.currentValue);
            }
            if (this.pending && this.uploaded) {
                this.analyzeDifferences();
            }
        }

        analyzeDifferences () {
            this.pending.styles = {};
            this.uploaded.styles = {};
            if (this.pending.selfDeveloper !== this.uploaded.selfDeveloper) {
                this.pending.styles.selfDeveloper = 'confirm__item--modified';
                this.uploaded.styles.selfDeveloper = 'confirm__item--modified';
            }
            this.applyStyles('website', this.pending.website, this.uploaded.website);
            if (!this.pending.address) {
                this.pending.address = {};
            }
            this.applyStyles('line1', this.pending.address.line1, this.uploaded.address.line1);
            this.applyStyles('line2', this.pending.address.line2, this.uploaded.address.line2);
            this.applyStyles('city', this.pending.address.city, this.uploaded.address.city);
            this.applyStyles('state', this.pending.address.state, this.uploaded.address.state);
            this.applyStyles('zipcode', this.pending.address.zipcode, this.uploaded.address.zipcode);
            this.applyStyles('country', this.pending.address.country, this.uploaded.address.country);
            if (!this.pending.contact) {
                this.pending.contact = {};
            }
            this.applyStyles('fullName', this.pending.contact.fullName, this.uploaded.contact.fullName);
            this.applyStyles('title', this.pending.contact.title, this.uploaded.contact.title);
            this.applyStyles('email', this.pending.contact.email, this.uploaded.contact.email);
            this.applyStyles('phoneNumber', this.pending.contact.phoneNumber, this.uploaded.contact.phoneNumber);
        }

        applyStyles (key, system, upload) {
            switch (this.differenceClass(system, upload)) {
            case 'modified':
                this.pending.styles[key] = 'confirm__item--modified';
                this.uploaded.styles[key] = 'confirm__item--modified';
                break;
            case 'added':
                this.uploaded.styles[key] = 'confirm__item--added';
                break;
            case 'removed':
                this.pending.styles[key] = 'confirm__item--removed';
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
            this.uploaded.developerId = this.pendingSelect.developerId;
            this.takeAction({action: 'select', payload: this.pendingSelect.developerId});
            this.form.$setPristine();
        }

        saveConfirmingDeveloper () {
            let developer = {
                address: this.pending.address,
                contact: this.pending.contact,
                developerCode: this.pending.developerCode,
                developerId: this.pending.developerId,
                name: this.pending.name,
                selfDeveloper: this.pending.selfDeveloper,
                status: this.pending.status,
                statusEvents: this.pending.statusEvents,
                website: this.pending.website,
            };
            if (!developer.address.country) {
                developer.address.country = 'USA';
            }
            let that = this;
            this.networkService.updateDeveloper(developer)
                .then(() => {
                    that.takeAction({action: 'select', payload: developer.developerId});
                    that.form.$setPristine();
                });
        }

        undoEdits () {
            this.pending = angular.copy(this.backup.pending);
            this.form.$setPristine();
            this.analyzeDifferences();
            this.takeAction({action: 'clear'});
        }
    },
};

angular.module('chpl.components')
    .component('chplConfirmDeveloper', ConfirmDeveloperComponent);
