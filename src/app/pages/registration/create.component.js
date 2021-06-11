var zxcvbn = require('zxcvbn');
window.zxcvbn = zxcvbn;

export const CreateUserComponent = {
  templateUrl: 'chpl.registration/create-user.html',
  bindings: {
    hash: '<',
  },
  controller: class CreateUserComponent {
    constructor ($analytics, $location, $log, authService, networkService) {
      'ngInject';
      this.$analytics = $analytics;
      this.$location = $location;
      this.$log = $log;
      this.authService = authService;
      this.networkService = networkService;
      this.authorizeDetails = {};
      this.message = {value: '', success: null};
      this.displayMode = 'SIGN-IN';
      this.displayMode = 'CREATE-ACCOUNT';
      this.handleDispatch = this.handleDispatch.bind(this);
    }

    $onChanges (changes) {
      if (changes.hash.currentValue) {
        this.hash = changes.hash.currentValue;
        this.authorizeDetails.hash = changes.hash.currentValue;
      }
      if (this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
        this.authorizeUser();
      }
    }

    authorizeUser () {
      if ((this.authorizeDetails.userName && this.authorizeDetails.password) || this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER']) && this.authorizeDetails.hash) {
        const userId = this.authorizeDetails.userName || this.authService.getUserId();
        this.networkService.authorizeUser(this.authorizeDetails, userId)
          .then(() => {
            this.$analytics.eventTrack('Log In To Your Account', { category: 'Authentication' });
            this.$location.path('/administration');
          }, error => {
            if (error.status === 401) {
              this.message.value = 'A user may not have more than one role, or your username / password are incorrect';
            } else {
              this.message.value = error.data.error;
            }
            this.authorizeDetails = {
              hash: this.hash,
            };
            this.authorizeUserForm.$setPristine();
            this.authorizeUserForm.$setUntouched();
            this.message.success = false;
          });
      }
    }

    changeDisplayMode (mode) {
      this.displayMode = mode;
    }

    handleDispatch(data) {
      const invitation = {
        hash: this.hash,
        user: data,
      }
      this.networkService.createInvitedUser(invitation)
        .then(() => {
          this.$analytics.eventTrack('Create Account', { category: 'Authentication' });
          this.message.value = 'Your account has been created. Please check your email to confirm your account';
          this.changeDisplayMode('CREATE-ACCOUNT-SUCCESS');
        }, error => {
          if (error.data.errorMessages) {
            this.message.value = error.data.errorMessages;
          } else if (error.data.error) {
            this.message.value = error.data.error;
          }
        });
    }

    isCreateAccountMode () {
      return this.displayMode === 'CREATE-ACCOUNT';
    }

    isCreateAccountSuccessMode () {
      return this.displayMode === 'CREATE-ACCOUNT-SUCCESS';
    }

    isSignInMode () {
      return this.displayMode === 'SIGN-IN';
    }
  },
};

angular.module('chpl.registration')
  .component('chplRegistrationCreateUser', CreateUserComponent);
