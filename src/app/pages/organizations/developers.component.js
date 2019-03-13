export const DevelopersComponent = {
    templateUrl: 'chpl.organizations/developers.html',
    bindings: {
        allowedAcbs: '<',
        developer: '<',
        developers: '<',
        products: '<',
    },
    controller: class DevelopersComponent {
        constructor ($log, $stateParams, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$stateParams = $stateParams;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            this.action = this.$stateParams.action;
            if (changes.allowedAcbs) {
                this.allowedAcbs = (angular.copy(changes.allowedAcbs.currentValue)).acbs;
            }
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
                this.backup = angular.copy(this.developer);
            }
            if (changes.developers) {
                this.developers = (angular.copy(changes.developers.currentValue)).developers;
            }
            if (changes.products) {
                this.products = (angular.copy(changes.products.currentValue)).products;
            }
        }

        cancel () {
            this.developer = angular.copy(this.backup);
            this.action = undefined;
            this.$log.info('cancel', this.developer);
        }

        save (developer) {
            let that = this;
            this.developer = developer;
            this.networkService.updateDeveloper({
                developer: this.developer,
                developerIds: [this.developer.developerId],
            }).then(response => {
                if (!response.status || response.status === 200 || angular.isObject(response.status)) {
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
    },
}

angular.module('chpl.organizations')
    .component('chplDevelopers', DevelopersComponent);
