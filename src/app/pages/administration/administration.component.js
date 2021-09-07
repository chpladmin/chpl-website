const AdministrationComponent = {
  templateUrl: 'chpl.administration/administration.html',
  bindings: {
  },
  controller: class AdministrationComponent {
    constructor($log, $stateParams) {
      'ngInject';

      this.$log = $log;
      this.$stateParams = $stateParams;
    }

    $onInit() {
      if (this.$stateParams.token) {
        this.resetToken = this.$stateParams.token;
      }
    }
  },
};

angular.module('chpl.administration')
  .component('chplAdministration', AdministrationComponent);

export default AdministrationComponent;
