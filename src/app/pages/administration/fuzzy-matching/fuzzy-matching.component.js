const FuzzyMatchingComponent = {
  templateUrl: 'chpl.administration/fuzzy-matching/fuzzy-matching.html',
  bindings: {
    fuzzyTypes: '<',
  },
  controller: class FuzzyMatchingComponent {
    constructor($log, $scope, networkService) {
      'ngInject';

      this.$log = $log;
      this.$scope = $scope;
      this.networkService = networkService;
      this.takeAction = this.takeAction.bind(this);
    }

    $onChanges(changes) {
      if (changes.fuzzyTypes) {
        this.fuzzyTypes = changes.fuzzyTypes.currentValue.sort((a, b) => (a.fuzzyType < b.fuzzyType ? -1 : 1));
      }
    }

    takeAction(data, action) {
      const that = this;
      switch (action) {
        case 'edit':
          this.activeType = data;
          break;
        case 'cancel':
          this.activeType = undefined;
          break;
        case 'save':
          this.networkService.updateFuzzyType(data)
            .then(() => {
              that.networkService.getFuzzyTypes(true)
                .then((response) => { that.fuzzyTypes = response.sort((a, b) => (a.fuzzyType < b.fuzzyType ? -1 : 1)); });
              that.activeType = undefined;
            });
          break;
        // no default
      }
      this.$scope.$apply();
    }
  },
};

angular.module('chpl.administration')
  .component('chplFuzzyMatching', FuzzyMatchingComponent);

export default FuzzyMatchingComponent;
