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
    constructor($analytics, $filter, $log, $uibModal, DateUtil, featureFlags, networkService, utilService) {
      this.$analytics = $analytics;
      this.$filter = $filter;
      this.$log = $log;
      this.$uibModal = $uibModal;
      this.DateUtil = DateUtil;
      this.networkService = networkService;
      this.utilService = utilService;
      this.addNewValue = utilService.addNewValue;
      this.sortCerts = utilService.sortCert;
      this.handlers = [];
      this.isOn = featureFlags.isOn;
      this.drStatus = 'pending';
      this.viewAllCerts = true;
      this.panelShown = 'cert';
      this.newItem = {};
      this.addingItem = {};
      this.creatingItem = {};
      this.relatedListings = [];

      this.handleCriteriaSave = this.handleCriteriaSave.bind(this);
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

    matchesPreviousPIDate(item) {
      const orderedPI = this.listing.promotingInteroperabilityUserHistory.sort((a, b) => (a.userCountDate < b.userCountDate ? -1 : 1));
      const itemLoc = orderedPI.indexOf(item);
      if (itemLoc > 0) {
        return orderedPI[itemLoc - 1].userCountDate === item.userCountDate;
      }
      return false;
    }

    prepareFields() {
      if (angular.isUndefined(this.listing.ics.parents)) {
        this.listing.ics.parents = [];
      }
      if (!this.listing.promotingInteroperabilityUserHistory?.length > 0) {
        this.listing.promotingInteroperabilityUserHistory = [];
      }

      if (this.listing.product && this.listing.product.productId && this.listing.certificationEdition.name === '2015' && (!this.relatedListings || this.relatedListings.length === 0)) {
        const that = this;
        this.networkService.getRelatedListings(this.listing.product.productId)
          .then((family) => that.relatedListings = family.filter((item) => item.edition === '2015' && item.id !== that.listing.id));
      }

      this.resources.testStandards.data = this.resources.testStandards.data.filter((ts) => ts.year === this.listing.certificationEdition.name);
    }

    prepCqms() {
      if (this.cqms) {
        this.cqms = this.cqms.map((cqm, idx) => {
          const ret = { ...cqm, id: idx };
          for (let j = 1; j < 5; j += 1) {
            ret[`hasC${j}`] = this.checkC(cqm, j);
          }
          ret.allVersions.sort((a, b) => {
            const aVal = parseInt(a.substring(1), 10);
            const bVal = parseInt(b.substring(1), 10);
            return aVal - bVal;
          });
          ret.successVersions.sort((a, b) => {
            const aVal = parseInt(a.substring(1), 10);
            const bVal = parseInt(b.substring(1), 10);
            return aVal - bVal;
          });
          return ret;
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
      for (let i = 0; i < this.listing.certificationResults.length; i += 1) {
        if (this.listing.certificationResults[i].number === cert.number
                    && this.listing.certificationResults[i].title === cert.title) {
          this.listing.certificationResults[i] = cert;
        }
      }
      this.updateCs();
    }

    handleCriteriaSave(criteria) {
      this.listing.certificationResults = criteria;
      this.hasEdited();
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
      this.cqms = this.cqms.map((cqm) => {
        const ret = { ...cqm, criteria: [] };
        if (cqm.success || cqm.successVersions.length > 0) {
          for (let j = 1; j < 5; j += 1) {
            if (cqm[`hasC${j}`]) {
              const number = `170.315 (c)(${j})`;
              ret.criteria.push({
                certificationNumber: number,
              });
            }
          }
        }
        return ret;
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
          // no default
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
        case 'promotingInteroperabilityUserHistory':
          this.listing.promotingInteroperabilityUserHistory = this.listing.promotingInteroperabilityUserHistory.filter((event) => (event.userCount !== item.userCount || event.userCountDate !== item.userCountDate));
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
        case 'promotingInteroperabilityUserHistory':
          this.addNewValue(this.listing.promotingInteroperabilityUserHistory, {
            ...this.newItem[type],
            userCountDate: this.DateUtil.timestampToString((new Date(this.newItem[type].userCountDate)).getTime(), 'yyyy-MM-dd'),
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
          for (let i = 0; i < cqm.criteria.length; i += 1) {
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
