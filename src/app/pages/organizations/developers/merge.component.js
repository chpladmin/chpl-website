export const DevelopersMergeComponent = {
    templateUrl: 'chpl.organizations/developers/merge.html',
    bindings: {
        developer: '<',
        developers: '<',
    },
    controller: class DevelopersMergeController {
        constructor ($log, $state, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.developer && changes.developer.currentValue) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (changes.developers) {
                this.developers = angular.copy(changes.developers.currentValue.products);
            }
        }

        cancel () {
            this.$state.go('organizations.developers.developer', {
                developerId: this.developer.developerId,
            }, {
                reload: true,
            });
        }

        merge (developer) {
            let mergeDeveloper = {
                oldDeveloper: this.developer,
                newDeveloper: developer,
                oldProducts: this.products,
                newProducts: this.movingProducts,
            };
            this.errorMessages = [];
            let that = this;
            this.networkService.mergeDeveloper(mergeDeveloper)
                .then(response => {
                    if (!response.status || response.status === 200) {
                        that.$state.go('organizations.developers.developer', {
                            developerId: that.developer.developerId,
                        }, {
                            reload: true,
                        });
                    } else {
                        if (response.data.errorMessages) {
                            that.errorMessages = response.data.errorMessages;
                        } else if (response.data.error) {
                            that.errorMessages.push(response.data.error);
                        } else {
                            that.errorMessages = ['An error has occurred.'];
                        }
                    }
                }, error => {
                    if (error.data.errorMessages) {
                        that.errorMessages = error.data.errorMessages;
                    } else if (error.data.error) {
                        that.errorMessages.push(error.data.error);
                    } else {
                        that.errorMessages = ['An error has occurred.'];
                    }
                });
        }
    },
}

angular
    .module('chpl.organizations')
    .component('chplDevelopersMerge', DevelopersMergeComponent);
