const DeveloperComponent = {
  template: `<div ui-view="view">
  <chpl-developer-page-bridge
    id="$ctrl.id"
    ></chpl-developer-page-bridge>
</div>
`,
  controller: class DeveloperComponent {
    constructor($log, $stateParams) {
      'ngInject';

      this.$stateParams = $stateParams;
    }

    $onInit() {
      if (this.$stateParams.id) {
        this.id = this.$stateParams.id;
      }
    }
  },
};

angular.module('chpl.organizations')
  .component('chplDeveloperPage', DeveloperComponent);

export default DeveloperComponent;
