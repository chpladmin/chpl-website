export const UploadComponent = {
  templateUrl: 'chpl.administration/upload/upload.html',
  bindings: {
  },
  controller: class UploadComponent {
    constructor ($log, authService, featureFlags) {
      'ngInject';
      this.$log = $log;
      this.hasAnyRole = authService.hasAnyRole;
      this.isOn = featureFlags.isOn;
    }
  },
};

angular.module('chpl.administration')
  .component('chplUpload', UploadComponent);
