export const UserManagementComponent = {
    templateUrl: 'chpl.users/management.html',
    bindings: {
        users: '<',
    },
    controller: class UserManagementComponent {
        constructor ($log, $state, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
        }

        $onInit () {
            if (this.hasAnyRole() && !this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                this.$state.go('search');
            }
        }

        $onChanges (changes) {
            if (changes.users.currentValue) {
                this.users = angular.copy(changes.users.currentValue.users);
            }
        }

        takeAction (action, data) {
            let that = this;
            switch (action) {
            case 'delete':
                this.networkService.deleteUser(data)
                    .then(() => that.networkService.getUsers().then(response => that.users = response.users));
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
