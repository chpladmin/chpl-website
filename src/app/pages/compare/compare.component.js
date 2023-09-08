const CompareComponent = {
  template: `<ui-view>
  <chpl-compare-page-bridge
    ids="$ctrl.compareIds"
    ></chpl-compare-page-bridge>
</ui-view>
`,
  controller: class CompareComponent {
    constructor($log, $stateParams) {
      'ngInject';

      this.$log = $log;
      this.$stateParams = $stateParams;
    }

    $onInit() {
      if (this.$stateParams.compareIds) {
        this.compareIds = this.$stateParams.compareIds.split('&');
      }
    }
  },
};

angular.module('chpl.compare')
  .component('chplCompare', CompareComponent);

export default CompareComponent;
