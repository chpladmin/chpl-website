const DevelopersMergeComponent = {
  templateUrl: 'chpl.organizations/developers/developer/merge.html',
  bindings: {
    developer: '<',
    developers: '<',
  },
  controller: class DevelopersMergeController {
    constructor($log, $state, authService, networkService, toaster) {
      'ngInject';

      this.$log = $log;
      this.$state = $state;
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
      this.toaster = toaster;
      this.handleDispatch = this.handleDispatch.bind(this);
    }

    $onChanges(changes) {
      if (changes.developer && changes.developer.currentValue) {
        this.developer = angular.copy(changes.developer.currentValue);
      }
      if (changes.developers && changes.developers.currentValue) {
        this.developers = changes.developers.currentValue.developers
          .filter((d) => !d.deleted)
          .map((d) => ({
            ...d,
            selected: false,
          }))
          .sort((a, b) => (a.name < b.name ? -1 : 1));
      }
      if (this.developer && this.developers) {
        this.developers = this.developers.filter((d) => d.id !== this.developer.id);
      }
    }

    cancel() {
      this.$state.go('organizations.developers.developer', {
        id: this.developer.id,
      }, {
        reload: true,
      });
    }

    handleDispatch(action, data) {
      switch (action) {
        case 'cancel':
          this.cancel();
          break;
        case 'save':
          this.merge(data);
          break;
          // no default
      }
    }

    merge(developer) {
      const mergeDeveloperObject = {
        developer,
        developerIds: this.selectedDevelopers.map((d) => d.id),
      };
      mergeDeveloperObject.developerIds.push(this.developer.id);
      this.errorMessages = [];
      const that = this;
      this.networkService.mergeDevelopers(mergeDeveloperObject)
        .then((response) => {
          if (!response.status || response.status === 200) {
            that.toaster.pop({
              type: 'success',
              title: 'Merge submitted',
              body: `Your action has been submitted and you'll get an email at ${response.job.jobDataMap.user.email} when it's done`,
            });
            that.$state.go('organizations.developers', {}, {
              reload: true,
            });
          }
        }, (error) => {
          that.errorMessages = error.data.errorMessages;
        });
    }

    selectDeveloper(developer) {
      this.developers
        .filter((d) => d.id === developer.id)
        .forEach((d) => d.selected = !d.selected);
      this.selectedDevelopers = this.developers
        .filter((d) => d.selected)
        .sort((a, b) => (a.name < b.name ? -1 : 1));
      this.selectedToMerge = null;
    }
  },
};

angular
  .module('chpl.organizations')
  .component('chplDevelopersMerge', DevelopersMergeComponent);

export default DevelopersMergeComponent;
