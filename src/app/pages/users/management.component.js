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
        this.users = angular.copy(changes.users.currentValue.users);
      }
    }

    handleRole() {
      this.roles = ['ROLE_ONC_STAFF'];
      if (this.hasAnyRole(['ROLE_ADMIN'])) {
        this.roles.push('ROLE_ADMIN');
      }
      if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
        this.roles.push('ROLE_CMS_STAFF');
        this.roles.push('ROLE_ONC');
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
        case 'invite':
          this.networkService.inviteUser({
            role: data.role,
            emailAddress: data.email,
          }).then(() => that.toaster.pop({
            type: 'success',
            title: 'Email sent',
            body: `Email sent successfully to ${data.email}`,
          }));
          break;
        case 'refresh':
          this.networkService.getUsers()
            .then((response) => {
              that.users = response.users;
            });
          break;
        case 'impersonate':
          if (this.hasAnyRole(['ROLE_DEVELOPER'])) {
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
