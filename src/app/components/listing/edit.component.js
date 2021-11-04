const ListingEditComponent = {
  templateUrl: 'chpl.components/listing/edit.html',
  bindings: {
    listing: '<',
    onChange: '&',
    resources: '<',
    showFormErrors: '<',
    workType: '<',
  },
  controller: class ListingEditComponent {
    constructor($filter, $log, $timeout, DateUtil, authService, utilService) {
      'ngInject';

      this.$filter = $filter;
      this.$log = $log;
      this.$timeout = $timeout;
      this.DateUtil = DateUtil;
      this.addNewValue = utilService.addNewValue;
      this.certificationStatusWhenEditing = utilService.certificationStatusWhenEditing;
      this.extendSelect = utilService.extendSelect;
      this.hasAnyRole = authService.hasAnyRole;
      this.utilService = utilService;
      this.newItem = {};
      this.addingItem = {};
      this.creatingItem = {};
    }

    $onChanges(changes) {
      if (changes.listing) {
        this.listing = angular.copy(changes.listing.currentValue);
        this.backupListing = angular.copy(changes.listing.currentValue);
      }
      if (changes.resources) {
        this.resources = angular.copy(changes.resources.currentValue);
        this.resources.testingLabs = this.resources.testingLabs.sort((a, b) => (a.name < b.name ? -1 : 1));
      }
      if (changes.workType) {
        this.workType = angular.copy(changes.workType.currentValue);
      }
      if (this.listing && this.resources) {
        this.prepareFields();
        this.update(true);
      }
    }

    prepareFields() {
      if (this.listing.chplProductNumber.length > 12) {
        const idFields = this.listing.chplProductNumber.split('.');
        this.idFields = {
          prefix: `${idFields[0]}.${idFields[1]}.${idFields[2]}.${idFields[3]}`,
          prod: idFields[4],
          ver: idFields[5],
          ics: idFields[6],
          suffix: `${idFields[7]}.${idFields[8]}`,
        };
      }
      this.listing.certificationEvents = this.listing.certificationEvents.map((ce) => ({
        ...ce,
        statusDateObject: new Date(ce.eventDate),
      }));

      if (this.listing.practiceType) {
        this.listing.practiceType = this.utilService.findModel(this.listing.practiceType, this.resources.practices);
      }
      if (this.listing.classificationType) {
        this.listing.classificationType = this.utilService.findModel(this.listing.classificationType, this.resources.classifications);
      }
      this.listing.certifyingBody = this.utilService.findModel(this.listing.certifyingBody, this.resources.bodies);
      if (this.listing.rwtPlansCheckDate) {
        this.listing.rwtPlansCheckDateObject = new Date(this.DateUtil.localDateToTimestamp(this.listing.rwtPlansCheckDate));
      }
      if (this.listing.rwtResultsCheckDate) {
        this.listing.rwtResultsCheckDateObject = new Date(this.DateUtil.localDateToTimestamp(this.listing.rwtResultsCheckDate));
      }
    }

    disabledStatus(name) {
      return (this.workType === 'confirm' && name !== 'Active');
    }

    generateErrorMessages() {
      this.messages = {
        errors: [],
        warnings: [],
      };
      if (this.improperFirstStatus()) {
        this.messages.errors.push('The earliest status of this product must be "Active"');
      }
      if (this.idFields && this.idFields.ics !== this.requiredIcsCode() && this.requiredIcsCode() > 0 && this.listing.ics.parents.length > 0) {
        this.messages.errors.push(`ICS Code must be exactly one more than highest ICS code of all of this Listing's ICS parents; it should be "${this.requiredIcsCode()}`);
      }
      if (this.hasStatusMatches()) {
        this.messages.errors.push('Certification status must not repeat');
      }
      if (this.hasDateMatches()) {
        this.messages.errors.push('Only one change of certification status allowed per day');
      }
    }

    hasDateMatches() {
      return this.listing.certificationEvents
        .reduce((acc, ce) => acc || this.matchesPreviousDate(ce), false);
    }

    hasStatusMatches() {
      return this.listing.certificationEvents
        .reduce((acc, ce) => acc || this.matchesPreviousStatus(ce), false);
    }

    improperFirstStatus() {
      return this.listing.currentStatus
       && this.$filter('orderBy')(this.listing.certificationEvents, 'statusDateObject')[0].status.name !== 'Active';
    }

    isValid() {
      return this.isSaving
                || !(this.form.$invalid
                     || this.hasStatusMatches()
                     || this.hasDateMatches()
                     || this.improperFirstStatus());
    }

    matchesPreviousDate(event) {
      const orderedStatus = this.$filter('orderBy')(this.listing.certificationEvents, 'statusDateObject');
      const statusLoc = orderedStatus.indexOf(event);
      if (statusLoc > 0) {
        const test = this.$filter('date')(event.statusDateObject, 'mediumDate', 'UTC') === this.$filter('date')(orderedStatus[statusLoc - 1].statusDateObject, 'mediumDate', 'UTC');
        return test;
      }
      return false;
    }

    matchesPreviousStatus(event) {
      const orderedStatus = this.$filter('orderBy')(this.listing.certificationEvents, 'statusDateObject');
      const statusLoc = orderedStatus.indexOf(event);
      if (statusLoc > 0) {
        return (event.status.name === orderedStatus[statusLoc - 1].status.name);
      }
      return false;
    }

    mayCauseSuspension(name) { // eslint-disable-line class-methods-use-this
      switch (name) {
        case ('Active'):
        case ('Retired'):
        case ('Suspended by ONC-ACB'):
        case ('Suspended by ONC'):
        case ('Withdrawn by Developer'):
        case ('Terminated by ONC'):
          return false;
        case ('Withdrawn by ONC-ACB'):
        case ('Withdrawn by Developer Under Surveillance/Review'):
          return true;
        default: return false;
      }
    }

    requiredIcsCode() {
      const code = this.listing.ics.parents
        .map((item) => parseInt(item.chplProductNumber.split('.')[6], 10))
        .reduce((max, current) => Math.max(max, current), -1)
                + 1;
      return (code > 9 || code < 0) ? `${code}` : `0${code}`;
    }

    update(doNotUpdateListing) {
      this.listing.certificationEvents = this.listing.certificationEvents.map((ce) => ({
        ...ce,
        eventDate: ce.statusDateObject.getTime(),
      }));
      if (this.listing.chplProductNumber.length > 12) {
        this.listing.chplProductNumber = `${this.idFields.prefix}.${
          this.idFields.prod}.${
          this.idFields.ver}.${
          this.idFields.ics}.${
          this.idFields.suffix}`;
      }
      if (this.listing.rwtPlansCheckDateObject) {
        this.listing.rwtPlansCheckDate = this.DateUtil.timestampToString(this.listing.rwtPlansCheckDateObject.getTime(), 'yyyy-MM-dd');
      } else {
        this.listing.rwtPlansCheckDate = null;
      }
      if (this.listing.rwtResultsCheckDateObject) {
        this.listing.rwtResultsCheckDate = this.DateUtil.timestampToString(this.listing.rwtResultsCheckDateObject.getTime(), 'yyyy-MM-dd');
      } else {
        this.listing.rwtResultsCheckDate = null;
      }
      this.generateErrorMessages();
      this.onChange({
        listing: doNotUpdateListing ? undefined : this.listing,
        messages: this.messages,
        reason: this.reason,
      });
    }

    updateListing(listing) {
      this.listing.certificationResults = listing.certificationResults;
      this.listing.cqmResults = listing.cqmResults;
      this.listing.measures = listing.measures;
      this.listing.sed = listing.sed;
      this.listing.sedIntendedUserDescription = listing.sedIntendedUserDescription;
      this.listing.sedReportFileLocation = listing.sedReportFileLocation;
      this.listing.sedTestingEndDate = listing.sedTestingEndDate;
    }

    // item list
    cancelNewItem(type) {
      this.newItem[type] = undefined;
      this.addingItem[type] = false;
      this.creatingItem[type] = false;
    }

    filterListEditItems(items) {
      return items.filter((i) => !this.listing.testingLabs.filter((tl) => tl.testingLabName === i.name).length);
    }

    removeItem(type, item) {
      switch (type) {
        case 'certificationEvents':
          this.listing.certificationEvents = this.listing.certificationEvents.filter((event) => event.statusDateObject.getTime() !== item.statusDateObject.getTime());
          break;
        case 'oncAtls':
          this.listing.testingLabs = this.listing.testingLabs.filter((l) => l.testingLabName !== item.testingLabName);
          break;
        default:
          this.$log.error('remove', type, item);
      }
      this.update();
    }

    saveNewItem(type) {
      switch (type) {
        case 'certificationEvents':
          this.listing.certificationEvents.push({
            status: this.newItem[type].status,
            statusDateObject: this.newItem[type].statusDateObject,
            reason: this.newItem[type].reason,
          });
          break;
        case 'oncAtls':
          this.addNewValue(this.listing.testingLabs, this.newItem[type]);
          this.listing.testingLabs = this.listing.testingLabs.sort((a, b) => (a.testingLabName < b.testingLabName ? -1 : 1));
          break;
        default:
          this.$log.error('add', type);
      }
      this.cancelNewItem(type);
      this.update();
    }
  },
};
angular.module('chpl.components')
  .component('chplListingEdit', ListingEditComponent);

export default ListingEditComponent;
