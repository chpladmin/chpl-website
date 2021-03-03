export const ComplaintsReporting = {
  templateUrl: 'chpl.surveillance/complaints/reporting.html',
  bindings: {
  },
  controller: class ComplaintsReporting {
    constructor ($log, authService) {
      'ngInject';
      this.$log = $log;
      this.hasAnyRole = authService.hasAnyRole;
    }

    $onInit () {
      this.displayAdd = this.hasAnyRole((['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']));
      this.displayDelete = this.hasAnyRole((['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']));
      this.displayEdit = this.hasAnyRole((['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']));
    }
  },
};

angular.module('chpl.surveillance')
  .component('chplComplaintsReporting', ComplaintsReporting);
