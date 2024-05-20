const DevelopersEditComponent = {
  template: `<chpl-developer-edit-bridge
  developer="$ctrl.developer"
  ></chpl-developer-edit-bridge>
`,
  bindings: {
    developer: '<',
  },
  controller: class DevelopersEditComponent {
    constructor() {
    }

    $onChanges(changes) {
      if (changes.developer) {
        this.developer = angular.copy(changes.developer.currentValue);
      }
    }
  },
};

angular.module('chpl.organizations')
  .component('chplDevelopersEdit', DevelopersEditComponent);

export default DevelopersEditComponent;
