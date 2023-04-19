const DevelopersJoinComponent = {
  templateUrl: 'chpl.organizations/developers/developer/join.html',
  bindings: {
  },
  controller: class DevelopersJoinComponent {
    constructor($stateParams) {
      'ngInject';

      this.$stateParams = $stateParams;
    }

    $onInit() {
      this.id = this.$stateParams.id;
    }
  },
};

angular
  .module('chpl.organizations')
  .component('chplDevelopersJoin', DevelopersJoinComponent);

export default DevelopersJoinComponent;
