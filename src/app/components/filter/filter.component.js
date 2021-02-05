export const FilterComponent = {
  templateUrl: 'chpl.components/filter/filter.html',
  bindings: {
    title: '@',
    hasChanges: '<',
  },
  transclude: true,
  require: {
    filtersCtrl: '^chplFilters',
  },
  controller: class FilterComponent {
    constructor ($log) {
      'ngInject';
      this.$log = $log;
    }

    $onInit () {
      this.filtersCtrl.addFilter(this);
    }
  },
};

angular.module('chpl.components')
  .component('chplFilter', FilterComponent);
