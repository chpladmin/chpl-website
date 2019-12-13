export const ChangeRequestsComponent = {
    templateUrl: 'chpl.components/change-request/change-requests.html',
    bindings: {
        administrationMode: '<',
        changeRequests: '<',
        changeRequestStatusTypes: '<',
        developer: '<',
        takeAction: '&',
    },
    controller: class ChangeRequestsComponent {
        constructor ($filter, $log, authService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.backup = {};
            this.filename = 'Reports_' + $filter('date')(new Date(), 'yyyy-MM-dd_HH-mm-ss') + '.csv';
            this.filterItems = {
                pageSize: 3,
            };
            this.isValid = true;
        }

        $onChanges (changes) {
            if (changes.administrationMode && changes.administrationMode.currentValue) {
                this.filterItems.pageSize = 10;
            }
            if (changes.changeRequests && changes.changeRequests.currentValue) {
                this.displayedChangeRequests = undefined;
                this.changeRequests = changes.changeRequests.currentValue.map(cr => {
                    cr.developerName = cr.developer.name;
                    cr.requestType = cr.changeRequestType.name;
                    cr.requestStatus = cr.currentStatus.changeRequestStatusType.name;
                    cr.changeDate = cr.currentStatus.statusChangeDate;
                    cr.friendlyCreationDate = this.$filter('date')(new Date(cr.submittedDate), 'yyyy-MM-dd HH:mm:ss Z', 'UTC');
                    cr.friendlyChangeDate = this.$filter('date')(new Date(cr.changeDate), 'yyyy-MM-dd HH:mm:ss Z', 'UTC');
                    return cr;
                });
                this.backup.changeRequests = angular.copy(this.changeRequests);
                this.activeState = undefined;
                this.activeChangeRequest = undefined;
                this.activity = 'Tracking';
            }
            if (changes.changeRequestStatusTypes && changes.changeRequestStatusTypes.currentValue) {
                this.changeRequestStatusTypes = angular.copy(changes.changeRequestStatusTypes.currentValue);
                this.filterItems.statusItems = this.changeRequestStatusTypes.data.map(crst => ({value: crst.name, selected: true}));
            }
            if (changes.developer && changes.developer.currentValue) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
        }

        act (action, data) {
            switch (action) {
            case 'cancel':
                this.cancel();
                break;
            case 'fullCancel':
                this.fullyCancel();
                break;
            case 'save':
                this.saveChangeRequest();
                break;
            case 'edit':
                this.startEditing();
                break;
            case 'statusLog':
                this.viewStatusLog();
                break;
            case 'withdraw':
                this.setUpToWithdrawChangeRequest();
                break;
            case 'update':
                this.processChangeRequestUpdate(data);
                break;
                // no default
            }
        }

        cancel () {
            if (this.activeState) {
                this.activeState = undefined;
                this.activeChangeRequest = this.backup.changeRequests.find(cr => cr.id === this.activeChangeRequest.id);
            } else {
                this.activeChangeRequest = undefined;
                this.changeRequests = angular.copy(this.backup.changeRequests);
            }
            this.activity = 'Tracking';
            this.takeAction({action: 'cancel'});
        }

        fullyCancel () {
            this.activeChangeRequest = undefined;
            this.activeState = undefined;
            this.activity = 'Tracking';
            this.takeAction({action: 'cancel'});
        }

        saveChangeRequest () {
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
        }

        startEditing () {
            this.activeState = 'edit';
            this.activity = 'Editing - Change Request | Submitted on ' + this.$filter('date')(this.activeChangeRequest.submittedDate, 'mediumDate', 'UTC');
            this.takeAction({action: 'focus'});
        }

        viewStatusLog () {
            this.activeState = 'log';
            this.activity = 'Status Log - Change Request | Submitted on ' + this.$filter('date')(this.activeChangeRequest.submittedDate, 'mediumDate', 'UTC');
            this.takeAction({action: 'focus'});
        }

        setUpToWithdrawChangeRequest () {
            this.activeState = 'withdraw';
            this.activity = 'Withdraw - Change Request | Submitted on ' + this.$filter('date')(this.activeChangeRequest.submittedDate, 'mediumDate', 'UTC');
            this.takeAction({action: 'focus'});
        }

        processChangeRequestUpdate (data) {
            this.activeChangeRequest = data.changeRequest;
            this.isValid = data.validity;
        }
    },
}

angular.module('chpl.components')
    .component('chplChangeRequests', ChangeRequestsComponent);
