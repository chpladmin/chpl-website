export const UsersComponent = {
    templateUrl: 'chpl.components/user/users.html',
    bindings: {
        users: '<',
        roles: '<',
        takeAction: '&',
    },
    controller: class UsersComponent {
        constructor ($log, $rootScope, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$rootScope = $rootScope;
            this.authService = authService;
            this.canImpersonate = authService.canImpersonate;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.users.currentValue) {
                this.users = angular.copy(changes.users.currentValue);
            }
            if (changes.roles.currentValue) {
                this.roles = angular.copy(changes.roles.currentValue);
                if (this.roles && this.roles.length === 1) {
                    this.newRole = this.roles[0];
                }
            }
        }

        act (action, data) {
            let that = this;
            switch (action) {
            case 'delete':
                this.takeAction({action: 'delete', data: data});
                this.activeUser = undefined;
                break;
            case 'edit':
                this.activeUser = data;
                break;
            case 'save':
                this.networkService.updateUser(data)
                    .then(() => {
                        that.takeAction({action: 'refresh'});
                    });
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
                        that.takeAction({action: 'reload'});
                    });
                break;
                //no default
            }
        }

        inviteUser () {
            let invitation = {
                email: this.inviteEmail,
                role: this.newRole,
            };
            this.takeAction({action: 'invite', data: invitation});
            this.inviteEmail = undefined;
            if (this.roles && this.roles.length === 1) {
                this.newRole = this.roles[0];
            } else {
                this.newRole = undefined;
            }
            this.form.$setPristine();
            this.form.$setUntouched();
        }
    },
}

angular.module('chpl.components')
    .component('chplUsers', UsersComponent);
