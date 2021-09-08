const AdministrationComponent = {
  templateUrl: 'chpl.administration/administration.html',
  bindings: {
  },
  controller: class AdministrationComponent {
    constructor($log) {
      'ngInject';

      this.$log = $log;
    }
  },
};

angular.module('chpl.administration')
  .component('chplAdministration', AdministrationComponent);

export default AdministrationComponent;
