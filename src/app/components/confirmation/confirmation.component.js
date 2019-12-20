export const ConfirmationComponent = {
    templateUrl: 'chpl.components/confirmation/confirmation.html',
    bindings: {
        takeAction: '&',
        text: '@',
    },
    controller: class ConfirmationComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        close () {
            this.takeAction({
                action: 'close',
            });
        }
    },
}

angular.module('chpl.components')
    .component('chplConfirmation', ConfirmationComponent);
