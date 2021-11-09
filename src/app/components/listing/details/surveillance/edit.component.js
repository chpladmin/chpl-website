const SurveillanceEditComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/edit.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller: class SurveillanceEditController {
    constructor($log, $uibModal, authService, networkService, toaster, utilService) {
      'ngInject';

      this.$log = $log;
      this.$uibModal = $uibModal;
      this.authService = authService;
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
      this.toaster = toaster;
      this.utilService = utilService;
      this.sortRequirements = utilService.sortRequirements;
    }

    $onInit() {
      this.surveillance = angular.copy(this.resolve.surveillance);
      this.workType = this.resolve.workType;
      this.data = angular.copy(this.resolve.surveillanceTypes);

      this.showFormErrors = false;
      if (this.hasAnyRole(['ROLE_ACB'])) {
        this.authority = 'ROLE_ACB';
      }
      if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
        this.authority = 'ROLE_ONC';
      }
      if (this.workType === 'initiate') {
        this.surveillance.authority = this.authority;
      }
      this.disableValidation = this.surveillance.errorMessages && this.surveillance.errorMessages.length > 0;
      if (this.surveillance.type) {
        this.surveillance.type = this.utilService.findModel(this.surveillance.type, this.data.surveillanceTypes.data, 'name');
      }
    }

    addRequirement() {
      const data = angular.copy(this.data);
      if (this.hasAnyRole(['ROLE_ACB'])) {
        data.surveillanceRequirements.criteriaOptions = data.surveillanceRequirements.criteriaOptions.filter((option) => !option.removed);
      }
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
        this.surveillance.requirements.push(response);
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
        this.getAssociatedComplaints().then((complaints) => {
          let complaintsString;
          if (Array.isArray(complaints) && complaints.length > 0) {
            complaintsString = complaints.map((complaint) => complaint.acbComplaintId).join(', ');
          }

          that.networkService.deleteSurveillance(that.surveillance.id, that.reason)
            .then((response) => {
              if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                if (complaintsString) {
                  that.toaster.pop({
                    type: 'success',
                    body: `Surveillance has been removed from the following complaints: ${complaintsString}`,
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

    getAssociatedComplaints() {
      const that = this;
      const complaintsPromise = new Promise((resolve) => {
        const complaints = [];
        this.networkService.getComplaints().then((response) => {
          if (Array.isArray(response.results)) {
            response.results.forEach((complaint) => {
              if (Array.isArray(complaint.surveillances)) {
                for (const complaintSurveillance of complaint.surveillances) {
                  if (complaintSurveillance.surveillance.id === that.surveillance.id) {
                    complaints.push(complaint);
                    break;
                  }
                }
              }
            });
          }
          resolve(complaints);
        });
      });
      return complaintsPromise;
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
          this.surveillance.requirements.push(response);
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

    missingEndDay() {
      let noNcs = true;
      let allClosed = true;
      if (this.surveillance.requirements) {
        for (let i = 0; i < this.surveillance.requirements.length; i += 1) {
          noNcs = noNcs && (!this.surveillance.requirements[i].nonconformities || this.surveillance.requirements[i].nonconformities.length === 0);
          for (let j = 0; j < this.surveillance.requirements[i].nonconformities.length; j += 1) {
            allClosed = allClosed && (this.surveillance.requirements[i].nonconformities[j].status.name === 'Closed');
          }
        }
      }
      return this.surveillance.requirements && (noNcs || allClosed) && !this.surveillance.endDay;
    }

    save() {
      if (this.workType === 'confirm') {
        this.close({ $value: this.surveillance });
      } else if (this.workType === 'initiate') {
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

    isRequirementRemoved(name) {
      let requirement = this.data.surveillanceRequirements.realWorldTestingOptions.find((req) => req.item === name);
      if (requirement) {
        return requirement.removed;
      }
      requirement = this.data.surveillanceRequirements.transparencyOptions.find((req) => req.item === name);
      if (requirement) {
        return requirement.removed;
      }
      return false;
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillanceEdit', SurveillanceEditComponent);

export default SurveillanceEditComponent;
