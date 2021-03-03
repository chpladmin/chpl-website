export const ProductEditComponent = {
  templateUrl: 'chpl.components/products/product/edit.html',
  bindings: {
    product: '<',
    isMerging: '<',
    mergingProducts: '<',
    showFormErrors: '<',
    takeAction: '&',
  },
  controller: class ProductEditComponent {
    constructor ($log, networkService) {
      'ngInject';
      this.$log = $log;
      this.networkService = networkService;
      this.mergeOptions = {};
    }

    $onInit () {
      let that = this;
      this.networkService.getDevelopers(true).then(response => {
        that.developers = response.developers
          .map(d => {
            d.displayName = d.name + (d.deleted ? ' - deleted' : ' - active');
            return d;
          })
          .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        if (that.developers && that.product) {
          that.currentOwner = that.developers.filter(d => d.developerId === that.product.owner.developerId)[0];
        }
      });
    }

    $onChanges (changes) {
      if (changes.product && changes.product.currentValue) {
        this.product = angular.copy(changes.product.currentValue);
        this.product.ownerHistory = this.product.ownerHistory
          .filter(o => o.transferDate)
          .concat({
            developer: this.product.owner,
            transferDate: undefined,
          })
          .map(d => {
            d.displayName = d.name + (d.deleted ? ' - deleted' : ' - active');
            return d;
          })
          .sort((a, b) => {
            if (a.transferDate && b.transferDate) {
              return b.transferDate - a.transferDate;
            }
            return a.transferDate ? 1 : -1;
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

    cancel () {
      this.takeAction({action: 'cancel'});
    }

    doneAddingOwner () {
      this.newOwner = undefined;
      this.newTransferDate = undefined;
      this.addingOwner = false;
      this.showFormErrors = false;
      this.generateErrorMessages();
    }

    editContact (contact) {
      this.product.contact = angular.copy(contact);
      this.generateErrorMessages();
    }

    generateErrorMessages () {
      let messages = [];
      if (this.showFormErrors) {
        if (this.isMerging && (!this.mergingProducts || this.mergingProducts.length === 0)) {
          messages.push('At least one other Product must be selected to merge');
        }
      }
      if (this.product) {
        this.product.ownerHistory.forEach((o, idx, arr) => {
          if (idx > 0) {
            if (arr[idx].developer.name === arr[idx - 1].developer.name) {
              messages.push('Product cannot transfer from Developer "' + arr[idx].developer.name + '" to the same Developer');
            }
          }
        });
      }
      this.errorMessages = messages;
    }

    isValid () {
      return this.errorMessages.length === 0 // business logic rules
                && this.form.$valid; // form validation
    }

    removeOwner (owner) {
      this.product.ownerHistory = this.product.ownerHistory
        .filter(o => (!(o.developer.developerId === owner.developer.developerId && o.transferDate === owner.transferDate)));
      this.generateErrorMessages();
    }

    save () {
      let request = angular.copy(this.product);
      request.owner = request.ownerHistory[0].developer;
      request.ownerHistory = request.ownerHistory.filter(o => o.transferDate);
      this.takeAction({action: 'edit', data: request});
    }

    saveNewOwner () {
      let time = this.newTransferDate ? this.newTransferDate.getTime() : undefined;
      this.product.ownerHistory = this.product.ownerHistory
        .concat({
          developer: this.newOwner,
          transferDate: time,
        })
        .sort((a, b) => {
          if (a.transferDate && b.transferDate) {
            return b.transferDate - a.transferDate;
          }
          return a.transferDate ? 1 : -1;
        });
      this.doneAddingOwner();
    }

    takeActionBarAction (action) {
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
                //no default
      }
    }

    updateCurrentOwner () {
      this.product.ownerHistory.forEach(owner => {
        if (!owner.transferDate) {
          owner.transferDate = (new Date()).getTime();
        }
      });
      this.product.ownerHistory = this.product.ownerHistory
        .concat({
          developer: this.currentOwner,
          transferDate: undefined,
        })
        .sort((a, b) => {
          if (a.transferDate && b.transferDate) {
            return b.transferDate - a.transferDate;
          }
          return a.transferDate ? 1 : -1;
        });
      this.doneAddingOwner();
    }

    /*
         * Pill generation
         */
    generateMergeOptions () {
      this.mergeOptions = {
        name: Array.from(new Set([this.productBackup.name].concat(this.mergingProducts.map(p => p.name)))),
      };
      this.contactOptions = {
        fullName: [],
        title: [],
        email: [],
        phoneNumber: [],
      };
      this.fillMergeOptionByProduct(this.productBackup);
      this.mergingProducts.forEach(p => this.fillMergeOptionByProduct(p));
      this.contactOptions.fullName = Array.from(new Set(this.contactOptions.fullName));
      this.contactOptions.title = Array.from(new Set(this.contactOptions.title));
      this.contactOptions.email = Array.from(new Set(this.contactOptions.email));
      this.contactOptions.phoneNumber = Array.from(new Set(this.contactOptions.phoneNumber));
    }

    fillMergeOptionByProduct (product) {
      if (product.contact) {
        if (product.contact.fullName) {
          this.contactOptions.fullName.push(product.contact.fullName);
        }
        if (product.contact.title) {
          this.contactOptions.title.push(product.contact.title);
        }
        if (product.contact.email) {
          this.contactOptions.email.push(product.contact.email);
        }
        if (product.contact.phoneNumber) {
          this.contactOptions.phoneNumber.push(product.contact.phoneNumber);
        }
      }
    }

    getDifferences (predicate) {
      if (!this.product || !this.mergeOptions[predicate]) { return; }
      return this.mergeOptions[predicate]
        .filter(e => e && e.length > 0 && e !== this.product[predicate])
        .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    }

    selectDifference (predicate, value) {
      this.product[predicate] = value;
    }
  },
};

angular.module('chpl.components')
  .component('chplProductEdit', ProductEditComponent);
