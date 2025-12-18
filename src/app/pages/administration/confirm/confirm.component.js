const ConfirmComponent = {
  template: `<ui-view>
  <chpl-confirm-bridge
    id="$ctrl.id"
    ></chpl-confirm-bridge>
</ui-view>
`,
  controller: class ConfirmComponent {
    constructor($log, $stateParams) {
      'ngInject';

      this.$log = $log;
      this.$stateParams = $stateParams;
    }

    $onInit() {
      if (this.$stateParams.id) {
        this.id = this.$stateParams.id;
      }
    }
  },
};

angular.module('chpl.administration')
  .component('chplConfirm', ConfirmComponent);

export default ConfirmComponent;
