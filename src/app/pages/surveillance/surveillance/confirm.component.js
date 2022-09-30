export const ConfirmSurveillanceComponent = {
  templateUrl: 'chpl.surveillance/surveillance/confirm.html',
  bindings: {
    onChange: '&',
  },
  controller: class ConfirmSurveillanceComponent {
    constructor ($log, $uibModal, DateUtil, authService, networkService) {
      'ngInject';
      this.$log = $log;
      this.$uibModal = $uibModal;
      this.DateUtil = DateUtil;
      this.networkService = networkService;
      this.hasAnyRole = authService.hasAnyRole;
      this.massReject = {};
    }

    $onInit () {
      let that = this;
      this.networkService.getUploadingSurveillances().then(surveillances => {
        that.uploadingSurveillances = surveillances.pendingSurveillance;
      });
    }

    getNumberOfSurveillanceToReject () {
      let ret = 0;
      angular.forEach(this.massRejectSurveillance, value => {
        if (value) {
          ret += 1;
        }
      });
      return ret;
    }

    clearPendingSurveillance (survId) {
      this.uploadingSurveillances = this.uploadingSurveillances.filter(s => s.id !== survId);
    }

    inspectSurveillance (surv) {
      let that = this;
      this.modalInstance = this.$uibModal.open({
        component: 'aiSurveillanceInspect',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        resolve: {
          surveillance: () => surv,
        },
        size: 'lg',
      });
      this.modalInstance.result.then(result => {
        if (result.status === 'confirmed' || result.status === 'rejected' || result.status === 'resolved') {
          for (var i = 0; i < that.uploadingSurveillances.length; i++) {
            if (surv.id === that.uploadingSurveillances[i].id) {
              that.uploadingSurveillances.splice(i,1);
              that.pendingSurveillances = that.uploadingSurveillances.length;
            }
          }
          if (result.status === 'resolved') {
            that.uploadingSurveillanceMessages = ['Surveillance with ID: "' + result.objectId + '" has already been resolved by "' + result.contact.fullName + '"'];
          }
        }
      });
    }

    massRejectPendingSurveillance () {
      let that = this;
      var idsToReject = [];
      angular.forEach(this.massRejectSurveillance, (value, key) => {
        if (value) {
          idsToReject.push(parseInt(key, 10));
          this.clearPendingSurveillance(parseInt(key, 10));
          delete(this.massRejectSurveillance[key]);
        }
      });
      this.networkService.massRejectPendingSurveillance(idsToReject)
        .then(() => {
          that.onChange();
        }, error => {
          that.onChange();
          if (error.data.errors && error.data.errors.length > 0) {
            that.uploadingSurveillanceMessages = error.data.errors.map(error => 'Surveillance with ID: "' + error.objectId + '" has already been resolved by "' + error.contact.fullName + '"');
          }
        });
    }

    parseSurveillanceUploadError (surv) {
      var ret = '';
      if (surv.errorMessages && surv.errorMessages.length > 0) {
        ret += 'Errors:&nbsp;' + surv.errorMessages.length;
      }
      if (surv.warningMessages && surv.warningMessages.length > 0) {
        if (ret.length > 0) {
          ret += '<br />';
        }
        ret += 'Warnings:&nbsp;' + surv.warningMessages.length;
      }
      if (ret.length === 0) {
        ret = 'OK';
      }
      return ret;
    }

    selectAllPendingSurveillance () {
      this.massRejectSurveillance = {};
      this.uploadingSurveillances.forEach(surv => {
        this.massRejectSurveillance[surv.id] = true;
      });
    }
  },
};

angular.module('chpl.surveillance')
  .component('chplConfirmSurveillance', ConfirmSurveillanceComponent);
