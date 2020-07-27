export const DevelopersMergeComponent = {
    templateUrl: 'chpl.organizations/developers/merge.html',
    bindings: {
        developer: '<',
        developers: '<',
    },
    controller: class DevelopersMergeController {
        constructor ($log, $state, $stateParams, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.version = 'a';
        }

        $onInit () {
            if (this.$stateParams && this.$stateParams.v) {
                this.version = this.$stateParams.v;
            }
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
                this.developers = this.developers.filter(d => d.developerId !== this.developer.developerId)
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
            developerToSave.developerIds.push(this.developer.developerId);
            let that = this;
            this.networkService.updateDeveloper(developerToSave)
                .then(response => {
                    that.$state.go('organizations.developers.developer', {
                        developerId: response.developerId,
                    }, {
                        reload: true,
                    });
                }, error => {
                    that.$log.error(error);
                });
        }

        selectDeveloper (developer) {
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
