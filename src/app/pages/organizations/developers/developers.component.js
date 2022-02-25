const DevelopersComponent = {
  templateUrl: 'chpl.organizations/developers/developers.html',
  bindings: {
    developers: '<',
  },
  controller: class DevelopersComponent {
    constructor($log, $state, authService) {
      'ngInject';

      this.$log = $log;
      this.$state = $state;
      this.hasAnyRole = authService.hasAnyRole;
    }

    $onChanges(changes) {
      if (changes.developers) {
        this.developers = changes.developers.currentValue.developers.map((d) => d);
      }
    }

    loadDeveloper() {
      this.$state.go('organizations.developers.developer', {
        developerId: this.developerToLoad.developerId,
      });
    }
  },
};

angular.module('chpl.organizations')
  .component('chplDevelopers', DevelopersComponent);

export default DevelopersComponent;
