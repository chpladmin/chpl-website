const DevelopersJoinComponent = {
  template: `<chpl-developers-join-bridge
  id="$ctrl.id"
  ></chpl-developers-join-bridge>
`,
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
