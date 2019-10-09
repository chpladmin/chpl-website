export const ChangeRequestsComponent = {
    templateUrl: 'chpl.components/change-request/change-requests.html',
    bindings: {
        changeRequests: '<',
        takeAction: '&',
    },
    controller: class ChangeRequestsComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.changeRequests.currentValue) {
                this.changeRequests = angular.copy(changes.changeRequests.currentValue);
            }
        }

        act (action, data) {
            switch (action) {
            case 'cancel':
                if (this.activeState) {
                    this.activeState = undefined;
                } else {
                    this.activeChangeRequest = undefined;
                }
                this.takeAction({action: 'cancel'});
                this.activity = undefined;
                break;
            case 'fullCancel':
                this.activeChangeRequest = undefined;
                this.activeState = undefined;
                this.takeAction({action: 'cancel'});
                this.activity = undefined;
                break;
            case 'save':
                this.takeAction({
                    action: 'save',
                    data: data,
                });
                break;
            case 'edit':
                this.activeState = 'edit';
                this.takeAction({action: 'focus'});
                this.activity = ' - Editing';
                break;
            case 'statusLog':
                this.activeState = 'log';
                this.takeAction({action: 'focus'});
                this.activity = ' - Status Log';
                break;
            case 'withdraw':
                this.activeState = 'withdraw';
                this.takeAction({action: 'focus'});
                this.activity = ' - Withdraw';
                break;
                // no default
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplChangeRequests', ChangeRequestsComponent);
