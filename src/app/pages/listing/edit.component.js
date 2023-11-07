const ListingEditPageComponent = {
  templateUrl: 'chpl.listing/edit.html',
  bindings: {
    isConfirming: '<',
    listing: '<',
    onCancel: '&',
    onChange: '&',
    resources: '<',
    errors: '<',
    warnings: '<',
  },
  controller: class ListingEditPageComponent {
    constructor($log, $q, $state, featureFlags, networkService) {
      'ngInject';

      this.$log = $log;
      this.$q = $q;
      this.$state = $state;
      this.isOn = featureFlags.isOn;
      this.networkService = networkService;
      this.takeActionBarAction = this.takeActionBarAction.bind(this);
      this.showWarningAcknowledgement = false;
      this.showErrorAcknowledgement = false;
    }

    $onInit() {
      this.errors = {
        basic: [],
        details: [],
        save: [],
        businessErrors: [],
        dataErrors: [],
      };
      this.warnings = {
        basic: [],
        details: [],
        save: [],
      };
    }

    $onChanges(changes) {
      if (changes.listing) {
        this.listingBasic = angular.copy(changes.listing.currentValue);
        this.listingDetails = angular.copy(changes.listing.currentValue);
      }
      if (changes.resources) {
        this.resources = angular.copy(changes.resources.currentValue);
      }
      if (this.listingDetails && this.resources) {
        this.prepareResources();
      }
      if (changes.errors) {
        this.higherErrors = angular.copy(changes.errors.currentValue);
      }
      if (changes.warnings) {
        this.higherWarnings = angular.copy(changes.warnings.currentValue);
      }
    }

    prepareResources() {
      this.resources.testStandards.data = this.resources.testStandards.data.filter((item) => !item.year || item.year === this.listingDetails.edition?.name);
    }

    cancel() {
      if (this.isConfirming) {
        this.onCancel();
      } else {
        this.$state.go('^');
      }
    }

    consolidateErrors() {
      this.errorMessages = [].concat(this.errors.basic, this.errors.details, this.errors.save, this.higherErrors).filter((message) => message);
      this.warningMessages = [].concat(this.warnings.basic, this.warnings.details, this.warnings.save, this.higherWarnings).filter((message) => message);
      this.showWarningAcknowledgement = !this.isConfirming && this.warningMessages.length > 0;
      this.showErrorAcknowledgement = !this.isConfirming && this.errors.businessErrors.length > 0 && this.errors.dataErrors.length === 0;
    }

    isValid() {
      return this.isConfirming
        || (this.form.$valid
          && this.errors.basic.length === 0
          && this.errors.details.length === 0);
    }

    save() {
      const that = this;
      this.listingBasic.certificationResults = this.listingDetails.certificationResults;
      this.listingBasic.cqmResults = this.listingDetails.cqmResults;
      this.listingBasic.sed = this.listingDetails.sed;
      this.listingBasic.sedIntendedUserDescription = this.listingDetails.sedIntendedUserDescription;
      this.listingBasic.sedReportFileLocation = this.listingDetails.sedReportFileLocation;
      this.listingBasic.sedTestingEndDay = this.listingDetails.sedTestingEndDay;

      this.listingBasic.accessibilityStandards = this.listingDetails.accessibilityStandards;
      this.listingBasic.otherAcb = this.listingDetails.otherAcb;
      this.listingBasic.measures = this.listingDetails.measures;
      this.listingBasic.qmsStandards = this.listingDetails.qmsStandards;
      this.listingBasic.reportFileLocation = this.listingDetails.reportFileLocation;
      this.listingBasic.targetedUsers = this.listingDetails.targetedUsers;
      this.listingBasic.promotingInteroperabilityUserHistory = this.listingDetails.promotingInteroperabilityUserHistory;
      if (this.isConfirming) {
        this.onChange({ listing: this.listingBasic });
      } else {
        const updateObject = {
          listing: this.listingBasic,
          reason: this.reason,
          acknowledgeWarnings: this.acknowledgeWarnings,
          acknowledgeBusinessErrors: this.acknowledgeErrors,
        };
        this.isSaving = true;
        this.networkService.updateCP(updateObject).then((response) => {
          if (!response.status || response.status === 200) {
            that.listingBasic = angular.copy(response);
            that.listingDetails = angular.copy(response);
            that.$state.go('^', undefined, { reload: true });
          } else {
            that.isSaving = undefined;
            that.errors.save = [response.error];
            that.consolidateErrors();
          }
        }, (error) => {
          that.isSaving = undefined;
          if (error.data) {
            that.errors.save = [];
            that.warnings.save = [];
            if (error.data.error && error.data.error.length > 0) {
              that.errors.save.push(error.data.error);
            }
            if (error.data.errorMessages && error.data.errorMessages.length > 0) {
              that.errors.save = that.errors.save.concat(error.data.errorMessages);
            }
            if (error.data.businessErrorMessages) {
              that.errors.businessErrors = error.data.businessErrorMessages;
            }
            if (error.data.dataErrorMessages) {
              that.errors.dataErrors = error.data.dataErrorMessages;
            }
            if (error.data.warningMessages && error.data.warningMessages.length > 0) {
              that.warnings.save = that.warnings.save.concat(error.data.warningMessages);
            }
            that.consolidateErrors();
          }
        });
      }
    }

    takeActionBarAction(action) {
      switch (action) {
        case 'cancel':
          this.cancel();
          break;
        case 'mouseover':
          this.consolidateErrors();
          this.showFormErrors = true;
          break;
        case 'save':
          this.save();
          break;
        case 'toggleWarningAcknowledgement':
          this.acknowledgeWarnings = !this.acknowledgeWarnings;
          break;
        case 'toggleErrorAcknowledgement':
          this.acknowledgeErrors = !this.acknowledgeErrors;
          break;
        // no default
      }
    }

    updateBasic(listing, messages, reason) {
      if (listing) {
        this.listingBasic = angular.copy(listing);
      }
      this.errors.basic = messages?.errors.sort((a, b) => (a < b ? -1 : 1));
      this.warnings.basic = messages?.warnings.sort((a, b) => (a < b ? -1 : 1));
      this.consolidateErrors();
      this.reason = reason;
    }

    updateDetails(listing, messages) {
      this.listingDetails.certificationResults = listing.certificationResults;
      this.listingDetails.cqmResults = listing.cqmResults;
      this.listingDetails.sed = listing.sed;
      this.listingDetails.sedIntendedUserDescription = listing.sedIntendedUserDescription;
      this.listingDetails.sedReportFileLocation = listing.sedReportFileLocation;
      this.listingDetails.sedTestingEndDay = listing.sedTestingEndDay;

      this.listingDetails.accessibilityStandards = angular.copy(listing.accessibilityStandards);
      this.listingDetails.otherAcb = listing.otherAcb;
      this.listingDetails.ics = angular.copy(listing.ics);
      this.listingBasic.ics = angular.copy(listing.ics);
      this.listingDetails.measures = angular.copy(listing.measures);
      this.listingDetails.qmsStandards = angular.copy(listing.qmsStandards);
      this.listingDetails.reportFileLocation = listing.reportFileLocation;
      this.listingDetails.targetedUsers = angular.copy(listing.targetedUsers);
      this.listingDetails.promotingInteroperabilityUserHistory = angular.copy(listing.promotingInteroperabilityUserHistory);
      this.errors.details = messages.errors.sort((a, b) => (a < b ? -1 : 1));
      this.warnings.details = messages.warnings.sort((a, b) => (a < b ? -1 : 1));
      this.listingBasic = angular.copy(this.listingBasic);
      this.consolidateErrors();
    }
  },
};

angular
  .module('chpl.listing')
  .component('chplListingEditPage', ListingEditPageComponent);

export default ListingEditPageComponent;
