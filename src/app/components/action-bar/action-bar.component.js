export const ActionBarComponent = {
    templateUrl: 'chpl.components/action-bar/action-bar.html',
    bindings: {
        canDelete: '@',
        errorMessages: '<',
        isDisabled: '<',
        takeAction: '&',
        warningMessages: '<',
    },
    controller: class ActionBarComponent {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.errorMessages && changes.errorMessages.currentValue) {
                this.errorMessages = changes.errorMessages.currentValue
                    .map(m => m)
                    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            }
            if (changes.warningMessages && changes.warningMessages.currentValue) {
                this.warningMessages = changes.warningMessages.currentValue
                    .map(m => m)
                    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            }
        }

        cancel () {
            this.takeAction({
                action: 'cancel',
            });
        }

        delete () {
            this.takeAction({
                action: 'delete',
            });
        }

        mouseover () {
            this.takeAction({
                action: 'mouseover',
            });
        }

        save () {
            this.takeAction({
                action: 'save',
            });
        }

        updateAcknowledgement () {
            this.takeAction({
                action: 'updateAcknowledgement',
                data: this.acknowledgeWarnings,
            });
        }
    },
};

angular.module('chpl.components')
    .component('chplActionBar', ActionBarComponent);
