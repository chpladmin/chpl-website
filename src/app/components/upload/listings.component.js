export const UploadListingsComponent = {
  templateUrl: 'chpl.components/upload/listings.html',
  bindings: {
    onChange: '&',
  },
  controller: class UploadListingsComponent {
    constructor ($filter, $log, API, Upload, authService, networkService, toaster) {
      'ngInject';
      this.$filter = $filter;
      this.$log = $log;
      this.Upload = Upload;
      this.networkService = networkService;
      this.toaster = toaster;
      this.item = {
        url: API,
        headers: {
          Authorization: 'Bearer ' + authService.getToken(),
          'API-Key': authService.getApiKey(),
        },
      };
    }

    $onInit () {
      if (this.beta) {
        this.item.url += '/listings/upload';
      } else {
        this.item.url += '/certified_products/upload';
      }
    }

    upload () {
      let item = angular.copy(this.item);
      if (this.file) {
        item.data = {
          file: this.file,
        };
        let that = this;
        this.Upload.upload(item).then(response => {
          if (this.beta) {
            that.toaster.pop({
              type: 'success',
              title: 'Success',
              body: 'File "' + response.config.data.file.name + '" was uploaded successfully. ' + response.data.length + ' pending product' + (response.data.length > 1 ? 's are' : ' is') + ' ready for confirmation.',
            });
          } else {
            that.uploadMessage = 'File "' + response.config.data.file.name + '" was uploaded successfully. ' + response.data.pendingCertifiedProducts.length + ' pending products are ready for confirmation.';
          }
          if (response.headers.warning === '299 - "Deprecated upload template"') {
            that.uploadWarnings = ['The version of the upload file you used is still valid, but has been deprecated. It will be removed as a valid format in the future. A newer version of the upload file is available.'];
          }
          that.uploadErrors = [];
          that.uploadSuccess = true;
          that.file = undefined;
          that.onChange();
        }, response => {
          if (response.data.errorMessages
                        && response.data.errorMessages.length === 1
                        && response.data.errorMessages[0].startsWith('The header row in the uploaded file does not match')) {
            that.uploadMessage += ' The CSV header row does not match any of the headers in the system.';
            that.networkService.getUploadTemplateVersions().then(response => {
              if (response.data === null || response.data === undefined || response.data.length === 0) {
                that.uploadMessage += ' There are no available templates.';
              } else {
                that.uploadMessage += ' Available templates are: ';
                that.uploadErrors = response.data.map(item => {
                  let ret = item.name + ', available as of: '
                                        + that.$filter('date')(item.availableAsOf, 'mediumDate', 'UTC')
                                        + (item.deprecated ? ' (deprecated)' : ' (active)');
                  return ret;
                });
              }
            });
          } else {
            that.uploadErrors = response.data.errorMessages || response.data.error;
          }
          if (this.beta) {
            that.toaster.pop({
              type: 'error',
              title: 'Error',
              body: 'File "' + response.config.data.file.name + '" was not uploaded successfully. ' + that.uploadErrors,
            });
          } else {
            that.uploadMessage = 'File "' + response.config.data.file.name + '" was not uploaded successfully.';
          }
          that.uploadWarnings = [];
          that.uploadSuccess = false;
          that.file = undefined;
        }, event => {
          that.progressPercentage = parseInt(100.0 * event.loaded / event.total, 10);
          that.$log.info('progress: ' + that.progressPercentage + '% ' + event.config.data.file.name);
        });
      }
    }
  },
};

angular.module('chpl.components')
  .component('chplUploadListings', UploadListingsComponent);
