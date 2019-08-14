export const DashboardComponent = {
    templateUrl: 'chpl.dashboard/dashboard.html',
    bindings: {
        developerId: '<',
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

        $onInit () {
            let that = this;
            this.loggedIn = this.$scope.$on('loggedIn', () => that.loadData());
        }

        $onChanges (changes) {
            if (changes.developerId.currentValue) {
                this.developerId = changes.developerId.currentValue;
            }
            this.loadData();
        }

        $onDestroy () {
            this.loggedIn();
        }

        loadData () {
            let that = this;
            if (this.developerId) {
                this.networkService.getUsersAtDeveloper(this.developerId).then(response => that.users = response.users);
                this.networkService.getDeveloper(this.developerId).then(response => that.developer = response);
            }
        }

        takeAction (action, data) {
            let that = this;
            switch (action) {
            case 'delete':
                this.networkService.removeUserFromDeveloper(data)
                    .then(() => that.networkService.getUsersAtDeveloper(this.developerId).then(response => that.users = response.users));
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
                this.networkService.getUsersAtDeveloper(this.developerId)
                    .then(response => that.users = response.users);
                break;
            case 'impersonate':
                this.$state.reload();
                break;
                //no default
            }
        }
    },
}

angular.module('chpl.dashboard')
    .component('chplDashboard', DashboardComponent);
