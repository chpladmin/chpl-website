import { interpretRequirements } from 'services/surveillance.service';

const SurveillanceEditComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/edit.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller: class SurveillanceEditController {
    constructor($log, $uibModal, networkService, toaster) {
      'ngInject';

      this.$log = $log;
      this.$uibModal = $uibModal;
      this.networkService = networkService;
      this.toaster = toaster;
    }

    $onInit() {
      this.surveillance = {
        ...this.resolve.surveillance,
        requirements: this.resolve.surveillance.requirements ? interpretRequirements(this.resolve.surveillance.requirements) : [],
      };
      this.workType = this.resolve.workType;
      this.data = {
        ...this.resolve.surveillanceTypes,
        surveillanceRequirements: {
          data: this.resolve.surveillanceTypes.surveillanceRequirements.data
            .filter((req) => req.requirementGroupType.name !== 'Certified Capability'
              || req.certificationEdition.year === this.resolve.surveillance.certifiedProduct.edition
              || req.certificationEdition.year === this.resolve.surveillance.certifiedProduct.certificationEdition?.name),
        },
        nonconformityTypes: {
          data: this.resolve.surveillanceTypes.nonconformityTypes.data
            .filter((ncType) => ncType.certificationEdition === null
              || ncType.certificationEdition.year === this.resolve.surveillance.certifiedProduct.edition
              || ncType.certificationEdition.year === this.resolve.surveillance.certifiedProduct.certificationEdition?.name),
        },
      };

      this.showFormErrors = false;
      this.disableValidation = this.surveillance.errorMessages && this.surveillance.errorMessages.length > 0;
      if (this.surveillance.type) {
        this.surveillance.type = this.data.surveillanceTypes.data.find((type) => type.name === this.surveillance.type.name);
      }
    }

    addRequirement() {
      const data = angular.copy(this.data);
      this.modalInstance = this.$uibModal.open({
        component: 'aiSurveillanceRequirementEdit',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        resolve: {
          disableValidation: () => false,
          randomized: () => this.surveillance.type.name === 'Randomized',
          randomizedSitesUsed: () => this.surveillance.randomizedSitesUsed,
          requirement: () => ({ nonconformities: [] }),
          surveillanceId: () => this.surveillance.id,
          surveillanceTypes: () => data,
          workType: () => 'add',
        },
        size: 'lg',
      });
      this.modalInstance.result.then((response) => {
        if (!this.surveillance.requirements) {
          this.surveillance.requirements = [];
        }
        this.surveillance.requirements = interpretRequirements([
          ...this.surveillance.requirements,
          response,
        ]);
      }, (result) => {
        this.$log.info(result);
      });
    }

    cancel() {
      this.dismiss();
    }

    deleteRequirement(req) {
      for (let i = 0; i < this.surveillance.requirements.length; i += 1) {
        if (angular.equals(this.surveillance.requirements[i], req)) {
          this.surveillance.requirements.splice(i, 1);
        }
      }
    }

    deleteSurveillance() {
      const that = this;
      if (this.reason) {
        this.getAssociatedComplaintText(that.surveillance.id).then((complaintText) => {
          that.networkService.deleteSurveillance(that.surveillance.id, that.reason)
            .then((response) => {
              if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                if (complaintText) {
                  that.toaster.pop({
                    type: 'success',
                    body: `Surveillance has been removed from the following complaints: ${complaintText}`,
                  });
                }
                that.close({ $value: response });
              } else {
                that.errorMessages = [response];
              }
            }, (error) => {
              that.errorMessages = [error.data.error ? error.data.error : error.statusText];
            });
        });
      }
    }

    getAssociatedComplaintText(surveillanceId) {
      const complaintsTextPromise = new Promise((resolve) => {
        let complaintsText = "";
        const complaints = [];
        this.networkService.getComplaintsWithSurveillance(surveillanceId).then((response) => {
          if (response.recordCount > response.pageSize) {
              complaintsText = response.recordCount + ' complaints';
          } else if (Array.isArray(response.results)) {
            response.results.forEach((complaint) => {
                complaints.push(complaint);
            });
          }

          if (Array.isArray(complaints) && complaints.length > 0) {
            complaintsText = complaints.map((complaint) => complaint.acbComplaintId).join(', ');
          }
          resolve(complaintsText);
        });
      });
      return complaintsTextPromise;
    }

    editRequirement(req) {
      req.guiId = req.id ? req.id : (new Date()).getTime();
      this.modalInstance = this.$uibModal.open({
        component: 'aiSurveillanceRequirementEdit',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        resolve: {
          disableValidation: () => this.disableValidation,
          randomized: () => this.surveillance.type.name === 'Randomized',
          randomizedSitesUsed: () => this.surveillance.randomizedSitesUsed,
          requirement: () => req,
          surveillanceId: () => this.surveillance.id,
          surveillanceTypes: () => this.data,
          workType: () => this.workType,
        },
        size: 'lg',
      });
      this.modalInstance.result.then((response) => {
        let found = false;
        for (let i = 0; i < this.surveillance.requirements.length; i += 1) {
          if (this.surveillance.requirements[i].guiId === response.guiId) {
            this.surveillance.requirements[i] = response;
            found = true;
          }
        }
        if (!found) {
          this.surveillance.requirements = interpretRequirements([
            ...this.surveillance.requirements,
            response,
          ]);
        } else {
          this.surveillance.requirements = interpretRequirements(this.surveillance.requirements);
        }
      }, (result) => {
        this.$log.info(result);
      });
    }

    inspectNonconformities(noncons) {
      this.modalInstance = this.$uibModal.open({
        component: 'aiSurveillanceNonconformityInspect',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        resolve: {
          nonconformities: () => noncons,
          nonconformityTypes: () => this.data.nonconformityTypes,
        },
        size: 'lg',
      });
    }

    misorderedStartEndDays() {
      return this.surveillance.startDay > this.surveillance.endDay;
    }

    missingEndDay() {
      let noNcs = true;
      let allClosed = true;
      if (this.surveillance.requirements) {
        for (let i = 0; i < this.surveillance.requirements.length; i += 1) {
          noNcs = noNcs && (!this.surveillance.requirements[i].nonconformities || this.surveillance.requirements[i].nonconformities.length === 0);
          for (let j = 0; j < this.surveillance.requirements[i].nonconformities.length; j += 1) {
            allClosed = allClosed && (this.surveillance.requirements[i].nonconformities[j].nonconformityStatus === 'Closed');
          }
        }
      }
      return this.surveillance.requirements && (noNcs || allClosed) && !this.surveillance.endDay;
    }

    save() {
      if (this.workType === 'initiate') {
        this.surveillance.certifiedProduct.edition = this.surveillance.certifiedProduct.certificationEdition.name;
        this.networkService.initiateSurveillance(this.surveillance)
          .then((response) => {
            if (!response.status || response.status === 200 || angular.isObject(response.status)) {
              this.close({ $value: response });
            } else {
              this.errorMessages = [response];
            }
          }, (error) => {
            if (error.data.errorMessages && error.data.errorMessages.length > 0) {
              this.errorMessages = error.data.errorMessages;
            } else if (error.data.error) {
              this.errorMessages = [error.data.error];
            } else {
              this.errorMessages = [error.statusText];
            }
          });
      } else if (this.workType === 'edit') {
        this.networkService.updateSurveillance(this.surveillance)
          .then((response) => {
            if (!response.status || response.status === 200 || angular.isObject(response.status)) {
              this.close({ $value: response });
            } else {
              this.errorMessages = [response];
            }
          }, (error) => {
            if (error.data.errorMessages && error.data.errorMessages.length > 0) {
              this.errorMessages = error.data.errorMessages;
            } else if (error.data.error) {
              this.errorMessages = [error.data.error];
            } else {
              this.errorMessages = [error.statusText];
            }
          });
      }
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillanceEdit', SurveillanceEditComponent);

export default SurveillanceEditComponent;
