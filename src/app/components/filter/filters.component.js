export const FiltersComponent = {
  templateUrl: 'chpl.components/filter/filters.html',
  bindings: {
    clearAllFilters: '&',
  },
  transclude: {
    header: '?chplFiltersHeader',
    body: '?chplFiltersBody',
  },
  controller: class FiltersComponent {
    constructor ($log, $transclude) {
      'ngInject';
      this.$log = $log;
      this.isSlotFilled = $transclude.isSlotFilled;
      this.filters = [];
    }

    select (filter) {
      this.filters.forEach(filter => {
        filter.selected = false;
      });
      filter.selected = true;
    }

    addFilter (filter) {
      if (this.filters.length === 0) {
        this.select(filter);
      }
      this.filters.push(filter);
    }
  },
};

angular.module('chpl.components')
  .component('chplFilters', FiltersComponent);
