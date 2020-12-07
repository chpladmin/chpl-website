export const DevelopersMergeComponent = {
    templateUrl: 'chpl.organizations/developers/developer/merge.html',
    bindings: {
        developer: '<',
        developers: '<',
    },
    controller: class DevelopersMergeController {
        constructor ($log, $state, authService, networkService, toaster) {
            'ngInject';
            this.$log = $log;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.toaster = toaster;
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
                this.developers = this.developers.filter(d => d.developerId !== this.developer.developerId);
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
            let mergeDeveloperObject = {
                developer: developer,
                developerIds: this.selectedDevelopers.map(d => d.developerId),
            };
            mergeDeveloperObject.developerIds.push(this.developer.developerId);
            let that = this;
            this.networkService.mergeDevelopers(mergeDeveloperObject)
                .then(response => {
                    if (!response.status || response.status === 200) {
                        that.toaster.pop({
                            type: 'success',
                            title: 'Merge submitted',
                            body: 'Your action has been submitted and you\'ll get an email at ' + response.job.jobDataMap.user.email + ' when it\'s done',
                        });
                        that.$state.go('organizations.developers', {}, {
                            reload: true,
                        });
                    }
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
};

angular
    .module('chpl.organizations')
    .component('chplDevelopersMerge', DevelopersMergeComponent);
