import { sortRequirementDetailTypes } from 'services/surveillance.service';

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
      if (this.requirement.requirementDetailType) {
        this.requirementType = this.data.surveillanceRequirementTypes.data.find((req) => req.name === this.requirement.requirementDetailType.surveillanceRequirementType.name);
        this.updateRequirementOptions();
        this.requirementDetailType = this.requirementOptions.find((option) => option.id === this.requirement.requirementDetailType.id);
      }
      if (this.requirement.requirementDetailTypeOther) {
        this.requirementType = this.data.surveillanceRequirementTypes.data.find((req) => req.name === 'Other Requirement');
        this.requirementDetailOther = this.requirement.requirementDetailTypeOther;
      };
      if (this.requirement.result) {
        this.requirement.result = this.data.surveillanceResultTypes.data.find((type) => type.name === this.requirement.result.name);
      }
    }

    addNonconformity() {
      const data = angular.copy(this.data);
      if (this.hasAnyRole(['ROLE_ACB'])) {
        data.nonconformityTypes.data = data.nonconformityTypes.data.filter((option) => !option.removed);
      }
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
      if (this.requirementType.name !== 'Other Requirement') {
        this.requirement.requirementDetailType = this.requirementDetailType;
        this.requirement.requirementDetailTypeOther = undefined;
      } else {
        this.requirement.requirementDetailType = undefined;
        this.requirement.requirementDetailTypeOther = this.requirementDetailOther;
      }
      this.close({ $value: this.requirement });
    }

    updateRequirementOptions() {
      if (!this.requirementType) { return; }
      this.requirementOptions = this.data.surveillanceRequirements.data
        .filter((req) => req.surveillanceRequirementType.id === this.requirementType.id)
        .sort(sortRequirementDetailTypes)
        .map((req) => ({
          ...req,
          display: `${req.removed ? 'Removed | ' : ''}${req.number ? (req.number + ': ') : ''}${req.title}`,
        }));
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillanceRequirementEdit', SurveillanceRequirementEditComponent);

export default SurveillanceRequirementEditComponent;
