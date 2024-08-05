const UserManagementComponent = {
  templateUrl: 'chpl.users/management.html',
  bindings: {
    users: '<',
  },
  controller: class UserManagementComponent {
    constructor($log, $scope, $state, authService, networkService, toaster) {
      'ngInject';

      this.$log = $log;
      this.$scope = $scope;
      this.$state = $state;
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
      this.toaster = toaster;
    }

    $onInit() {
      const that = this;
      const loggedIn = this.$scope.$on('loggedIn', that.handleRole());
      this.$scope.$on('$destroy', loggedIn);
      this.handleRole();
      this.takeAction = this.takeAction.bind(this);
    }

    $onChanges(changes) {
      if (changes.users.currentValue) {
        this.users = changes.users.currentValue.users
          .filter((user) => !['ROLE_ACB', 'ROLE_DEVELOPER', 'chpl-onc-acb', 'chpl-developer'].includes(user.role));
      }
    }

    handleRole() {
      this.roles = ['ROLE_ONC', 'ROLE_CMS_STAFF'];
      this.groupNames = ['chpl-onc', 'chpl-cms-staff'];
      if (this.hasAnyRole(['chpl-admin'])) {
        this.roles.push('ROLE_ADMIN');
        this.groupNames.push('chpl-admin');
      }
    }

    takeAction(action, data) {
      const that = this;
      switch (action) {
        case 'delete':
          this.networkService.deleteUser(data)
            .then(() => that.networkService.getUsers().then((response) => {
              that.users = response.users;
            }));
          break;
        case 'cognito-invite' :
          this.networkService.inviteCognitoUser({
            email: data.email,
            groupName: data.groupName,
          }).then(() => that.toaster.pop({
            type: 'success',
            title: 'Email sent',
            body: `Email sent successfully to ${data.email}`,
          })).catch((error) => that.toaster.pop({
            type: 'error',
            title: 'Email was not sent',
            body: error.data.error,
          }));
          break;
        case 'invite':
          this.networkService.inviteUser({
            role: data.role,
            emailAddress: data.email,
          }).then(() => that.toaster.pop({
            type: 'success',
            title: 'Email sent',
            body: `Email sent successfully to ${data.email}`,
          })).catch((error) => that.toaster.pop({
            type: 'error',
            title: 'Email was not sent',
            body: error.data.error,
          }));
          break;
        case 'refresh':
          this.networkService.getUsers()
            .then((response) => {
              that.users = response.users
                .filter((user) => !['ROLE_ACB', 'ROLE_DEVELOPER', 'chpl-onc-acb', 'chpl-developer'].includes(user.role));
            });
          break;
        case 'impersonate':
          if (this.hasAnyRole(['chpl-developer'])) {
            this.$state.go('dashboard');
          } else {
            this.$state.reload();
          }
          break;
          // no default
      }
    }
  },
};

angular.module('chpl.users')
  .component('chplUserManagement', UserManagementComponent);

export default UserManagementComponent;
