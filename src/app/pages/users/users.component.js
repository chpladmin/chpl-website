export const UsersComponent = {
    templateUrl: 'chpl.users/users.html',
    bindings: {
        users: '<',
    },
    controller: class UsersComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }

        $onChanges (changes) {
            if (changes.users.currentValue) {
                this.users = angular.copy(changes.users.currentValue.users);
            }
        }
    },
}

angular.module('chpl.users')
    .component('chplUsers', UsersComponent);
