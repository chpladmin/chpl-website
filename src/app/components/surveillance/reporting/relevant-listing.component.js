const calculateCompletion = (surveillance) => {
  const updated = {
    ...surveillance,
    completed: Math.round((
      (surveillance.surveillanceOutcome ? 1 : 0)
        + (surveillance.surveillanceProcessType ? 1 : 0)
        + (surveillance.k1Reviewed ? 1 : 0)
        + (surveillance.groundsForInitiating ? 1 : 0)
        + (surveillance.nonconformityCauses ? 1 : 0)
        + (surveillance.nonconformityNature ? 1 : 0)
        + (surveillance.stepsToSurveil ? 1 : 0)
        + (surveillance.stepsToEngage ? 1 : 0)
        + (surveillance.additionalCostsEvaluation ? 1 : 0)
        + (surveillance.limitationsEvaluation ? 1 : 0)
        + (surveillance.nondisclosureEvaluation ? 1 : 0)
        + (surveillance.directionDeveloperResolution ? 1 : 0)
        + (surveillance.completedCapVerification ? 1 : 0)
    ) * 100 / 13), // eslint-disable-line no-mixed-operators
  };
  return updated;
};

const SurveillanceReportRelevantListingComponent = {
  templateUrl: 'chpl.components/surveillance/reporting/relevant-listing.html',
  bindings: {
    listing: '<',
    quarterlyReport: '<',
    surveillanceOutcomes: '<',
    surveillanceProcessTypes: '<',
    onCancel: '&',
  },
  controller: class SurveillanceReportRelevantListingComponent {
    constructor($log, $state, $stateParams, $uibModal, DateUtil, authService, networkService) {
      'ngInject';

      this.$log = $log;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$uibModal = $uibModal;
      this.DateUtil = DateUtil;
      this.networkService = networkService;
      this.hasAnyRole = authService.hasAnyRole;
    }

    $onInit() {
      this.surveillanceTypes = this.networkService.getSurveillanceLookups();
    }

    $onChanges(changes) {
      if (changes.listing) {
        this.listing = angular.copy(changes.listing.currentValue);
      }
      if (changes.quarterlyReport) {
        this.quarterlyReport = angular.copy(changes.quarterlyReport.currentValue);
      }
      if (changes.surveillanceOutcomes) {
        this.surveillanceOutcomes = angular.copy(changes.surveillanceOutcomes.currentValue);
      }
      if (changes.surveillanceProcessTypes) {
        this.surveillanceProcessTypes = angular.copy(changes.surveillanceProcessTypes.currentValue);
      }
      if (this.listing.surveillances) {
        this.surveillances = this.listing.surveillances.map((s) => calculateCompletion(s));
      }
    }

    cancelEdit() {
      this.activeSurveillance = undefined;
    }

    save(surveillance) {
      const that = this;
      this.networkService.updateRelevantSurveillance(this.quarterlyReport.id, surveillance).then(() => {
        const currentState = {
          relevantListing: that.listing.id,
        };
        that.$state.go(
          that.$state.current,
          { ...that.$stateParams, ...currentState },
          { reload: true },
        );
      });
    }

    displaySurveillance(relevantSurveillance) {
      if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ACB'])) {
        this.editSurveillance(relevantSurveillance);
      } else {
        this.viewSurveillance(relevantSurveillance);
      }
    }

    viewSurveillance(relevantSurveillance) {
      const that = this;
      this.fixRequirementOptions();
      this.networkService.getListing(this.listing.id, true).then((listing) => {
        const surveillance = listing.surveillance.find((s) => s.id === relevantSurveillance.id);
        that.$uibModal.open({
          component: that.hasAnyRole(['ROLE_ADMIN', 'ROLE_ACB']) ? 'aiSurveillanceEdit' : 'chplSurveillanceViewContainerComponent',
          animation: false,
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          resolve: {
            surveillance: () => surveillance,
            surveillanceRequirements: () => that.surveillanceTypes.surveillanceRequirements,
            nonconformityTypes: () => that.surveillanceTypes.nonconformityTypes.data,
          },
        });
      });
    }

    editSurveillance(relevantSurveillance) {
      const that = this;
      this.fixRequirementOptions();
      this.networkService.getListing(this.listing.id, true).then((listing) => {
        const surveillance = listing.surveillance.find((s) => s.id === relevantSurveillance.id);
        that.uibModalInstance = that.$uibModal.open({
          component: 'aiSurveillanceEdit',
          animation: false,
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          resolve: {
            surveillance: () => surveillance,
            surveillanceTypes: () => that.surveillanceTypes,
            workType: () => 'edit',
          },
        });
        that.uibModalInstance.result.then(() => {
          const currentState = {
            relevantListing: that.listing.id,
          };
          that.$state.go(
            that.$state.current,
            { ...that.$stateParams, ...currentState },
            { reload: true },
          );
        });
      });
    }

    fixRequirementOptions() {
      if (this.listing.edition === '2015' || this.listing.edition === '2015 Cures Update') {
        this.surveillanceTypes.surveillanceRequirements.criteriaOptions = this.surveillanceTypes.surveillanceRequirements.criteriaOptions2015;
      } else if (this.listing.edition === '2014') {
        this.surveillanceTypes.surveillanceRequirements.criteriaOptions = this.surveillanceTypes.surveillanceRequirements.criteriaOptions2014;
      }
    }

    cancel() {
      this.activeSurveillance = undefined;
      this.onCancel();
    }
  },
};

angular.module('chpl.components')
  .component('chplSurveillanceReportRelevantListing', SurveillanceReportRelevantListingComponent);

export { SurveillanceReportRelevantListingComponent, calculateCompletion };
