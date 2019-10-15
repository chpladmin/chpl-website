export const DashboardComponent = {
    templateUrl: 'chpl.dashboard/dashboard.html',
    bindings: {
        changeRequests: '<',
        changeRequestStatusTypes: '<',
        changeRequestTypes: '<',
        developerId: '<',
    },
    controller: class DashboardComponent {
        constructor ($log, $scope, $state, authService, featureFlags, networkService, toaster) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.backup = {};
            this.hasAnyRole = authService.hasAnyRole;
            this.isOn = featureFlags.isOn;
            this.networkService = networkService;
            this.toaster = toaster;
            this.roles = ['ROLE_DEVELOPER'];
        }

        $onInit () {
            let that = this;
            this.loggedIn = this.$scope.$on('loggedIn', () => that.loadData());
        }

        $onChanges (changes) {
            if (changes.changeRequests.currentValue) {
                this.changeRequests = changes.changeRequests.currentValue;
            }
            if (changes.changeRequestStatusTypes.currentValue) {
                this.changeRequestStatusTypes = changes.changeRequestStatusTypes.currentValue;
            }
            if (changes.changeRequestTypes.currentValue) {
                this.changeRequestTypes = changes.changeRequestTypes.currentValue;
            }
            if (changes.developerId.currentValue) {
                this.developerId = changes.developerId.currentValue;
            }
            this.loadData();
        }

        $onDestroy () {
            this.loggedIn();
        }

        cancel () {
            this.state = undefined;
            this.developer = angular.copy(this.backup.developer);
        }

        inState (state) {
            switch (state) {
            case 'confirmation':
                return this.state === 'confirmation';
            case 'developer':
                return this.state === 'focusDeveloper' || this.state === undefined;
            case 'focusDeveloper':
                return this.state === 'focusDeveloper';
            case 'changeRequest':
                return this.state === 'focusChangeRequest' || this.state === undefined;
            case 'focusChangeRequest':
                return this.state === 'focusChangeRequest';
            case 'users':
                return this.state === 'focusUsers' || this.state === undefined;
                //no default
            }
        }

        loadData () {
            let that = this;
            if (this.developerId) {
                this.networkService.getUsersAtDeveloper(this.developerId).then(response => that.users = response.users);
                this.networkService.getDeveloper(this.developerId).then(response => {
                    that.developer = response;
                    that.backup.developer = angular.copy(response);
                });
            }
        }

        takeDeveloperAction (action, developer) {
            let that = this;
            let request = {
                developer: this.developer,
                submitted: false,
            };
            switch (action) {
            case 'edit':
                this.state = 'focusDeveloper';
                break;
            case 'save':
                if (developer.website !== this.developer.website) {
                    request.changeRequestType = this.changeRequestTypes.data.find(t => t.name === 'Website Change Request');
                    request.details = { website: developer.website };
                    request.submitted = true;
                    this.networkService.submitChangeRequest(request)
                        .then(() => {
                            that.networkService.getChangeRequests().then(response => that.changeRequests = response);
                            that.state = 'confirmation';
                        }, error => {
                            that.toaster.pop({
                                type: 'error',
                                title: 'Error in submission',
                                body: 'Message' + (error.data.errorMessages.length > 1 ? 's' : '') + ':<ul>' + error.data.errorMessages.map(e => '<li>' + e + '</li>').join('') + '</ul>',
                                bodyOutputType: 'trustedHtml',
                            });
                        });
                }
                if (!request.submitted) {
                    this.cancel();
                }
                break;
                //no default
            }
        }

        takeCrAction (action, data) {
            let that = this;
            switch (action) {
            case 'cancel':
                this.state = undefined;
                break;
            case 'save':
                this.networkService.updateChangeRequest(data)
                    .then(() => that.networkService.getChangeRequests().then(response => {
                        that.changeRequests = response;
                        that.state = 'confirmation';
                    }));
                break;
            case 'focus':
                this.state = 'focusChangeRequest';
                break;
                //no default
            }
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
                this.networkService.removeUserFromDeveloper(data, this.developerId)
                    .then(() => that.networkService.getUsersAtDeveloper(that.developerId).then(response => that.users = response.users));
                break;
            case 'invite':
                this.state = undefined;
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
                this.state = undefined;
                this.networkService.getUsersAtDeveloper(this.developerId)
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

angular.module('chpl.dashboard')
    .component('chplDashboard', DashboardComponent);
