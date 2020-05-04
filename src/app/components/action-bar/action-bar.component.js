export const ActionBarComponent = {
    templateUrl: 'chpl.components/action-bar/action-bar.html',
    bindings: {
        isDisabled: '<',
        takeAction: '&',
    },
    controller: class ActionBarComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
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
