const ConfirmListingComponent = {
  templateUrl: 'chpl.administration/confirm/listing.html',
  bindings: {
    listing: '<',
    developers: '<',
  },
  controller: class ConfirmListingComponent {
    constructor($log, $q, $scope, $state, networkService, toaster) {
      'ngInject';

      this.$log = $log;
      this.$q = $q;
      this.$scope = $scope;
      this.$state = $state;
      this.networkService = networkService;
      this.toaster = toaster;
      this.stage = 'developer';
      this.products = [];
      this.versions = [];
      this.resources = {};
      this.staged = {};
      this.progress = -1;
      this.handleDeveloperDispatch = this.handleDeveloperDispatch.bind(this);
      this.handleProductDispatch = this.handleProductDispatch.bind(this);
      this.handleVersionDispatch = this.handleVersionDispatch.bind(this);
      this.handleActionDispatch = this.handleActionDispatch.bind(this);
      this.handleProgressDispatch = this.handleProgressDispatch.bind(this);
    }

    $onInit() {
      this.progress = this.getProgress();
      this.loadDeveloper();
      const pending = {};
      this.$q.all([
        this.networkService.getSearchOptions()
          .then((response) => {
            pending.bodies = response.acbs;
            pending.classifications = response.productClassifications;
            pending.editions = response.editions;
            pending.practices = response.practiceTypes;
            pending.statuses = response.certificationStatuses;
          }),
        this.networkService.getAccessibilityStandards().then((response) => { pending.accessibilityStandards = response; }),
        this.networkService.getAtls(false).then((response) => { pending.testingLabs = response.atls; }),
        this.networkService.getMeasures().then((response) => { pending.measures = response; }),
        this.networkService.getMeasureTypes().then((response) => { pending.measureTypes = response; }),
        this.networkService.getQmsStandards().then((response) => { pending.qmsStandards = response; }),
        this.networkService.getTargetedUsers().then((response) => { pending.targetedUsers = response; }),
        this.networkService.getTestData().then((response) => { pending.testData = response; }),
        this.networkService.getTestFunctionality().then((response) => { pending.testFunctionalities = response; }),
        this.networkService.getTestProcedures().then((response) => { pending.testProcedures = response; }),
        this.networkService.getTestStandards().then((response) => { pending.testStandards = response; }),
        this.networkService.getUcdProcesses().then((response) => { pending.ucdProcesses = response; }),
      ]).then(() => { this.resources = pending; });
    }

    $onChanges(changes) {
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

    canAct(action) {
      let ret;
      switch (action) {
        case 'confirm': ret = this.stage === 'listing';
          break;
        case 'next': ret = this.stage !== 'listing'; // todo: validation on "create" data
          break;
        case 'previous': ret = this.stage !== 'developer';
          break;
          // no default
      }
      return ret;
    }

    handleDeveloperDispatch(action, data) {
      switch (action) {
        case 'select':
          this.pending.developer = data;
          break;
        case 'edit':
          this.pending.developer = data;
          break;
          // no default
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
          // no default
      }
      this.$scope.$digest();
    }

    handleVersionDispatch(action, data) {
      switch (action) {
        case 'select':
          this.pending.version = data;
          break;
        case 'edit':
          this.pending.version = data;
          break;
          // no default
      }
      this.$scope.$digest();
    }

    handleProgressDispatch(action) {
      switch (action) {
        case 'next': this.next();
          break;
        case 'previous': this.previous();
          break;
          // no default
      }
      this.$scope.$digest();
    }

    handleActionDispatch(action) {
      switch (action) {
        case 'cancel': this.cancel();
          break;
        case 'confirm': this.confirm();
          break;
        case 'reject': this.reject();
          break;
          // no default
      }
      this.$scope.$digest();
    }

    loadDeveloper() {
      const that = this;
      this.staged = { ...this.uploaded.developer };
      if (this.pending.developer && this.pending.developer.developerId) {
        this.networkService.getDeveloper(this.pending.developer.developerId)
          .then((result) => {
            that.pending.developer = result;
            that.staged = { ...result };
          });
      }
    }

    loadProducts() {
      const that = this;
      if (this.pending.developer && this.pending.developer.developerId) {
        this.networkService.getProductsByDeveloper(this.pending.developer.developerId)
          .then((result) => { that.products = result.products; });
      } else {
        that.products = [];
      }
      if (this.pending.product && this.pending.product.productId) {
        this.networkService.getSimpleProduct(this.pending.product.productId)
          .then((result) => {
            that.staged = result;
            that.pending.product = result;
          });
      } else {
        that.staged = { ...that.pending.product };
      }
    }

    loadVersions() {
      const that = this;
      if (this.pending.product && this.pending.product.productId) {
        this.networkService.getVersionsByProduct(this.pending.product.productId)
          .then((result) => { that.versions = result; });
      } else {
        that.versions = [];
      }
      if (this.pending.version && this.pending.version.versionId) {
        this.networkService.getSimpleVersion(this.pending.version.versionId)
          .then((result) => {
            that.staged = result;
            that.pending.version = result;
          });
      } else {
        that.staged = { ...that.pending.version };
      }
    }

    confirm() {
      const that = this;
      this.networkService.confirmPendingCp({
        pendingListing: this.pending,
        acknowledgeWarnings: this.acknowledgeWarnings,
      }).then(() => {
        that.toaster.pop({
          type: 'success',
          title: 'Success',
          body: 'The Listing has been confirmed',
        });
        that.$state.go('^', {}, { reload: true });
      }, (error) => {
        if (error.data.contact) {
          that.toaster.pop({
            type: 'warning',
            title: 'Warning',
            body: 'The Listing was already resolved',
          });
          that.$state.go('^', {}, { reload: true });
        } else {
          that.errorMessages = error.data.errorMessages;
          that.warningMessages = error.data.warningMessages;
        }
      });
    }

    reject() {
      const that = this;
      this.networkService.rejectPendingListing(this.uploaded.id)
        .then(() => {
          that.toaster.pop({
            type: 'success',
            title: 'Success',
            body: 'The Listing has been rejected',
          });
          that.$state.go('^', {}, { reload: true });
        }, (error) => {
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

    handleListing(action, data) {
      switch (action) {
        case 'edit':
          this.isEditing = true;
          break;
        case 'cancel':
          this.isEditing = false;
          break;
        case 'save':
          this.isEditing = false;
          this.pending = data;
          break;
          // no default
      }
    }

    next() {
      switch (this.stage) {
        case 'developer':
          this.stage = 'product';
          this.loadProducts();
          break;
        case 'product':
          this.stage = 'version';
          this.loadFamily();
          this.loadVersions();
          break;
        case 'version':
          this.stage = 'listing';
          break;
        default:
          break;
      }
      this.progress = this.getProgress();
    }

    previous() {
      switch (this.stage) {
        case 'product':
          this.staged = { ...this.pending.developer };
          this.stage = 'developer';
          break;
        case 'version':
          this.staged = { ...this.pending.product };
          this.stage = 'product';
          break;
        case 'listing':
          this.staged = { ...this.pending.version };
          this.stage = 'version';
          break;
        default:
          break;
      }
      this.progress = this.getProgress();
    }

    cancel() {
      this.$state.go('^', {}, { reload: true });
    }

    getProgress() {
      switch (this.stage) {
        case 'developer':
          return 0;
        case 'product':
          return 1;
        case 'version':
          return 2;
        case 'listing':
          return 3;
        default:
          return -1;
      }
    }

    loadFamily() {
      const that = this;
      if (this.pending.product && this.pending.product.productId) {
        this.networkService.getRelatedListings(this.pending.product.productId)
          .then((family) => { that.resources.relatedListings = family.filter((item) => item.edition === '2015'); });
      }
    }
  },
};

angular.module('chpl.administration')
  .component('chplConfirmListing', ConfirmListingComponent);

export default ConfirmListingComponent;
