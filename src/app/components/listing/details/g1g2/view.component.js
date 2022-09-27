export const G1G2ViewComponent = {
  templateUrl: 'chpl.components/listing/details/g1g2/view.html',
  bindings: {
    measures: '<',
  },
  controller: class G1G2ViewComponent {
    constructor($log, utilService) {
      'ngInject';
      this.$log = $log;
      this.util = utilService;
    }

    $onChanges(changes) {
      if (changes.measures && changes.measures.currentValue) {
        this.measures = changes.measures.currentValue
          .map(m => {
            m.displayCriteria = [... new Set(m.associatedCriteria.map(c => c.number))]
              .sort((a, b) => this.util.sortCert(a) - this.util.sortCert(b))
              .join('; ');
            return m;
          })
          .sort((a, b) => this.measureSort(a, b));
      }
    }

    measureSort(a, b) {
      if (!a.measure.id || !b.measure.id) {
        return a.measure.id ? 1 : -1;
      }
      return a.measure.removed !== b.measure.removed ? (a.measure.removed ? 1 : -1) :
        a.measureType.name < b.measureType.name ? -1 : a.measureType.name > b.measureType.name ? 1 :
          a.measure.name < b.measure.name ? -1 : a.measure.name > b.measure.name ? 1 :
            a.measure.requiredTest < b.measure.requiredTest ? -1 : a.measure.requiredTest > b.measure.requiredTest ? 1 :
              0;
    }
  },
};

angular
  .module('chpl.components')
  .component('chplG1g2View', G1G2ViewComponent);
