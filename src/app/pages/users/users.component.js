export const UsersComponent = {
    templateUrl: 'chpl.users/users.html',
    bindings: {
        users: '<',
    },
    controller: class UsersComponent {
        constructor ($log, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
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
                this.activeUser = undefined;
                break;
            case 'edit':
                this.activeUser = data;
                break;
            case 'save':
                this.networkService.updateUser(data)
                    .then(() => that.networkService.getUsers().then(response => that.users = response.users));
                this.activeUser = undefined;
                break;
            case 'cancel':
                this.activeUser = undefined;
                break;
            case 'impersonate':
                this.networkService.impersonateUser(data)
                    .then(token => {
                        that.authService.saveToken(token.token);
                        that.$rootScope.$broadcast('impersonating');
                    });
                break;
                //no default
            }
        }
    },
}

angular.module('chpl.users')
    .component('chplUsers', UsersComponent);
