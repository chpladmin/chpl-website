const CreateUserComponent = {
  template: '<chpl-register-user-bridge hash="$ctrl.hash"></chpl-register-user-bridge>',
  bindings: {
    hash: '<',
  },
  controller: class CreateUserComponent {
    constructor($log) {
      'ngInject';

      this.$log = $log;
    }

    $onChanges(changes) {
      if (changes.hash.currentValue) {
        this.hash = changes.hash.currentValue;
      }
    }
  },
};

angular.module('chpl.registration')
  .component('chplRegistrationCreateUser', CreateUserComponent);

export default CreateUserComponent;
