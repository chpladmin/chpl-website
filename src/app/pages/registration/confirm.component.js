export const ConfirmUserComponent = {
    templateUrl: 'chpl.registration/confirm-user.html',
    bindings: {
        hash: '<',
    },
    controller: class ConfirmUserComponent {
        constructor ($log, featureFlags, networkService) {
            'ngInject'
            this.$log = $log;
            this.isOn = featureFlags.isOn;
            this.networkService = networkService;
            this.message = {value: '', success: null};
        }

        $onChanges (changes) {
            if (changes.hash.currentValue) {
                this.hash = changes.hash.currentValue;
                this.userDetails = this.hash;
                this.confirmUser();
            }
        }

        confirmUser () {
            this.networkService.confirmUser(this.userDetails)
                .then(() => {
                    this.message.value = 'Thank you for confirming your account. You may now log in.';
                    this.message.success = true;
                }, error => {
                    this.message.value = error.data.error;
                    this.message.success = false;
                });
        }
    },
}

angular.module('chpl.registration')
    .component('chplRegistrationConfirmUser', ConfirmUserComponent);
