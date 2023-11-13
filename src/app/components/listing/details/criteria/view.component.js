const CertificationCriteriaViewComponent = {
  templateUrl: 'chpl.components/listing/details/criteria/view.html',
  bindings: {
    accessibilityStandards: '<',
    cert: '<',
    hasIcs: '<',
    isConfirming: '<',
    isEditing: '<',
    onChange: '&',
    qmsStandards: '<',
    refreshSed: '&',
    resources: '<',
    viewAll: '<',
  },
  controller: class CertificationCriteriaViewController {
    constructor($analytics, $log, $uibModal, authService, utilService) {
      'ngInject';

      this.$analytics = $analytics;
      this.$log = $log;
      this.$uibModal = $uibModal;
      this.hasAnyRole = authService.hasAnyRole;
      this.utilService = utilService;
    }

    $onChanges(changes) {
      if (changes.cert) {
        this.cert = angular.copy(changes.cert.currentValue);
        if (this.cert.functionalitiesTested) {
          this.cert.functionalitiesTested = this.cert.functionalitiesTested.sort(this.utilService.sortFunctionalitiesTested);
        }
      }
      if (changes.resources) {
        this.resources = angular.copy(changes.resources.currentValue);
      }
    }

    canEdit() {
      return this.isEditing // in editing mode
        && (this.cert.success // can always remove success
            || !this.cert.criterion.removed // can always edit non-removed
            || this.cert.criterion.editable // can edit removed if within the year range
            || (!this.isConfirming && this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']))); // can only edit removed when given role & not confirming
    }

    editCert() {
      const backupCert = angular.copy(this.cert);
      const { cert } = this;
      const { hasIcs } = this;
      const { resources } = this;
      const { isConfirming } = this;
      this.editUibModalInstance = this.$uibModal.open({
        component: 'chplCertificationCriteriaEdit',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          cert: () => cert,
          hasIcs: () => hasIcs,
          isConfirming: () => isConfirming,
          resources: () => resources,
        },
      });
      this.editUibModalInstance.result.then((response) => {
        this.cert = response;
        this.onChange({ cert: this.cert });
        this.refreshSed();
      }, () => {
        this.cert = angular.copy(backupCert);
      });
    }

    hasPhantomData() {
      const ret = (this.cert.additionalSoftware && this.cert.additionalSoftware.length > 0)
                || (this.cert.apiDocumentation && this.cert.apiDocumentation.length > 0)
                || (this.cert.gap)
                || (this.cert.privacySecurityFramework && this.cert.privacySecurityFramework.length > 0)
                || (this.cert.sed)
                || (this.cert.testDataUsed && this.cert.testDataUsed.length > 0)
                || (this.cert.functionalitiesTested && this.cert.functionalitiesTested.length > 0)
                || (this.cert.testProcedures && this.cert.testProcedures.length > 0)
                || (this.cert.testStandards && this.cert.testStandards.length > 0)
                || (this.cert.testToolsUsed && this.cert.testToolsUsed.length > 0)
                || false;
      return ret;
    }

    showViewDetailsLink() {
      return this.cert.success
                || (!this.cert.success
                    && ((this.cert.g1Success !== null && this.cert.g1Success !== undefined)
                        || (this.cert.g2Success !== null && this.cert.g2Success !== undefined)));
    }

    showOptionalStandardsSection() {
      return this.cert.success && (
        (this.cert.optionalStandards?.length > 0)
          || (this.cert.testStandards?.length > 0 && this.cert.optionalStandards)
      );
    }

    toggleCriteria() {
      if (!this.showDetails) {
        const label = this.cert.criterion.number + (this.utilService.isCures(this.cert.criterion) ? ' (Cures Update)' : '');
        this.$analytics.eventTrack('Viewed criteria details', { category: 'Listing Details', label });
      }
      this.showDetails = !this.showDetails;
    }
  },
};

angular.module('chpl.components')
  .component('chplCertificationCriteria', CertificationCriteriaViewComponent);

export default CertificationCriteriaViewComponent;
