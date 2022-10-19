const ProductEditComponent = {
  templateUrl: 'chpl.components/products/product/edit.html',
  bindings: {
    product: '<',
    isMerging: '<',
    mergingProducts: '<',
    showFormErrors: '<',
    takeAction: '&',
  },
  controller: class ProductEditComponent {
    constructor($log, DateUtil, networkService) {
      'ngInject';

      this.$log = $log;
      this.DateUtil = DateUtil;
      this.networkService = networkService;
      this.mergeOptions = {};
    }

    $onInit() {
      const that = this;
      this.networkService.getDevelopers(true).then((response) => {
        that.developers = response.developers
          .map((d) => ({
            ...d,
            displayName: d.name + (d.deleted ? ' - deleted' : ' - active'),
          }))
          .sort((a, b) => (a.name < b.name ? -1 : 0));
        if (that.developers && that.product) {
          [that.currentOwner] = that.developers.filter((d) => d.id === that.product.owner.id);
        }
      });
    }

    $onChanges(changes) {
      if (changes.product && changes.product.currentValue) {
        this.product = angular.copy(changes.product.currentValue);
        this.product.ownerHistory = this.product.ownerHistory
          .filter((o) => o.transferDay)
          .concat({
            developer: this.product.owner,
            transferDay: undefined,
          })
          .map((d) => ({
            ...d,
            displayName: d.name + (d.deleted ? ' - deleted' : ' - active'),
          }))
          .sort((a, b) => {
            if (a.transferDay && b.transferDay) {
              return a.transferDay < b.transferDay ? -1 : 1;
            }
            return a.transferDay ? 1 : -1;
          });
        this.productBackup = angular.copy(this.product);
      }
      if (changes.isMerging) {
        this.isMerging = angular.copy(changes.isMerging.currentValue);
      }
      if (changes.mergingProducts) {
        this.mergingProducts = angular.copy(changes.mergingProducts.currentValue);
        this.generateErrorMessages();
      }
      if (changes.showFormErrors) {
        this.showFormErrors = angular.copy(changes.showFormErrors.currentValue);
      }
      if (this.product && this.mergingProducts) {
        this.generateMergeOptions();
      }
    }

    cancel() {
      this.takeAction({ action: 'cancel' });
    }

    doneAddingOwner() {
      this.newOwner = undefined;
      this.newTransferDay = undefined;
      this.addingOwner = false;
      this.showFormErrors = false;
      this.generateErrorMessages();
    }

    editContact(contact) {
      this.product.contact = angular.copy(contact);
      this.generateErrorMessages();
    }

    generateErrorMessages() {
      const messages = [];
      if (this.showFormErrors) {
        if (this.isMerging && (!this.mergingProducts || this.mergingProducts.length === 0)) {
          messages.push('At least one other Product must be selected to merge');
        }
      }
      if (this.product) {
        this.product.ownerHistory.forEach((o, idx, arr) => {
          if (idx > 0) {
            if (arr[idx].developer.name === arr[idx - 1].developer.name) {
              messages.push(`Product cannot transfer from Developer "${arr[idx].developer.name}" to the same Developer`);
            }
          }
        });
      }
      this.errorMessages = messages;
    }

    isValid() {
      return this.errorMessages.length === 0 // business logic rules
        && this.form.$valid; // form validation
    }

    removeOwner(owner) {
      this.product.ownerHistory = this.product.ownerHistory
        .filter((o) => (!(o.developer.id === owner.developer.id && o.transferDay === owner.transferDay)));
      this.generateErrorMessages();
    }

    save() {
      const request = angular.copy(this.product);
      request.owner = request.ownerHistory[0].developer;
      request.ownerHistory = request.ownerHistory.filter((o) => o.transferDay);
      this.takeAction({ action: 'edit', data: request });
    }

    saveNewOwner() {
      this.product.ownerHistory = this.product.ownerHistory
        .concat({
          developer: this.newOwner,
          transferDay: this.newTransferDay,
        })
        .sort((a, b) => {
          if (a.transferDay && b.transferDay) {
            return a.transferDay < b.transferDay ? -1 : 1;
          }
          return a.transferDay ? 1 : -1;
        });
      this.doneAddingOwner();
    }

    takeActionBarAction(action) {
      switch (action) {
        case 'cancel':
          this.cancel();
          break;
        case 'mouseover':
          this.showFormErrors = true;
          this.generateErrorMessages();
          break;
        case 'save':
          this.save();
          break;
          // no default
      }
    }

    updateCurrentOwner() {
      this.product.ownerHistory = this.product.ownerHistory
        .map((owner) => ({
          ...owner,
          transferDay: owner.transferDay || this.DateUtil.timestampToString(Date.now(), 'yyyy-MM-d'),
        }))
        .concat({
          developer: this.currentOwner,
          transferDay: undefined,
        })
        .sort((a, b) => {
          if (a.transferDay && b.transferDay) {
            return a.transferDay < b.transferDay ? -1 : 1;
          }
          return a.transferDay ? 1 : -1;
        });
      this.doneAddingOwner();
    }

    /*
     * Pill generation
     */
    generateMergeOptions() {
      this.mergeOptions = {
        name: Array.from(new Set([this.productBackup.name].concat(this.mergingProducts.map((p) => p.name)))),
      };
    }

    getDifferences(predicate) {
      if (!this.product || !this.mergeOptions[predicate]) { return []; }
      return this.mergeOptions[predicate]
        .filter((e) => e && e.length > 0 && e !== this.product[predicate])
        .sort((a, b) => (a < b ? -1 : 1));
    }

    selectDifference(predicate, value) {
      this.product[predicate] = value;
    }
  },
};

angular.module('chpl.components')
  .component('chplProductEdit', ProductEditComponent);

export default ProductEditComponent;
