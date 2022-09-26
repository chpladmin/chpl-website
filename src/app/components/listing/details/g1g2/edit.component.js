export const G1G2EditComponent = {
  templateUrl: 'chpl.components/listing/details/g1g2/edit.html',
  bindings: {
    measures: '<',
    resources: '<',
    onChange: '&',
  },
  controller: class G1G2EditComponent {
    constructor($log, ManageList, utilService) {
      'ngInject';
      this.$log = $log;
      this.ManageList = ManageList;
      this.util = utilService;
      this.allowedMeasures = [];
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
      if (changes.resources && changes.resources.currentValue) {
        this.allMeasures = changes.resources.currentValue.measures.data
          .map(m => {
            m.displayName = m.domain.name;
            if (m.removed) {
              m.displayName = 'Removed | ' + m.displayName;
            }
            m.displayCriteria = [... new Set(m.allowedCriteria.map(c => c.number))]
              .sort((a, b) => this.util.sortCert(a) - this.util.sortCert(b));
            return m;
          })
          .sort((a, b) => this.measureSort(a, b));
        this.allTests = [... new Set(
          changes.resources.currentValue.measures.data
            .map(m => m.abbreviation)
            .sort((a, b) => this.testSort(a, b))
        )];
        this.allTypes = changes.resources.currentValue.measureTypes.data
          .map(t => t)
          .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
      }
    }

    $onDestroy() {
      this.ManageList.cancel('measures');
    }

    cancelNewItem(type) {
      this.ManageList.cancel(type);
      this.allowedMeasures = [];
    }

    clearCriteria() {
      this.ManageList.newItem['measures'].criteria = {};
    }

    measureSort(a, b) {
      if (!a.measureType) {
        a = { measureType: 0, measure: a };
      }
      if (!b.measureType) {
        b = { measureType: 0, measure: b };
      }
      if (!a.measure.id || !b.measure.id) {
        return a.measure.id ? 1 : -1;
      }
      let getNum = test => parseInt(test.substring(2), 10);
      return a.measure.removed !== b.measure.removed ? (a.measure.removed ? 1 : -1) :
        a.measureType.name < b.measureType.name ? -1 : a.measureType.name > b.measureType.name ? 1 :
          getNum(a.measure.abbreviation) < getNum(b.measure.abbreviation) ? -1 : getNum(a.measure.abbreviation) > getNum(b.measure.abbreviation) ? 1 :
            a.measure.domain.name < b.measure.domain.name ? -1 : a.measure.domain.name > b.measure.domain.name ? 1 :
              a.measure.name < b.measure.name ? -1 : a.measure.name > b.measure.name ? 1 :
                0;
    }

    readyForAdd() {
      return this.ManageList.newItem['measures']
        && this.ManageList.newItem['measures'].selectedAbbreviation
        && this.ManageList.newItem['measures'].measure
        && this.ManageList.newItem['measures'].typeName
        && (!this.ManageList.newItem['measures'].measure.requiresCriteriaSelection
          || (this.ManageList.newItem['measures'].selectedCriteria
            && Object.keys(this.ManageList.newItem['measures'].selectedCriteria).filter(key => this.ManageList.newItem['measures'].selectedCriteria[key].selected).length > 0));
    }

    removeItem(item) {
      this.measures = this.measures
        .filter(m => !(m.id === item.id
          && m.measureType.name === item.measureType.name
          && m.measure.name === item.measure.name
          && m.displayCriteria === item.displayCriteria));
      this.update();
    }

    saveNewItem() {
      let type = 'measures';
      let create = object => ({
        measure: object.measure,
        measureType: object.type,
        associatedCriteria: object.criteria,
        displayCriteria: [... new Set(object.criteria.map(c => c.number))]
          .join('; '),
      });
      this.ManageList.newItem[type].type = this.allTypes.filter(t => t.name === this.ManageList.newItem[type].typeName)[0];
      if (this.ManageList.newItem[type].measure.requiresCriteriaSelection) {
        this.ManageList.newItem[type].criteria = this.ManageList.newItem[type].measure.allowedCriteria
          .filter(cc => this.ManageList.newItem[type].selectedCriteria[cc.number] && this.ManageList.newItem[type].selectedCriteria[cc.number].selected);
      } else {
        this.ManageList.newItem[type].criteria = this.ManageList.newItem[type].measure.allowedCriteria;
      }
      this.measures.push(this.ManageList.add(type, create));
      this.update();
    }

    testSort(first, second) {
      let a = parseInt(first.substring(2), 10);
      let b = parseInt(second.substring(2), 10);
      return a - b;
    }

    update() {
      this.onChange({ measures: this.measures });
    }

    updateAllowedMeasures() {
      this.allowedMeasures = this.allMeasures.filter(m => m.abbreviation === this.ManageList.newItem['measures'].selectedAbbreviation);
      this.clearCriteria();
    }
  },
};

angular
  .module('chpl.components')
  .component('chplG1g2Edit', G1G2EditComponent);
