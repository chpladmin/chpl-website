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
            this.filterItems = {
                pageSize: 3,
            };
        }

        $onChanges (changes) {
            if (changes.changeRequests.currentValue) {
                this.displayedChangeRequests = undefined;
                this.changeRequests = changes.changeRequests.currentValue.map(cr => {
                    cr.requestStatus = cr.currentStatus.changeRequestStatusType.name;
                    cr.changeDate = cr.currentStatus.statusChangeDate;
                    return cr;
                });
                this.backup.changeRequests = angular.copy(this.changeRequests);
                this.activeState = undefined;
                this.activeChangeRequest = undefined;
                this.activity = undefined;
            }
            if (changes.changeRequestStatusTypes && changes.changeRequestStatusTypes.currentValue) {
                this.changeRequestStatusTypes = angular.copy(changes.changeRequestStatusTypes.currentValue);
                this.filterItems.statusItems = this.changeRequestStatusTypes.data.map(crst => ({value: crst.name, selected: true}));
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
                    this.activeChangeRequest.currentStatus = {
                        changeRequestStatusType: this.changeRequestStatusTypes.data.find(crst => crst.name === 'Cancelled by Requester'),
                        comment: this.activeChangeRequest.comment,
                    };
                } else if (this.activeChangeRequest.currentStatus.changeRequestStatusType.name === 'Pending Developer Action') {
                    this.activeChangeRequest.currentStatus = {
                        changeRequestStatusType: this.changeRequestStatusTypes.data.find(crst => crst.name === 'Pending ONC-ACB Action'),
                        comment: this.activeChangeRequest.comment,
                    };
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
