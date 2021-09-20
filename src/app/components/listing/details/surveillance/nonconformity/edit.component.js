const SurveillanceNonconformityEditComponent = {
  templateUrl: 'chpl.components/listing/details/surveillance/nonconformity/edit.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller: class SurveillanceNonconformityEditController {
    constructor($log, API, Upload, authService, networkService, utilService) {
      'ngInject';

      this.$log = $log;
      this.API = API;
      this.Upload = Upload;
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

      if (this.nonconformity.criterion) {
        this.nonconformityType = this.data.nonconformityTypes.data
          .find((t) => t.number === this.nonconformity.criterion.number && t.title === this.nonconformity.criterion.title);
      } else {
        this.nonconformityType = this.data.nonconformityTypes.data
          .find((t) => t.number === this.nonconformity.nonconformityType);
      }
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
      if (this.nonconformityType.title) {
        this.nonconformity.criterion = this.nonconformityType;
      }
      this.nonconformity.nonconformityType = this.nonconformityType.number;
      this.close({ $value: this.nonconformity });
    }

    upload() {
      if (this.file) {
        this.item.data = {
          file: this.file,
        };
        const that = this;
        this.uploadErrors = [];
        this.Upload.upload(this.item).then((response) => {
          that.nonconformity.documents.push({
            fileName: `${response.config.data.file.name} is pending`,
            fileType: response.config.data.file.type,
          });
          that.uploadMessage = `File "${response.config.data.file.name}" was uploaded successfully.`;
          that.uploadSuccess = true;
          that.file = undefined;
        }, (error) => {
          if (error.data.fileName) {
            that.uploadMessage = `File "${error.data.fileName}" was not uploaded successfully.`;
          } else if (error.config.data.file.name) {
            that.uploadMessage = `File "${error.config.data.file.name}" was not uploaded successfully.`;
          } else {
            that.uploadMessage = 'File was not uploaded successfully.';
          }
          if (error.data.error) {
            that.uploadErrors.push(error.data);
          } else if (error.data.errorMessages) {
            that.uploadErrors.push(error.data.errorMessages);
          }
          that.uploadSuccess = false;
          that.file = undefined;
        }, (event) => {
          that.progressPercentage = parseInt(100.0 * (event.loaded / event.total), 10);
          that.$log.info(`progress: ${that.progressPercentage}% ${event.config.data.file.name}`);
        });
      }
    }
  },
};

angular
  .module('chpl.components')
  .component('aiSurveillanceNonconformityEdit', SurveillanceNonconformityEditComponent);

export default SurveillanceNonconformityEditComponent;
