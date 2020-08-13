export const ActionBarComponent = {
    templateUrl: 'chpl.components/action-bar/action-bar.html',
    bindings: {
        errorMessages: '<',
        isDisabled: '<',
        takeAction: '&',
    },
    controller: class ActionBarComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.errorMessages && changes.errorMessages.currentValue) {
                this.errorMessages = changes.errorMessages.currentValue.map(e => e);
            }
        }

        cancel () {
            this.takeAction({
                action: 'cancel',
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
    },
}

angular.module('chpl.components')
    .component('chplActionBar', ActionBarComponent);
