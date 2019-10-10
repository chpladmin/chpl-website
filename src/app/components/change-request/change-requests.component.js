export const ChangeRequestsComponent = {
    templateUrl: 'chpl.components/change-request/change-requests.html',
    bindings: {
        changeRequests: '<',
        changeRequestStatusTypes: '<',
        developer: '<',
        takeAction: '&',
    },
    controller: class ChangeRequestsComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
            this.backup = {};
        }

        $onChanges (changes) {
            if (changes.changeRequests.currentValue) {
                this.displayedChangeRequests = undefined;
                this.changeRequests = angular.copy(changes.changeRequests.currentValue);
                this.backup.changeRequests = angular.copy(changes.changeRequests.currentValue);
                this.activeState = undefined;
                this.activeChangeRequest = undefined;
                this.activity = undefined;
            }
            if (changes.changeRequestStatusTypes && changes.changeRequestStatusTypes.currentValue) {
                this.changeRequestStatusTypes = angular.copy(changes.changeRequestStatusTypes.currentValue);
            }
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
        }

        act (action, data) {
            switch (action) {
            case 'cancel':
                if (this.activeState) {
                    this.activeState = undefined;
                    this.activeChangeRequest = this.backup.changeRequests.find(cr => cr.id === this.activeChangeRequest.id);
                } else {
                    this.activeChangeRequest = undefined;
                    this.changeRequests = angular.copy(this.backup.changeRequests);
                }
                this.activity = undefined;
                this.takeAction({action: 'cancel'});
                break;
            case 'fullCancel':
                this.activeChangeRequest = undefined;
                this.activeState = undefined;
                this.activity = undefined;
                this.takeAction({action: 'cancel'});
                break;
            case 'save':
                if (this.activeState === 'withdraw') {
                    this.activeChangeRequest.statuses.push({
                        changeRequestStatusType: this.changeRequestStatusTypes.data.find(crst => crst.name === 'Cancelled by Requester'),
                        comment: this.activeChangeRequest.comment,
                        statusChangeDate: new Date().getTime(),
                    });
                } else if (this.activeChangeRequest.currentStatus.name === 'Pending Developer Action') {
                    this.activeChangeRequest.statuses.push({
                        changeRequestStatusType: this.changeRequestStatusTypes.data.find(crst => crst.name === 'Pending ONC-ACB Action'),
                        comment: this.activeChangeRequest.comment,
                        statusChangeDate: new Date().getTime(),
                    });
                }
                this.takeAction({
                    action: 'save',
                    data: this.activeChangeRequest,
                });
                break;
            case 'edit':
                this.activeState = 'edit';
                this.activity = ' - Editing';
                this.takeAction({action: 'focus'});
                break;
            case 'statusLog':
                this.activeState = 'log';
                this.activity = ' - Status Log';
                this.takeAction({action: 'focus'});
                break;
            case 'withdraw':
                this.activeState = 'withdraw';
                this.activity = ' - Withdraw';
                this.takeAction({action: 'focus'});
                break;
            case 'update':
                this.activeChangeRequest = data;
                break;
                // no default
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplChangeRequests', ChangeRequestsComponent);
