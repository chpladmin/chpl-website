const ChangeRequestsManagementComponent = {
  templateUrl: 'chpl.administration/change-requests-management/change-requests-management.html',
  bindings: { },
  controller: class ChangeRequestsManagementComponent {
    constructor($log, $scope) {
      'ngInject';

      this.$log = $log;
      this.$scope = $scope;
    }
  },
};

angular.module('chpl.administration')
  .component('chplChangeRequestsManagement', ChangeRequestsManagementComponent);

export default ChangeRequestsManagementComponent;
