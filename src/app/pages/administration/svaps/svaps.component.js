export const SvapsComponent = {
  templateUrl: 'chpl.administration/svaps/svaps.html',
  bindings: {
    svaps: '<',
    availableCriteria: '<',
  },
  controller: class SvapsComponent {
    constructor ($log, networkService, toaster, utilService) {
      'ngInject';
      this.$log = $log;
      this.networkService = networkService;
      this.toaster = toaster;
      this.sortCerts = utilService.sortCert;
      this.isCures = utilService.isCures;
      this.takeActionBarAction = this.takeActionBarAction.bind(this);
    }

    $onChanges (changes) {
      if (changes.svaps) {
        this.svaps = angular.copy(changes.svaps.currentValue);
      }
      if (changes.availableCriteria) {
        this.availableCriteria = this.availableCriteria.filter(crit => crit.certificationEditionId === 3);
      }
    }

    addSvap () {
      this.svap = { criteria: [] };
      this.errors = [];
      this.isEditing = true;
    }

    cancel () {
      let that = this;
      this.svap = null;
      this.isEditing = false;
      this.networkService.getSvaps()
        .then(response => that.svaps = response);
    }

    delete () {
      let that = this;
      this.networkService.deleteSvap(this.svap)
        .then(() => {
          that.toaster.pop({
            type: 'success',
            body: 'SVAP was successfully deleted.',
          });
          that.cancel();
        }, error => {
          that.errors = error.data.errorMessages;
        });
    }

    editSvap (svap) {
      this.svap = svap;
      this.errors = [];
      this.isEditing = true;
    }

    getCriteriaForSelectableList () {
      if (this.svap && this.svap.criteria) {
        return this.availableCriteria.filter(crit => !this.svap.criteria.map(c => c.id).includes(crit.id));
      } else {
        return this.availableCriteria;
      }
    }

    save () {
      let that = this;
      if (this.svap.svapId) {
        this.networkService.updateSvap(this.svap)
          .then(() => {
            that.toaster.pop({
              type: 'success',
              body: 'SVAP was successfully updated.',
            });
            that.cancel();
          }, error => {
            that.errors = error.data.errorMessages;
          });
      } else {
        this.networkService.createSvap(this.svap)
          .then(() => {
            that.toaster.pop({
              type: 'success',
              body: 'SVAP was successfully added.',
            });
            that.cancel();
          }, error => {
            that.errors = error.data.errorMessages;
          });
      }
    }

    removeCriteriaFromSvap (criterion) {
      this.svap.criteria = this.svap.criteria.filter(crit => crit.id !== criterion.id);
    }

    selectCriteriaForSvap () {
      this.svap.criteria.push(angular.copy(this.selectedCriteria));
      this.selectedCriteria = null;
    }

    takeActionBarAction (action) {
      switch (action) {
      case 'cancel':
        this.cancel();
        break;
      case 'delete':
        this.delete();
        break;
      case 'mouseover':
        this.showFormErrors = true;
        break;
      case 'save':
        this.save();
        break;
      //no default
      }
    }
  },
};

angular.module('chpl.administration')
  .component('chplSvapsPage', SvapsComponent);
