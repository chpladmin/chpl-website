const zxcvbn = require('zxcvbn');

window.zxcvbn = zxcvbn;

export const CreateUserComponent = {
  templateUrl: 'chpl.registration/create-user.html',
  bindings: {
    hash: '<',
  },
  controller: class CreateUserComponent {
    constructor($analytics, $state, $log, authService, networkService, toaster) {
      'ngInject';

      this.$analytics = $analytics;
      this.$state = $state;
      this.$log = $log;
      this.authService = authService;
      this.networkService = networkService;
      this.toaster = toaster;
      this.displayMode = 'SIGN-IN';
      this.handleDispatch = this.handleDispatch.bind(this);
    }

    $onChanges(changes) {
      if (changes.hash.currentValue) {
        this.hash = changes.hash.currentValue;
      }
      if (this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
        this.handleDispatch('authorize', {});
      }
    }

    changeDisplayMode(mode) {
      this.displayMode = mode;
    }

    handleDispatch(action, data) {
      switch (action) {
        case 'authorize':
          const authorization = {
            ...data,
            hash: this.hash,
          };
          const userId = data.email || this.authService.getUserId();
          this.networkService.authorizeUser(authorization, userId)
            .then(() => {
              this.$analytics.eventTrack('Log In To Your Account', { category: 'Authentication' });
              this.toaster.pop({
                type: 'success',
                title: 'Success',
                body: 'Your new permissions have been added',
              });
              this.$state.go('administration');
            }, (error) => {
              if (error.status === 401) {
                this.message = 'A user may not have more than one role, or your username / password are incorrect';
              } else {
                this.message = error.data.error;
              }
            });
          break;
        case 'create':
          const invitation = {
            hash: this.hash,
            user: data,
          };
          this.networkService.createInvitedUser(invitation)
            .then(() => {
              this.$analytics.eventTrack('Create Account', { category: 'Authentication' });
              this.message = 'Your account has been created. Please check your email to confirm your account';
              this.changeDisplayMode('CREATE-ACCOUNT-SUCCESS');
            }, (error) => {
              if (error.data.errorMessages) {
                this.message = error.data.errorMessages;
              } else if (error.data.error) {
                this.message = error.data.error;
              }
            });
          break;
          // no default
      }
    }

    isCreateAccountMode() {
      return this.displayMode === 'CREATE-ACCOUNT';
    }

    isCreateAccountSuccessMode() {
      return this.displayMode === 'CREATE-ACCOUNT-SUCCESS';
    }

    isSignInMode() {
      return this.displayMode === 'SIGN-IN';
    }
  },
};

angular.module('chpl.registration')
  .component('chplRegistrationCreateUser', CreateUserComponent);
