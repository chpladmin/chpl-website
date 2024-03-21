const SurveillanceReportRelevantSurveillanceComponent = {
  templateUrl: 'chpl.components/surveillance/reporting/relevant-surveillance.html',
  bindings: {
    surveillance: '<',
    surveillanceOutcomes: '<',
    surveillanceProcessTypes: '<',
    onCancel: '&',
    onSave: '&',
  },
  controller: class SurveillanceReportRelevantSurveillanceComponent {
    constructor($log, DateUtil, authService) {
      'ngInject';

      this.$log = $log;
      this.DateUtil = DateUtil;
      this.hasAnyRole = authService.hasAnyRole;
    }

    $onChanges(changes) {
      if (changes.surveillance) {
        this.surveillance = angular.copy(changes.surveillance.currentValue);
      }
      if (changes.surveillanceOutcomes) {
        this.surveillanceOutcomes = angular.copy(changes.surveillanceOutcomes.currentValue);
      }
      if (changes.surveillanceProcessTypes) {
        this.surveillanceProcessTypes = angular.copy(changes.surveillanceProcessTypes.currentValue);
      }
      if (this.surveillanceOutcomes) {
        this.surveillanceOutcomes.sort((a, b) => (a.name < b.name ? -1 : 1));
      }
      if (this.surveillanceProcessTypes) {
        this.surveillanceProcessTypes.sort((a, b) => (a.name < b.name ? -1 : 1));
      }
    }

    save() {
      this.onSave({ surveillance: this.surveillance });
    }

    cancel() {
      this.onCancel();
    }

    shouldShowOtherSurveillanceProcessTypesExplanation() {
      return this.surveillance.surveillanceProcessTypes?.some((spt) => spt.name === 'Other');
    }
  },
};

angular.module('chpl.components')
  .component('chplSurveillanceReportRelevantSurveillance', SurveillanceReportRelevantSurveillanceComponent);

export default SurveillanceReportRelevantSurveillanceComponent;
