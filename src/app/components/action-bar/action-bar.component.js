export const ActionBarComponent = {
    templateUrl: 'chpl.components/action-bar/action-bar.html',
    bindings: {
        canAct: '&',
        errorMessages: '<',
        isDisabled: '<',
        isWizard: '@',
        takeAction: '&',
    },
    controller: class ActionBarComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.errorMessages && changes.errorMessages.currentValue) {
                this.errorMessages = changes.errorMessages.currentValue.map(e => e);
            }
        }

        act (action) {
            this.takeAction({
                action: action,
            });
        }

        can (action) {
            return this.canAct({
                action: action,
            });
        }
    },
};

angular.module('chpl.components')
    .component('chplActionBar', ActionBarComponent);
