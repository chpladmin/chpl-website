import { sortRequirementTypes } from 'services/surveillance.service';

const SurveillanceRequirementEditComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/requirement/edit.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller: class SurveillanceRequirementEditController {
    constructor($log, $uibModal, authService) {
      'ngInject';

      this.$log = $log;
      this.$uibModal = $uibModal;
      this.hasAnyRole = authService.hasAnyRole;
    }

    $onInit() {
      this.data = angular.copy(this.resolve.surveillanceTypes);
      this.disableValidation = this.resolve.disableValidation;
      this.randomized = this.resolve.randomized;
      this.randomizedSitesUsed = this.resolve.randomizedSitesUsed;
      this.requirement = angular.copy(this.resolve.requirement);
      this.showFormErrors = false;
      this.surveillanceId = this.resolve.surveillanceId;
      this.workType = this.resolve.workType;
      if (this.requirement.requirementType) {
        this.requirementGroupType = this.data.requirementGroupTypes.data.find((req) => req.name === this.requirement.requirementType.requirementGroupType.name);
        this.updateRequirementOptions();
        this.requirementType = this.requirementOptions.find((option) => option.id === this.requirement.requirementType.id);
      }
      if (this.requirement.requirementTypeOther) {
        this.requirementGroupType = this.data.requirementGroupTypes.data.find((req) => req.name === 'Other Requirement');
        this.requirementTypeOther = this.requirement.requirementTypeOther;
      }
      if (this.requirement.result) {
        this.requirement.result = this.data.surveillanceResultTypes.data.find((type) => type.name === this.requirement.result.name);
      }
    }

    addNonconformity() {
      const data = angular.copy(this.data);
      this.modalInstance = this.$uibModal.open({
        component: 'aiSurveillanceNonconformityEdit',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        resolve: {
          disableValidation: () => false,
          nonconformity: () => ({}),
          randomized: () => this.randomized,
          randomizedSitesUsed: () => this.randomizedSitesUsed,
          requirementId: () => this.requirement.id,
          surveillanceId: () => this.surveillanceId,
          surveillanceTypes: () => data,
          workType: () => 'add',
        },
        size: 'lg',
      });
      this.modalInstance.result.then((response) => {
        if (!this.requirement.nonconformities) {
          this.requirement.nonconformities = [];
        }
        this.requirement.nonconformities.push(response);
      }, (result) => {
        this.$log.info(result);
      });
    }

    cancel() {
      this.dismiss();
    }

    deleteNonconformity(noncon) {
      for (let i = 0; i < this.requirement.nonconformities.length; i += 1) {
        if (angular.equals(this.requirement.nonconformities[i], noncon)) {
          this.requirement.nonconformities.splice(i, 1);
        }
      }
    }

    editNonconformity(noncon) {
      noncon.guiId = noncon.id ? noncon.id : (new Date()).getTime();
      this.modalInstance = this.$uibModal.open({
        component: 'aiSurveillanceNonconformityEdit',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        resolve: {
          disableValidation: () => this.disableValidation,
          nonconformity: () => noncon,
          randomized: () => this.randomized,
          randomizedSitesUsed: () => this.randomizedSitesUsed,
          requirementId: () => this.requirement.id,
          surveillanceId: () => this.surveillanceId,
          surveillanceTypes: () => this.data,
          workType: () => this.workType,
        },
        size: 'lg',
      });
      this.modalInstance.result.then((response) => {
        let found = false;
        for (let i = 0; i < this.requirement.nonconformities.length; i += 1) {
          if (this.requirement.nonconformities[i].guiId === response.guiId) {
            this.requirement.nonconformities[i] = response;
            found = true;
          }
        }
        if (!found) {
          this.requirement.nonconformities.push(response);
        }
      }, (result) => {
        this.$log.info(result);
      });
    }

    isNonconformityRequired() {
      return (this.requirement.result && this.requirement.result.name === 'Non-Conformity')
        && (!this.requirement.nonconformities || this.requirement.nonconformities.length === 0);
    }

    save() {
      if (this.requirement.result.name === 'No Non-Conformity') {
        this.requirement.nonconformities = [];
      }
      if (this.requirementGroupType.name !== 'Other Requirement') {
        this.requirement.requirementType = this.requirementType;
        this.requirement.requirementTypeOther = undefined;
      } else {
        this.requirement.requirementType = undefined;
        this.requirement.requirementTypeOther = this.requirementTypeOther;
      }
      this.close({ $value: this.requirement });
    }

    updateRequirementOptions() {
      if (!this.requirementGroupType) { return; }
      this.requirementOptions = this.data.surveillanceRequirements.data
        .filter((req) => req.requirementGroupType.id === this.requirementGroupType.id)
        .sort(sortRequirementTypes)
        .map((req) => ({
          ...req,
          display: `${req.removed ? 'Removed | ' : ''}${req.number ? (`${req.number}: `) : ''}${req.title}`,
        }));
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillanceRequirementEdit', SurveillanceRequirementEditComponent);

export default SurveillanceRequirementEditComponent;
