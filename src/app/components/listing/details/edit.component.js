export const ListingDetailsEditComponent = {
    templateUrl: 'chpl.components/listing/details/edit.html',
    bindings: {
        listing: '<',
        initialPanel: '@',
        isConfirming: '<',
        onChange: '&',
        resources: '<',
    },
    controller: class ListingDetailsEditComponent {
        constructor ($analytics, $log, $uibModal, featureFlags, networkService, utilService) {
            this.$analytics = $analytics;
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.networkService = networkService;
            this.utilService = utilService;
            this.muuCount = utilService.muuCount;
            this.sortCerts = utilService.sortCert;
            this.handlers = [];
            this.isOn = featureFlags.isOn;
            this.drStatus = 'pending';
            this.viewAllCerts = true;
            this.panelShown = 'cert';
        }

        $onInit () {
            if (this.initialPanel) {
                if (this.initialPanel !== 'none') {
                    this.panelShown = this.initialPanel;
                } else {
                    this.panelShown = undefined;
                }
            }
        }

        $onChanges (changes) {
            if (changes.listing && changes.listing.currentValue) {
                this.listing = angular.copy(changes.listing.currentValue);
                this.countCerts = this.listing.countCerts;
                this.countCqms = this.listing.countCqms;
                this.cqms = this.listing.cqmResults;
                this.prepCqms();
            }
            if (changes.resources && changes.resources.currentValue) {
                this.resources = angular.copy(changes.resources.currentValue);
            }
            if (this.listing && this.resources) {
                this.prepareFields();
            }
        }

        addPreviousMuu () {
            this.listing.meaningfulUseUserHistory.push({
                muuDateObject: new Date(),
                muuCount: 0,
            });
        }

        disabledParent (listing) {
            return this.listing.ics.parents
                .reduce((disabled, current) => disabled || current.chplProductNumber === listing.chplProductNumber, !!(this.listing.chplProductNumber === listing.chplProductNumber));
        }

        hasEdited () {
            angular.forEach(this.handlers, function (handler) {
                handler();
            });
            this.onChange({listing: this.listing});
        }

        missingIcsSource () {
            return this.listing.certificationEdition.name === '2015' && this.listing.ics.inherits && this.listing.ics.parents.length === 0;
        }

        matchesPreviousMuuDate (muu) {
            let orderedMuu = this.$filter('orderBy')(this.listing.meaningfulUseUserHistory, 'muuDateObject');
            let muuLoc = orderedMuu.indexOf(muu);
            if (muuLoc > 0) {
                return (this.$filter('date')(muu.muuDateObject, 'mediumDate', 'UTC') === this.$filter('date')(orderedMuu[muuLoc - 1].muuDateObject, 'mediumDate', 'UTC'));
            }
            return false;
        }

        prepareFields () {
            if (angular.isUndefined(this.listing.ics.parents)) {
                this.listing.ics.parents = [];
            }
            if (this.listing.meaningfulUseUserHistory && this.listing.meaningfulUseUserHistory.length > 0) {
                this.listing.meaningfulUseUserHistory = this.listing.meaningfulUseUserHistory.map(muu => {
                    muu.muuDateObject = new Date(muu.muuDate);
                    return muu;
                });
            } else {
                this.listing.meaningfulUseUserHistory = [];
            }

            if (this.listing.product && this.listing.product.productId && this.listing.certificationEdition.name === '2015') {
                let that = this;
                this.networkService.getRelatedListings(this.listing.product.productId)
                    .then(family => that.relatedListings = family.filter(item => item.edition === '2015'));
            }
        }

        prepCqms () {
            if (this.cqms) {
                this.cqms = this.cqms.map((cqm, idx) => {
                    cqm.id = idx;
                    for (var j = 1; j < 5; j++) {
                        cqm['hasC' + j] = this.checkC(cqm, j);
                    }
                    cqm.allVersions.sort((a, b) => {
                        let aVal = parseInt(a.substring(1), 10);
                        let bVal = parseInt(b.substring(1), 10);
                        return aVal - bVal;
                    });
                    cqm.successVersions.sort((a, b) => {
                        let aVal = parseInt(a.substring(1), 10);
                        let bVal = parseInt(b.substring(1), 10);
                        return aVal - bVal;
                    });
                    return cqm;
                });
            }
        }

        registerSed (handler) {
            let that = this;
            this.handlers.push(handler);
            var removeHandler = function () {
                that.handlers = that.handlers.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
        }

        removePreviousMuu (muuDateObject) {
            this.listing.meaningfulUseUserHistory = this.listing.meaningfulUseUserHistory.filter(muu => muu.muuDateObject.getTime() !== muuDateObject.getTime());
        }

        saveCert (cert) {
            for (let i = 0; i < this.listing.certificationResults.length; i++) {
                if (this.listing.certificationResults[i].number === cert.number
                    && this.listing.certificationResults[i].title === cert.title) {
                    this.listing.certificationResults[i] = cert;
                }
            }
            this.updateCs();
        }

        sedChange (listing) {
            this.onChange({listing: listing});
        }

        sortCqms (cqm) {
            var ret = 0;
            if (cqm.cmsId) {
                ret = parseInt(cqm.cmsId.substring(3), 10);
            } else {
                ret = parseInt(cqm.nqfNumber, 10);
            }
            return ret;
        }

        showPanel (panel) {
            this.panelShown = this.panelShown === panel ? '' : panel;
        }

        showSubPanel (panel) {
            this.subPanelShown = this.subPanelShown === panel ? '' : panel;
        }

        updateAdditional () {
            this.onChange({listing: this.listing});
        }

        updateCs () {
            this.cqms.forEach(cqm => {
                cqm.criteria = [];
                if (cqm.success || cqm.successVersions.length > 0) {
                    for (var j = 1; j < 5; j++) {
                        if (cqm['hasC' + j]) {
                            let number = '170.315 (c)(' + j + ')';
                            cqm.criteria.push({
                                certificationNumber: number,
                            });
                        }
                    }
                }
            });
            this.listing.cqmResults = angular.copy(this.cqms);
            this.onChange({listing: this.listing});
        }

        ////////////////////////////////////////////////////////////////////

        checkC (cqm, num) {
            var ret;
            if (angular.isUndefined(cqm['hasC' + num])) {
                ret = false;
                if (cqm.criteria) {
                    for (var i = 0; i < cqm.criteria.length; i++) {
                        ret = ret || (cqm.criteria[i].certificationNumber === '170.315 (c)(' + num + ')');
                    }
                }
            } else {
                ret = cqm['hasC' + num];
            }
            return ret;
        }
    },
};

angular.module('chpl.components')
    .component('chplListingDetailsEdit', ListingDetailsEditComponent);
