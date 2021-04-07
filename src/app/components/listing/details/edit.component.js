const ListingDetailsEditComponent = {
  templateUrl: 'chpl.components/listing/details/edit.html',
  bindings: {
    listing: '<',
    initialPanel: '@',
    isConfirming: '<',
    onChange: '&',
    resources: '<',
    showFormErrors: '<',
  },
  controller: class ListingDetailsEditComponent {
    constructor($analytics, $filter, $log, $uibModal, networkService, utilService) {
      this.$analytics = $analytics;
      this.$filter = $filter;
      this.$log = $log;
      this.$uibModal = $uibModal;
      this.networkService = networkService;
      this.utilService = utilService;
      this.addNewValue = utilService.addNewValue;
      this.sortCerts = utilService.sortCert;
      this.handlers = [];
      this.drStatus = 'pending';
      this.viewAllCerts = true;
      this.panelShown = 'cert';
      this.newItem = {};
      this.addingItem = {};
      this.creatingItem = {};
    }

    $onInit() {
      if (this.initialPanel) {
        if (this.initialPanel !== 'none') {
          this.panelShown = this.initialPanel;
        } else {
          this.panelShown = undefined;
        }
      }
    }

    $onChanges(changes) {
      if (changes.listing && changes.listing.currentValue) {
        this.listing = angular.copy(changes.listing.currentValue);
        this.countCerts = this.listing.certificationResults.filter((cr) => cr.success).length;
        this.countCqms = this.listing.cqmResults.filter((cqm) => cqm.success).length;
        this.cqms = this.listing.cqmResults;
        this.prepCqms();
      }
      if (changes.resources && changes.resources.currentValue) {
        this.resources = angular.copy(changes.resources.currentValue);
        this.resources.accessibilityStandards = this.resources.accessibilityStandards.data.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        this.resources.qmsStandards = this.resources.qmsStandards.data.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        this.resources.targetedUsers = this.resources.targetedUsers.data.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      }
      if (this.listing && this.resources) {
        this.prepareFields();
      }
    }

    hasEdited() {
      angular.forEach(this.handlers, (handler) => {
        handler();
      });
      this.update();
    }

    g1g2Change(measures) {
      this.listing.measures = measures;
      this.update();
    }

    generateErrorMessages() {
      this.messages = {
        errors: [],
        warnings: [],
      };
      if (this.missingIcsSource()) {
        this.messages.errors.push('Listing is marked as having Inherited Certification Status but does not have references to the Listing(s) it inherited from');
      }
    }

    missingIcsSource() {
      return this.listing.certificationEdition.name === '2015' && this.listing.ics.inherits && this.listing.ics.parents.length === 0;
    }

    matchesPreviousMuuDate(muu) {
      const orderedMuu = this.$filter('orderBy')(this.listing.meaningfulUseUserHistory, 'muuDateObject');
      const muuLoc = orderedMuu.indexOf(muu);
      if (muuLoc > 0) {
        return (this.$filter('date')(muu.muuDateObject, 'mediumDate', 'UTC') === this.$filter('date')(orderedMuu[muuLoc - 1].muuDateObject, 'mediumDate', 'UTC'));
      }
      return false;
    }

    prepareFields() {
      if (angular.isUndefined(this.listing.ics.parents)) {
        this.listing.ics.parents = [];
      }
      if (this.listing.meaningfulUseUserHistory && this.listing.meaningfulUseUserHistory.length > 0) {
        this.listing.meaningfulUseUserHistory = this.listing.meaningfulUseUserHistory.map((muu) => {
          muu.muuDateObject = new Date(muu.muuDate);
          return muu;
        });
      } else {
        this.listing.meaningfulUseUserHistory = [];
      }

      if (this.listing.product && this.listing.product.productId && this.listing.certificationEdition.name === '2015' && !this.relatedListings) {
        const that = this;
        this.networkService.getRelatedListings(this.listing.product.productId)
          .then((family) => that.relatedListings = family.filter((item) => item.edition === '2015' && item.id !== that.listing.id));
      }
    }

    prepCqms() {
      if (this.cqms) {
        this.cqms = this.cqms.map((cqm, idx) => {
          cqm.id = idx;
          for (let j = 1; j < 5; j++) {
            cqm[`hasC${j}`] = this.checkC(cqm, j);
          }
          cqm.allVersions.sort((a, b) => {
            const aVal = parseInt(a.substring(1), 10);
            const bVal = parseInt(b.substring(1), 10);
            return aVal - bVal;
          });
          cqm.successVersions.sort((a, b) => {
            const aVal = parseInt(a.substring(1), 10);
            const bVal = parseInt(b.substring(1), 10);
            return aVal - bVal;
          });
          return cqm;
        });
      }
    }

    registerSed(handler) {
      const that = this;
      this.handlers.push(handler);
      const removeHandler = function () {
        that.handlers = that.handlers.filter((aHandler) => aHandler !== handler);
      };
      return removeHandler;
    }

    saveCert(cert) {
      for (let i = 0; i < this.listing.certificationResults.length; i++) {
        if (this.listing.certificationResults[i].number === cert.number
                    && this.listing.certificationResults[i].title === cert.title) {
          this.listing.certificationResults[i] = cert;
        }
      }
      this.updateCs();
    }

    sedChange(listing) {
      this.listing = listing;
      this.update();
    }

    sortCqms(cqm) {
      let ret = 0;
      if (cqm.cmsId) {
        ret = parseInt(cqm.cmsId.substring(3), 10);
      } else {
        ret = parseInt(cqm.nqfNumber, 10);
      }
      return ret;
    }

    showPanel(panel) {
      this.panelShown = this.panelShown === panel ? '' : panel;
    }

    showSubPanel(panel) {
      this.subPanelShown = this.subPanelShown === panel ? '' : panel;
    }

    update() {
      this.generateErrorMessages();
      this.onChange({
        listing: this.listing,
        messages: this.messages,
      });
    }

    updateCs() {
      this.cqms.forEach((cqm) => {
        cqm.criteria = [];
        if (cqm.success || cqm.successVersions.length > 0) {
          for (let j = 1; j < 5; j++) {
            if (cqm[`hasC${j}`]) {
              const number = `170.315 (c)(${j})`;
              cqm.criteria.push({
                certificationNumber: number,
              });
            }
          }
        }
      });
      this.listing.cqmResults = angular.copy(this.cqms);
      this.update();
    }

    // item list
    cancelNewItem(type) {
      this.newItem[type] = undefined;
      this.addingItem[type] = false;
      this.creatingItem[type] = false;
    }

    filterListEditItems(type, items) {
      switch (type) {
        case 'accessibilityStandards':
          return items.filter((i) => !this.listing.accessibilityStandards.filter((as) => as.accessibilityStandardName === i.name).length);
        case 'ics':
          return items.filter((i) => !this.listing.ics.parents.filter((l) => l.chplProductNumber === i.chplProductNumber).length);
        case 'qmsStandards':
          return items.filter((i) => !this.listing.qmsStandards.filter((qs) => qs.qmsStandardName === i.name).length);
        case 'targetedUsers':
          return items.filter((i) => !this.listing.targetedUsers.filter((tu) => tu.targetedUserName === i.name).length);
        default:
          this.$log.error('filter', type, items);
      }
    }

    removeItem(type, item) {
      switch (type) {
        case 'accessibilityStandards':
          this.listing.accessibilityStandards = this.listing.accessibilityStandards.filter((l) => l.accessibilityStandardName !== item.accessibilityStandardName);
          break;
        case 'ics':
          this.listing.ics.parents = this.listing.ics.parents.filter((l) => l.chplProductNumber !== item.chplProductNumber);
          break;
        case 'meaningfulUseUserHistory':
          this.listing.meaningfulUseUserHistory = this.listing.meaningfulUseUserHistory.filter((event) => event.muuDateObject.getTime() !== item.muuDateObject.getTime());
          break;
        case 'qmsStandards':
          this.listing.qmsStandards = this.listing.qmsStandards.filter((l) => l.qmsStandardName !== item.qmsStandardName);
          break;
        case 'targetedUsers':
          this.listing.targetedUsers = this.listing.targetedUsers.filter((l) => l.targetedUserName !== item.targetedUserName);
          break;
        default:
          this.$log.error('remove', type, item);
      }
      this.update();
    }

    saveNewItem(type) {
      switch (type) {
        case 'accessibilityStandards':
          this.addNewValue(this.listing.accessibilityStandards, this.newItem[type]);
          this.listing.accessibilityStandards = this.listing.accessibilityStandards.sort((a, b) => (a.accessibilityStandardName < b.accessibilityStandardName ? -1 : a.accessibilityStandardName > b.accessibilityStandardName ? 1 : 0));
          break;
        case 'ics':
          this.addNewValue(this.listing.ics.parents, this.newItem[type]);
          this.listing.ics.parents = this.listing.ics.parents.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
          break;
        case 'meaningfulUseUserHistory':
          this.listing.meaningfulUseUserHistory.push({
            muuCount: this.newItem[type].muuCount,
            muuDateObject: this.newItem[type].muuDateObject,
          });
          break;
        case 'qmsStandards':
          this.addNewValue(this.listing.qmsStandards, this.newItem[type]);
          this.listing.qmsStandards = this.listing.qmsStandards.sort((a, b) => (a.qmsStandardName < b.qmsStandardName ? -1 : a.qmsStandardName > b.qmsStandardName ? 1 : 0));
          break;
        case 'targetedUsers':
          this.addNewValue(this.listing.targetedUsers, this.newItem[type]);
          this.listing.targetedUsers = this.listing.targetedUsers.sort((a, b) => (a.targetedUserName < b.targetedUserName ? -1 : a.targetedUserName > b.targetedUserName ? 1 : 0));
          break;
        default:
          this.$log.error('add', type);
      }
      this.cancelNewItem(type);
      this.update();
    }

    /// /////////////////////////////////////////////////////////////////

    checkC(cqm, num) {
      let ret;
      if (angular.isUndefined(cqm[`hasC${num}`])) {
        ret = false;
        if (cqm.criteria) {
          for (let i = 0; i < cqm.criteria.length; i++) {
            ret = ret || (cqm.criteria[i].certificationNumber === `170.315 (c)(${num})`);
          }
        }
      } else {
        ret = cqm[`hasC${num}`];
      }
      return ret;
    }
  },
};

export { ListingDetailsEditComponent as default };

angular.module('chpl.components')
  .component('chplListingDetailsEdit', ListingDetailsEditComponent);
