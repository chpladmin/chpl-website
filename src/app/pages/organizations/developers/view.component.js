export const DevelopersViewComponent = {
    templateUrl: 'chpl.organizations/developers/view.html',
    bindings: {
        developer: '<',
        developers: '<',
        products: '<',
        action: '@',
    },
    controller: class DevelopersViewComponent {
        constructor ($log, $scope, $state, $stateParams, authService, networkService, toaster) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.toaster = toaster;
            this.backup = {};
            this.splitEdit = true;
            this.movingProducts = [];
            this.activeAcbs = [];
            this.roles = ['ROLE_DEVELOPER'];
        }

        $onInit () {
            let that = this;
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                this.loadData();
            }
            let loggedIn = this.$scope.$on('loggedIn', () => {
                that.loadData();
            })
            this.$scope.$on('$destroy', loggedIn);
            this.networkService.getSearchOptions()
                .then(options => that.searchOptions = options);
        }

        $onChanges (changes) {
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
                this.backup.developer = angular.copy(this.developer);
            }
            if (changes.developers) {
                let acbs = {};
                let devs = changes.developers.currentValue.developers;
                this.allDevelopers = devs.map(d => {
                    d.transMap = {};
                    d.transparencyAttestations.forEach(att => {
                        d.transMap[att.acbName] = att.attestation;
                        acbs[att.acbName] = true;
                    });
                    return d;
                });
                this.developers = devs.filter(d => d.developerId !== this.developer.developerId);
                this.backup.developers = angular.copy(this.developers);
                angular.forEach(acbs, (value, key) => this.activeAcbs.push(key));
            }
            if (changes.products) {
                this.products = angular.copy(changes.products.currentValue.products);
                this.backup.products = angular.copy(this.products);
            }
        }

        can (action) {
            if (action === 'split-developer' && this.products.length < 2) { return false; } // cannot split developer without at least two products
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) { return true; } // can do everything
            if (action === 'merge') { return false; } // if not above roles, can't merge
            return this.developer.status.status === 'Active' && this.hasAnyRole(['ROLE_ACB']); // must be active
        }

        cancel () {
            this.developer = angular.copy(this.backup.developer);
            this.developers = angular.copy(this.backup.developers);
            this.products = angular.copy(this.backup.products);
            this.$state.go('^');
        }

        loadData () {
            let that = this;
            this.networkService.getAcbs(true).then(response => {
                that.allowedAcbs = response.acbs;
            });
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']) && this.$stateParams.developerId) {
                this.networkService.getUsersAtDeveloper(this.$stateParams.developerId).then(response => that.users = response.users);
            }
        }

        save (developer) {
            let developerIds = [this.developer.developerId];
            let that = this;
            this.developer = developer;
            this.errorMessages = [];
            this.networkService.updateDeveloper({
                developer: this.developer,
                developerIds: developerIds,
            }).then(response => {
                if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                    that.developer = response;
                    that.backup.developer = angular.copy(response);
                    this.$state.go('^', undefined, {reload: true});
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

        takeAction (action) {
            this.$state.go('.' + action);
        }

        takeUserAction (action, data) {
            let that = this;
            switch (action) {
            case 'edit':
                this.state = 'focusUsers';
                break;
            case 'cancel':
                this.state = undefined;
                break;
            case 'delete':
                this.state = undefined;
                this.networkService.removeUserFromDeveloper(data, this.$stateParams.developerId)
                    .then(() => that.networkService.getUsersAtDeveloper(that.$stateParams.developerId).then(response => that.users = response.users));
                break;
            case 'invite':
                this.state = undefined;
                this.networkService.inviteUser({
                    role: data.role,
                    emailAddress: data.email,
                    permissionObjectId: this.$stateParams.developerId,
                }).then(() => that.toaster.pop({
                    type: 'success',
                    title: 'Email sent',
                    body: 'Email sent successfully to ' + data.email,
                }));
                break;
            case 'refresh':
                this.state = undefined;
                this.networkService.getUsersAtDeveloper(this.$stateParams.developerId)
                    .then(response => that.users = response.users);
                break;
            case 'impersonate':
                this.state = undefined;
                this.$state.reload();
                break;
                //no default
            }
        }
    },
}

angular.module('chpl.organizations')
    .component('chplDevelopersView', DevelopersViewComponent);
