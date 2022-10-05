import { sortRequirements } from 'services/surveillance.service';

const getDisplay = (req) => {
  if (req.requirementDetailTypeOther) {
    return req.requirementDetailTypeOther;
  }
  return `${req.requirementDetailType.removed ? 'Removed | ' : ''} ${req.requirementDetailType.number ? (`${req.requirementDetailType.number}:`) : ''} ${req.requirementDetailType.title}`;
};

const SurveillanceInspectComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/inspect.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller: class SurveillanceInspectController {
    constructor($log, $uibModal, DateUtil, authService, networkService) {
      'ngInject';

      this.$log = $log;
      this.$uibModal = $uibModal;
      this.DateUtil = DateUtil;
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
    }

    $onInit() {
      this.surveillance = {
        ...this.resolve.surveillance,
        requirements: this.resolve.surveillance.requirements
          .sort(sortRequirements)
          .map((req) => ({
            ...req,
            display: getDisplay(req),
          })),
      };
      this.errorMessages = [];
      this.surveillanceTypes = this.networkService.getSurveillanceLookups();
    }

    cancel() {
      this.dismiss();
    }

    confirm() {
      this.networkService.confirmPendingSurveillance(this.surveillance)
        .then(() => {
          this.close({ $value: { status: 'confirmed' } });
        }, (error) => {
          if (error.data.contact) {
            this.close({
              $value: {
                contact: error.data.contact,
                objectId: error.data.objectId,
                status: 'resolved',
              },
            });
          } else if (error.data.errorMessages) {
            this.errorMessages = error.data.errorMessages;
          } else {
            this.errorMessages = [error.statusText];
          }
        });
    }

    editSurveillance() {
      if (this.hasAnyRole(['ROLE_ACB'])) {
        this.surveillanceTypes.nonconformityTypes.data = this.surveillanceTypes.nonconformityTypes.data.filter((option) => !option.removed);
      }
      this.editModalInstance = this.$uibModal.open({
        component: 'aiSurveillanceEdit',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          surveillance: () => this.surveillance,
          surveillanceTypes: () => this.surveillanceTypes,
          workType: () => 'confirm',
        },
      });
      this.editModalInstance.result.then((result) => {
        this.surveillance = result;
      }, (result) => {
        if (result !== 'cancelled') {
          this.$log.info('dismissed', result);
        }
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
        },
        size: 'lg',
      });
    }

    reject() {
      this.networkService.rejectPendingSurveillance(this.surveillance.id)
        .then(() => {
          this.close({ $value: { status: 'rejected' } });
        }, (error) => {
          if (error.data.contact) {
            this.close({
              $value: {
                contact: error.data.contact,
                objectId: error.data.objectId,
                status: 'resolved',
              },
            });
          } else {
            this.errorMessages = error.data.errorMessages;
          }
        });
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillanceInspect', SurveillanceInspectComponent);

export default SurveillanceInspectComponent;
