export const UserComponent = {
    templateUrl: 'chpl.components/user/user.html',
    bindings: {
        user: '<',
        onCancel: '&?',
        onSave: '&?',
        takeAction: '&',
    },
    controller: class ProductComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }

        $onChanges (changes) {
            if (changes.user) {
                this.user = angular.copy(changes.user.currentValue);
            }
        }

        /*
         * Initiate changes
         */
        edit () {
            this.takeAction({
                action: 'edit',
                userId: this.user.userId,
            });
        }

        /*
         * Resolve changes
         */
        save () {
            this.onSave({user: this.user});
        }

        cancel () {
            this.onCancel();
        }
    },
}

angular.module('chpl.components')
    .component('chplUser', UserComponent);
