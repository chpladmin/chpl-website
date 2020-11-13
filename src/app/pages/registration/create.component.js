var zxcvbn = require('zxcvbn');
window.zxcvbn = zxcvbn;

export const CreateUserComponent = {
    templateUrl: 'chpl.registration/create-user.html',
    bindings: {
        hash: '<',
    },
    controller: class CreateUserComponent {
        constructor ($location, $log, authService, networkService, utilService) {
            'ngInject';
            this.$location = $location;
            this.$log = $log;
            this.authService = authService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.passwordClass = utilService.passwordClass;
            this.passwordTitle = utilService.passwordTitle;
            this.userDetails = {user: {}};
            this.authorizeDetails = {};
            this.message = {value: '', success: null};
            this.extras = ['chpl'];
            this.displayMode = 'SIGN-IN';
        }

        $onChanges (changes) {
            if (changes.hash.currentValue) {
                this.hash = changes.hash.currentValue;
                this.userDetails.hash = changes.hash.currentValue;
                this.authorizeDetails.hash = changes.hash.currentValue;
            }
            if (this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
                this.authorizeUser();
            }
        }

        authorizeUser () {
            if ((this.authorizeDetails.userName && this.authorizeDetails.password) || this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER']) && this.authorizeDetails.hash) {
                const username = this.authorizeDetails.userName || this.authService.getUsername();
                this.networkService.authorizeUser(this.authorizeDetails, username)
                    .then(() => {
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

        createUser () {
            if (this.validateUser()) {
                this.networkService.createInvitedUser(this.userDetails)
                    .then(() => {
                        this.message.value = 'Your account has been created. Please check your email to confirm your account';
                        this.userDetails = {user: {}};
                        this.changeDisplayMode('CREATE-ACCOUNT-SUCCESS');
                    }, error => {
                        if (error.data.errorMessages) {
                            this.message.value = error.data.errorMessages;
                        } else if (error.data.error) {
                            this.message.value = error.data.error;
                        }
                    });
            }
        }

        editContact (contact) {
            this.userDetails.user = Object.assign(this.userDetails.user, contact);
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

        misMatchPasswords () {
            return this.passwordStrength.password !== this.userDetails.user.passwordverify;
        }

        validateUser () {
            var valid = true;
            valid = valid && this.userDetails.hash && this.userDetails.hash.length > 0;
            valid = valid && this.userDetails.user.subjectName && this.userDetails.user.subjectName.length > 0;
            valid = valid && this.userDetails.user.password && this.userDetails.user.password.length > 0;
            valid = valid && this.userDetails.user.fullName && this.userDetails.user.fullName.length > 0;
            valid = valid && this.userDetails.user.email && this.userDetails.user.email.length > 0;
            valid = valid && this.userDetails.user.phoneNumber && this.userDetails.user.phoneNumber.length > 0;
            valid = valid && this.userDetails.user.password === this.userDetails.user.passwordverify;
            return valid;
        }

        setExtras () {
            let vals = ['chpl'];
            if (this.userDetails.user.subjectName) { vals.push(this.userDetails.user.subjectName); }
            if (this.userDetails.user.fullName) { vals.push(this.userDetails.user.fullName); }
            if (this.userDetails.user.friendlyName) { vals.push(this.userDetails.user.friendlyName); }
            if (this.userDetails.user.email) { vals.push(this.userDetails.user.email); }
            if (this.userDetails.user.phoneNumber) { vals.push(this.userDetails.user.phoneNumber); }
            this.extras = vals;
        }
    },
};

angular.module('chpl.registration')
    .component('chplRegistrationCreateUser', CreateUserComponent);
