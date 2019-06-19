export const UserManagementComponent = {
    templateUrl: 'chpl.users/management.html',
    bindings: {
        users: '<',
    },
    controller: class UserManagementComponent {
        constructor ($log, $scope, $state, authService, networkService, toaster) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.toaster = toaster;
        }

        $onInit () {
            let that = this;
            let loggedIn = this.$scope.$on('loggedIn', that.handleRole())
            this.$scope.$on('$destroy', loggedIn);
            this.handleRole();
        }

        handleRole () {
            if (this.hasAnyRole() && !this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                this.$state.go('search');
            }
            this.roles = ['ROLE_ONC', 'ROLE_CMS_STAFF'];
            if (this.hasAnyRole(['ROLE_ADMIN'])) {
                this.roles.push('ROLE_ADMIN');
            }
        }

        $onChanges (changes) {
            if (changes.users.currentValue) {
                this.users = angular.copy(changes.users.currentValue.users);
            }
        }

        takeAction (action, data) {
            let that = this;
            let invitation = {
                role: data.role,
                emailAddress: data.email,
            };
            switch (action) {
            case 'delete':
                this.networkService.deleteUser(data)
                    .then(() => that.networkService.getUsers().then(response => that.users = response.users));
                break;
            case 'invite':
                this.networkService.inviteUser(invitation)
                    .then(() => that.toaster.pop({
                        type: 'success',
                        title: 'Email sent',
                        body: 'Email sent successfully to ' + data.email,
                    }));
                break;
            case 'refresh':
                this.networkService.getUsers().then(response => this.users = response.users);
                break;
            case 'reload':
                this.$state.reload();
                break;
                //no default
            }
        }
    },
}

angular.module('chpl.users')
    .component('chplUserManagement', UserManagementComponent);
