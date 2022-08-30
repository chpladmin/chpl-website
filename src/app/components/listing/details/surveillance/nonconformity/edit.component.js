const SurveillanceNonconformityEditComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/nonconformity/edit.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller: class SurveillanceNonconformityEditController {
    constructor($log, API, authService, networkService, utilService) {
      'ngInject';

      this.$log = $log;
      this.API = API;
      this.networkService = networkService;
      this.utilService = utilService;
      this.sortNonconformityTypes = utilService.sortNonconformityTypes;
      this.item = {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
          'API-Key': authService.getApiKey(),
        },
      };
    }

    $onInit() {
      this.data = angular.copy(this.resolve.surveillanceTypes);
      this.disableValidation = this.resolve.disableValidation;
      this.nonconformity = angular.copy(this.resolve.nonconformity);
      this.randomized = this.resolve.randomized;
      this.randomizedSitesUsed = this.resolve.randomizedSitesUsed;
      this.requirementId = this.resolve.requirementId;
      this.showFormErrors = false;
      this.surveillanceId = this.resolve.surveillanceId;
      this.workType = this.resolve.workType;
      this.item.url = `${this.API}/surveillance/${this.surveillanceId}/nonconformity/${this.nonconformity.id}/document`;

      /*
      if (this.nonconformity.criterion) {
        this.nonconformityType = this.data.nonconformityTypes.data
          .find((t) => t.number === this.nonconformity.criterion.number && t.title === this.nonconformity.criterion.title);
      } else {
        this.nonconformityType = this.data.nonconformityTypes.data
          .find((t) => t.number === this.nonconformity.nonconformityType);
      }
      */
    }

    cancel() {
      this.dismiss();
    }

    deleteDoc(docId) {
      const that = this;
      this.networkService.deleteSurveillanceDocument(this.surveillanceId, docId)
        .then(() => {
          for (let i = 0; i < this.nonconformity.documents.length; i += 1) {
            if (this.nonconformity.documents[i].id === docId) {
              this.nonconformity.documents.splice(i, 1);
            }
          }
        }, (error) => {
          if (error.data.error) {
            that.deleteMessage = error.data.error;
          } else {
            that.deleteMessage = 'File was not removed successfully.';
          }
          that.deleteSuccess = false;
        });
    }

    save() {
      if (this.nonconformity.nonconformityCloseDay) {
        this.nonconformity.nonconformityStatus = 'Closed';
      } else {
        this.nonconformity.nonconformityStatus = 'Open';
      }
      /*
      if (this.nonconformityType.title) {
        this.nonconformity.criterion = this.nonconformityType;
      } else {
        this.nonconformity.criterion = undefined;
      }
      this.nonconformity.nonconformityType = this.nonconformityType.number;
      */
      this.close({ $value: this.nonconformity });
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillanceNonconformityEdit', SurveillanceNonconformityEditComponent);

export default SurveillanceNonconformityEditComponent;
