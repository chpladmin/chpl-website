export const ChangeRequestsManagementComponent = {
    templateUrl: 'chpl.administration/change-requests-management/change-requests-management.html',
    bindings: {
        changeRequests: '<',
        changeRequestStatusTypes: '<',
        changeRequestTypes: '<',
    },
    controller: class ChangeRequestsManagementComponent {
        constructor ($log, authService, networkService, toaster) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.toaster = toaster;
        }

        $onChanges (changes) {
            if (changes.changeRequests) {
                this.changeRequests = angular.copy(changes.changeRequests.currentValue);
            }
            if (changes.changeRequestStatusTypes) {
                this.changeRequestStatusTypes = angular.copy(changes.changeRequestStatusTypes.currentValue);
            }
            if (changes.changerequestTypes) {
                this.changerequestTypes = angular.copy(changes.changerequestTypes.currentValue);
            }
        }

        takeAction (action, data) {
            let that = this;
            switch (action) {
            case 'save':
                this.networkService.updateChangeRequest(data)
                    .then(() => {
                        that.networkService.getChangeRequests().then(response => {
                            that.changeRequests = response;
                            that.state = 'confirmation';
                            that.confirmationText = 'The update has been completed successfully.'
                        })
                    }, error => {
                        that.toaster.pop({
                            type: 'error',
                            title: 'Error in submission',
                            body: 'Message' + (error.data.errorMessages.length > 1 ? 's' : '') + ':<ul>' + error.data.errorMessages.map(e => '<li>' + e + '</li>').join('') + '</ul>',
                            bodyOutputType: 'trustedHtml',
                        });
                    });
                break;
                //no default
            }
        }
    },
}

angular.module('chpl.administration')
    .component('chplChangeRequestsManagement', ChangeRequestsManagementComponent);
