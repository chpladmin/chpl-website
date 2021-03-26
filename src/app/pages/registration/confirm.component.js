export const ConfirmUserComponent = {
  templateUrl: 'chpl.registration/confirm-user.html',
  bindings: {
    hash: '<',
  },
  controller: class ConfirmUserComponent {
    constructor ($analytics, $log, featureFlags, networkService) {
      'ngInject';
      this.$analytics = $analytics;
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
      let that = this;
      this.networkService.confirmUser(this.userDetails)
        .then(() => {
          that.$analytics.eventTrack('Confirm User Account', { category: 'Authentication' });
          this.message.value = 'Thank you for confirming your account. You may now log in.';
          this.message.success = true;
        }, error => {
          this.message.value = error.data.error;
          this.message.success = false;
        });
    }
  },
};

angular.module('chpl.registration')
  .component('chplRegistrationConfirmUser', ConfirmUserComponent);
