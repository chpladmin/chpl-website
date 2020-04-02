export const DashboardComponent = {
    templateUrl: 'chpl.dashboard/dashboard.html',
    bindings: {
        changeRequests: '<',
        changeRequestTypes: '<',
        changeRequestStatusTypes: '<',
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
            if (changes.changeRequestTypes.currentValue) {
                this.changeRequestTypes = changes.changeRequestTypes.currentValue;
            }
            if (changes.changeRequestStatusTypes.currentValue) {
                this.changeRequestStatusTypes = changes.changeRequestStatusTypes.currentValue;
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
            switch (action) {
            case 'edit':
                this.state = 'focusDeveloper';
                break;
            case 'save':
                this.saveRequest(developer);
                break;
                //no default
            }
        }

        takeCrAction (action, data) {
            switch (action) {
            case 'cancel':
                this.state = undefined;
                break;
            case 'save':
                this.updateRequest(data);
                break;
            case 'focus':
                this.state = 'focusChangeRequest';
                break;
                //no default
            }
        }

        saveRequest (data) {
            let that = this;
            let request = {
                developer: this.developer,
                details: data,
            };
            this.networkService.submitChangeRequest(request)
                .then(that.handleResponse.bind(that), that.handleError.bind(that));
        }

        updateRequest (data) {
            let that = this;
            this.networkService.updateChangeRequest(data)
                .then(that.handleResponse.bind(that), that.handleError.bind(that));
        }

        handleResponse () {
            let that = this;
            this.networkService.getChangeRequests().then(response => that.changeRequests = response);
            this.state = 'confirmation';
            this.confirmationText = 'The submission has been completed successfully. It will be reviewed by an ONC-ACB or ONC. Once the submission has been approved, it will be displayed on the CHPL.'
        }

        handleError (error) {
            let messages;
            let type = 'error';
            let title = 'Error in submission';
            if (error && error.data && error.data.error && error.data.error === 'gov.healthit.chpl.exception.InvalidArgumentsException: No data was changed.') {
                messages = ['No data was changed'];
                type = 'info';
                title = 'Please check your input';
            } else {
                messages = error.data.errorMessages ? error.data.errorMessages : [];
            }
            let body = messages.length > 0 ? 'Message' + (messages.length > 1 ? 's' : '') + ':<ul>' + messages.map(e => '<li>' + e + '</li>').join('') + '</ul>'
                : 'An unexpected error occurred. Please try again or contact ONC for support';
            this.toaster.pop({
                type: type,
                title: title,
                body: body,
                bodyOutputType: 'trustedHtml',
            });
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
