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
            if (changes.developers && changes.developers.currentValue) {
                this.developers = changes.developers.currentValue.developers
                    .filter(d => !d.deleted)
                    .map(d => {
                        d.selected = false;
                        return d;
                    })
                    .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
            }
            if (this.developer && this.developers) {
                this.developers.forEach(d => {
                    if (d.developerId === this.developer.developerId) {
                        d.selected = true;
                    }
                });
                this.selectedDevelopers = this.developers.filter(d => d.selected);
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
            let developerToSave = {
                developer: developer,
                developerIds: this.selectedDevelopers.map(d => d.developerId),
            };
            this.errorMessages = [];
            let that = this;
            this.networkService.updateDeveloper(developerToSave)
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

        selectDeveloper (developer) {
            if (developer.developerId === this.developer.developerId) { return; }
            this.developers
                .filter(d => d.developerId === developer.developerId)
                .forEach(d => d.selected = !d.selected);
            this.selectedDevelopers = this.developers
                .filter(d => d.selected)
                .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
            this.selectedToMerge = null;
        }
    },
}

angular
    .module('chpl.organizations')
    .component('chplDevelopersMerge', DevelopersMergeComponent);
