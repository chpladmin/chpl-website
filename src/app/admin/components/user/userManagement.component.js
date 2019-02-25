export const UserManagementComponent = {
    templateUrl: 'chpl.admin/components/user/userManagement.html',
    bindings: {
        acbId: '@',
        atlId: '@',
    },
    controller: class UserManagementController {
        constructor ($location, $log, $rootScope, $uibModal, authService, networkService) {
            'ngInject'
            this.$location = $location;
            this.$log = $log;
            this.$rootScope = $rootScope;
            this.$uibModal = $uibModal;
            this.authService = authService;
            this.networkService = networkService;
        }

        $onInit () {
            this._loadUsers();
        }

        impersonateUser (user) {
            this.networkService.impersonateUser(user)
                .then(token => {
                    this.authService.saveToken(token.token);
                    this.$rootScope.$broadcast('impersonating');
                    this.$location.path('/admin');
                });
        }

        inviteUser () {
            const acbId = this.acbId;
            const atlId = this.atlId;
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/user/edit.html',
                controller: 'EditUserController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    user: () => { return {}; },
                    action: () => 'invite',
                    acbId: () => acbId,
                    atlId: () => atlId,
                },
            });
        }

        updateUser (user) {
            const acbId = this.acbId;
            const atlId = this.atlId;
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/user/edit.html',
                controller: 'EditUserController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    user: () => user,
                    action: () => 'edit',
                    acbId: () => acbId,
                    atlId: () => atlId,
                },
            });
            this.modalInstance.result.then(() => {
                this._loadUsers();
            });
        }

        ////////////////////////////////////////////////////////////////////

        _loadUsers () {
            if (this.acbId) {
                this.networkService.getUsersAtAcb(this.acbId)
                    .then(response => {
                        this.users = response.users;
                    });
            } else if (this.atlId) {
                this.networkService.getUsersAtAtl(this.atlId)
                    .then(response => {
                        this.users = response.users;
                    });
            } else {
                this.networkService.getUsers()
                    .then(response => {
                        this.users = response.users;
                    });
            }
        }
    },
}

angular
    .module('chpl.admin')
    .component('aiUserManagement', UserManagementComponent);
