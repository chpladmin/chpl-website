export const ConfirmListingComponent = {
  templateUrl: 'chpl.administration/confirm/listing.html',
  bindings: {
    listing: '<',
    developers: '<',
  },
  controller: class ConfirmListingComponent {
    constructor ($log, $scope, $state, networkService, toaster) {
      'ngInject';
      this.$log = $log;
      this.$scope = $scope;
      this.$state = $state;
      this.networkService = networkService;
      this.toaster = toaster;
      this.stage = 'developer';
      this.products = [];
      this.versions = [];
      this.errorMessages = [];
      this.systemRequirements = [];
      this.resources = {};
      this.handleDeveloperDispatch = this.handleDeveloperDispatch.bind(this);
      this.handleProductDispatch = this.handleProductDispatch.bind(this);
    }

    $onInit () {
      this.loadDeveloper();
    }

    $onChanges (changes) {
      if (changes.listing) {
        this.uploaded = angular.copy(changes.listing.currentValue);
        this.pending = angular.copy(changes.listing.currentValue);
        if (this.pending.developer && !this.pending.developer.developerId) {
          this.pending.developer.developerId = '';
        }
      }
      if (changes.developers) {
        this.developers = angular.copy(changes.developers.currentValue);
      }
    }

    canAct (action) {
      switch (action) {
      case 'confirm': return this.stage === 'listing';
      case 'next': return this.showFormErrors && (this.form.$pristine || !this.pending.developer.developerId) && !this.isDisabled();
      case 'previous': return this.stage !== 'developer';
        // no default
      }
    }

    handleDeveloperDispatch(action, data) {
      switch (action) {
        case 'select':
          this.pending.developer = data;
          break;
        case 'edit':
          this.pending.developer = data;
          break;
      }
      this.$scope.$digest();
    }

    handleProductDispatch(action, data) {
      switch (action) {
        case 'select':
          this.pending.product = data;
          break;
        case 'edit':
          this.pending.product = data;
          break;
      }
      this.$scope.$digest();
    }

    loadDeveloper () {
      let that = this;
      if (this.pending.developer && this.pending.developer.developerId) {
        this.networkService.getDeveloper(this.pending.developer.developerId)
          .then(result => that.pending.developer = result);
      }
    }

    loadProducts () {
      let that = this;
      if (this.pending.developer && this.pending.developer.developerId) {
        this.networkService.getProductsByDeveloper(this.pending.developer.developerId)
          .then(result => that.products = result.products);
      } else {
        that.products = [];
      }
      if (this.pending.product && this.pending.product.productId) {
        this.networkService.getSimpleProduct(this.pending.product.productId)
          .then(result => that.pending.product = result);
      } else {
        that.pending.product = {};
      }
    }

    selectInspectingVersion (versionId) {
      this.pending.version.versionId = versionId;
    }

    setVersionChoice (choice) {
      this.versionChoice = choice;
    }

    takeAction (action) {
      switch (action) {
      case 'cancel': this.cancel();
        break;
      case 'confirm': this.confirm();
        break;
      case 'mouseover': this.showFormErrors = true;
        break;
      case 'next': this.next();
        break;
      case 'previous': this.previous();
        break;
      case 'reject': this.reject();
        break;
        // no default
      }
    }

    confirm () {
      let that = this;
      this.networkService.confirmPendingCp({
        pendingListing: this.pending,
        acknowledgeWarnings: this.acknowledgeWarnings,
      }).then(() => {
        that.toaster.pop({
          type: 'success',
          title: 'Success',
          body: 'The Listing has been confirmed',
        });
        that.$state.go('^', {}, {reload: true});
      }, error => {
        if (error.data.contact) {
          that.toaster.pop({
            type: 'warning',
            title: 'Warning',
            body: 'The Listing was already resolved',
          });
          that.$state.go('^', {}, {reload: true});
        } else {
          that.errorMessages = error.data.errorMessages;
          that.warningMessages = error.data.warningMessages;
        }
      });
    }

    reject () {
      let that = this;
      this.networkService.rejectPendingListing(this.uploaded.id)
        .then(() => {
          that.toaster.pop({
            type: 'success',
            title: 'Success',
            body: 'The Listing has been rejected',
          });
          that.$state.go('^', {}, {reload: true});
        }, error => {
          if (error.data.contact) {
            that.toaster.pop({
              type: 'warning',
              title: 'Warning',
              body: 'The Listing was already resolved',
            });
          } else {
            that.errorMessages = error.data.errorMessages;
            that.warningMessages = error.data.warningMessages;
          }
        });
    }

    editListing (listing) {
      this.pending = listing;
    }

    next () {
      switch (this.stage) {
      case 'developer':
          this.stage = 'product';
          this.loadProducts();
        break;
      case 'product':
        this.stage = 'version';
        this.loadFamily();
        break;
      case 'version':
        this.stage = 'listing';
        break;
      default:
        break;
      }
    }

    previous () {
      switch (this.stage) {
      case 'product': this.stage = 'developer';
        break;
      case 'version': this.stage = 'product';
        break;
      case 'listing': this.stage = 'version';
        break;
      default:
        break;
      }
    }

    isDisabled () {
      switch (this.stage) {
      case 'developer':
        return this.form.$invalid;
      case 'product':
        return (this.productChoice === 'choose' && !this.pending.product.productId);
      case 'version':
        return (this.versionChoice === 'choose' && !this.pending.version.versionId);
      default:
        return true;
      }
    }

    cancel () {
      this.$state.go('^', {}, {reload: true});
    }

    getStage () {
      switch (this.stage) {
      case 'developer': return 1;
      case 'product': return 2;
      case 'version': return 3;
      case 'listing': return 4;
        //no default
      }
    }

    loadFamily () {
      let that = this;
      if (this.pending.product && this.pending.product.productId) {
        this.networkService.getRelatedListings(this.pending.product.productId)
          .then(family => that.resources.relatedListings = family.filter(item => item.edition === '2015'));
      }
    }
  },
};

angular.module('chpl.administration')
  .component('chplConfirmListing', ConfirmListingComponent);
