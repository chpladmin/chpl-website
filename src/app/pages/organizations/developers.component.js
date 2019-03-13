export const DevelopersComponent = {
    templateUrl: 'chpl.organizations/developers.html',
    bindings: {
        allowedAcbs: '<',
        developer: '<',
        developers: '<',
        products: '<',
    },
    controller: class DevelopersComponent {
        constructor ($log, $state, $stateParams, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.backup = {};
        }

        $onChanges (changes) {
            this.action = this.$stateParams.action;
            if (changes.allowedAcbs) {
                this.allowedAcbs = (angular.copy(changes.allowedAcbs.currentValue)).acbs;
            }
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
                this.backup.developer = angular.copy(this.developer);
            }
            if (changes.developers) {
                this.developers = (angular.copy(changes.developers.currentValue)).developers;
                this.backup.developers = angular.copy(this.developers);
                this.mergingDevelopers = [];
            }
            if (changes.products) {
                this.products = (angular.copy(changes.products.currentValue)).products;
            }
        }

        cancel () {
            this.developer = angular.copy(this.backup.developer);
            this.developers = angular.copy(this.backup.developers);
            this.mergingDevelopers = [];
            this.action = undefined;
        }

        save (developer) {
            let developerIds = [this.developer.developerId];
            if (this.action === 'merge') {
                developerIds = developerIds.concat(this.mergingDevelopers.map(dev => dev.developerId));
            }
            let that = this;
            this.developer = developer;
            this.networkService.updateDeveloper({
                developer: this.developer,
                developerIds: developerIds,
            }).then(response => {
                if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                    if (that.action === 'merge') {
                        this.$state.go('organizations.developers', {
                            developerId: response.developerId,
                        });
                    }
                    that.developer = response;
                    that.action = undefined;
                } else {
                    if (response.data.errorMessages) {
                        that.errorMessages = response.data.errorMessages;
                    } else if (response.data.error) {
                        that.errorMessages = [];
                        that.errorMessages.push(response.data.error);
                    } else {
                        that.errorMessages = ['An error has occurred.'];
                    }
                }
            }, error => {
                if (error.data.errorMessages) {
                    that.errorMessages = error.data.errorMessages;
                } else if (error.data.error) {
                    that.errorMessages = [];
                    that.errorMessages.push(error.data.error);
                } else {
                    that.errorMessages = ['An error has occurred.'];
                }
            });
        }

        takeAction (action) {
            this.action = action;
        }

        toggleMerge (developer, merge) {
            if (merge) {
                this.mergingDevelopers.push(this.developers.filter(dev => dev.developerId === developer.developerId)[0]);
                this.developers = this.developers.filter(dev => dev.developerId !== developer.developerId);
            } else {
                this.developers.push(this.mergingDevelopers.filter(dev => dev.developerId === developer.developerId)[0]);
                this.mergingDevelopers = this.mergingDevelopers.filter(dev => dev.developerId !== developer.developerId);
            }
        }
    },
}

angular.module('chpl.organizations')
    .component('chplDevelopers', DevelopersComponent);
