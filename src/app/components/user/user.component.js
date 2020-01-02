export const UserComponent = {
    templateUrl: 'chpl.components/user/user.html',
    bindings: {
        user: '<',
        isEditing: '<',
        takeAction: '&',
    },
    controller: class UserComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.canImpersonate = authService.canImpersonate;
        }

        $onChanges (changes) {
            if (changes.user) {
                this.user = angular.copy(changes.user.currentValue);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
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
                data: this.user.userId,
            });
        }

        edit () {
            this.takeAction({
                action: 'edit',
                data: this.user,
            });
        }

        impersonate () {
            this.takeAction({
                action: 'impersonate',
                data: this.user,
            });
        }

        save () {
            this.takeAction({
                action: 'save',
                data: this.user,
            });
        }
    },
}

angular.module('chpl.components')
    .component('chplUser', UserComponent);
