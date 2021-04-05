export const FilterSurveillanceComponent = {
  templateUrl: 'chpl.components/products/filter-surveillance.html',
  bindings: {
    onChange: '&',
  },
  controller: class FilterSurveillanceComponent {
    constructor ($log) {
      'ngInject';
      this.$log = $log;
    }

    $onInit () {
      this.clearFilter(true);
    }

    clearFilter (initial) {
      this.filter = {
        compliance: undefined,
        matchAll: undefined,
        NC: {
          never: undefined,
          closed: undefined,
          open: undefined,
        },
      };
      if (!initial) {
        this.onChange({filter: {surveillance: this.filter}});
      }
    }

    getItemStateDisplay (item) {
      switch (item) {
      case 'neverSurveilled':
      case 'has-had':
        return this.isSelected(item) ? 'fa-check-circle-o' : 'fa-circle-o';
      case 'never':
      case 'open':
      case 'closed':
        return this.isSelected(item) ? 'fa-check-square-o' : 'fa-square-o';
        //no default
      }
    }

    getTitle () {
      if (
        this.filter.compliance
          || this.filter.NC.never
          || this.filter.NC.closed
          || this.filter.NC.open
      ) {
        return 'Surveillance: Filtered';
      }
      return 'Surveillance: Unfiltered';
    }

    isSelected (item) {
      switch (item) {
      case 'neverSurveilled':
        return this.filter.compliance === 'never';
      case 'has-had':
        return this.filter.compliance === 'has-had';
      case 'matchAll':
        return !!this.filter.matchAll;
      case 'never':
        return !!this.filter.NC.never;
      case 'open':
        return !!this.filter.NC.open;
      case 'closed':
        return !!this.filter.NC.closed;
        //no default
      }
    }

    selectedClass (item) {
      if (this.isSelected(item)) {
        return 'filter-multiple__item--selected';
      }
    }

    update (item) {
      switch (item) {
      case 'neverSurveilled':
        this.filter.compliance = this.filter.compliance !== 'never' ? 'never' : undefined;
        break;
      case 'has-had':
        this.filter.compliance = this.filter.compliance !== 'has-had' ? 'has-had' : undefined;
        break;
      case 'matchAll':
        this.filter.matchAll = !this.filter.matchAll;
        break;
      case 'never':
      case 'open':
      case 'closed':
        this.filter.NC[item] = !this.filter.NC[item];
        break;
        //no default
      }
      this.onChange({filter: {surveillance: this.filter}});
    }
  },
};

angular.module('chpl.components')
  .component('chplFilterSurveillance', FilterSurveillanceComponent);
