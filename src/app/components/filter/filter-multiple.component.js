export const FilterMultipleComponent = {
  templateUrl: 'chpl.components/filter/filter-multiple.html',
  bindings: {
    items: '<',
    onChange: '&',
  },
  controller: class FilterMultipleComponent {
    constructor ($log) {
      'ngInject';
      this.$log = $log;
      this.title = 'Certification Status';
    }

    $onChanges (changes) {
      if (changes.items) {
        this.items = angular.copy(changes.items.currentValue);
      }
    }

    getCheckbox (item) {
      if (item === 'all') {
        let selected = this.howManySelected();
        if (selected === 0) {
          return 'fa-square-o';
        }
        if (selected === this.items.length) {
          return 'fa-check-square-o';
        }
        return 'fa-minus-square-o';
      }
      return item.selected ? 'fa-check-square-o' : 'fa-square-o';
    }

    getTitle () {
      let selected = this.howManySelected();
      if (selected === 0) {
        return 'None';
      }
      if (selected === this.items.length) {
        return 'All';
      }
      return selected + ' selected';
    }

    selectedClass (item) {
      if (item === 'all') {
        let selected = this.howManySelected();
        if (selected === this.items.length) {
          return 'filter-multiple__item--selected';
        }
      } else if (item.selected) {
        return 'filter-multiple__item--selected';
      }
    }

    update (item) {
      if (item === 'all') {
        let endState = this.howManySelected() !== this.items.length;
        this.items.forEach(i => i.selected = endState);
      } else {
        item.selected = !item.selected;
      }
      this.onChange({items: this.items});
    }

    howManySelected () {
      return this.items.reduce((acc, i) => i.selected ? acc + 1 : acc, 0);
    }
  },
};

angular.module('chpl.components')
  .component('chplFilterMultiple', FilterMultipleComponent);
