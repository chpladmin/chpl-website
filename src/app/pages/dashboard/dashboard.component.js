export const DashboardComponent = {
    templateUrl: 'chpl.dashboard/dashboard.html',
    bindings: {
        developer: '<',
        users: '<',
    },
    controller: class DashboardComponent {
        constructor ($log, $scope, $state, authService, networkService, toaster) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.toaster = toaster;
            this.roles = ['ROLE_DEVELOPER'];
        }

        $onChanges (changes) {
            if (changes.developer.currentValue) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (changes.users.currentValue) {
                this.users = angular.copy(changes.users.currentValue.users);
            }
        }

        takeAction (action, data) {
            let that = this;
            switch (action) {
            case 'delete':
                this.networkService.removeUserFromDeveloper(data)
                    .then(() => that.networkService.getUsers().then(response => that.users = response.users));
                break;
            case 'invite':
                this.networkService.inviteUser({
                    role: data.role,
                    emailAddress: data.email,
                    permissionObjectId: this.developer.developerId,
                }).then(() => that.toaster.pop({
                    type: 'success',
                    title: 'Email sent',
                    body: 'Email sent successfully to ' + data.email,
                }));
                break;
            case 'refresh':
                this.networkService.getUsers()
                    .then(response => that.users = response.users);
                break;
            case 'reload':
                this.$state.reload();
                break;
                //no default
            }
        }
    },
}

angular.module('chpl.dashboard')
    .component('chplDashboard', DashboardComponent);
