export const ListingHistoryComponent = {
    templateUrl: 'chpl.listing/history/history.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&',
    },
    controller: class ListingHistoryComponent {
        constructor ($filter, $location, $log, $q, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$location = $location;
            this.$q = $q;
            this.$log = $log;
            this.networkService = networkService;
            this.utilService = utilService;
            this.activity = [];
        }

        $onInit () {
            let that = this;
            this.listing = angular.copy(this.resolve.listing);
            this._interpretCertificationStatusChanges();
            this._interpretMuuHistory();
            this.networkService.getSingleListingActivityMetadata(this.listing.id).then(response => {
                let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretActivity(response)));
                that.$q.all(promises)
                    .then(response => {
                        that.activity = that.activity
                            .concat(response)
                            .filter(a => a.change && a.change.length > 0);
                    });
            });
            this.networkService.getSingleVersionActivityMetadata(this.listing.version.versionId).then(response => {
                let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretVersion(response)));
                that.$q.all(promises)
                    .then(response => {
                        that.activity = that.activity
                            .concat(response)
                            .filter(a => a.change && a.change.length > 0);
                    });
            });
            this.networkService.getSingleProductActivityMetadata(this.listing.product.productId).then(response => {
                let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretProduct(response)));
                that.$q.all(promises)
                    .then(response => {
                        that.activity = that.activity
                            .concat(response)
                            .filter(a => a.change && a.change.length > 0);
                    });
            });
            this.networkService.getSingleDeveloperActivityMetadata(this.listing.developer.developerId).then(response => {
                let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretDeveloper(response)));
                that.$q.all(promises)
                    .then(response => {
                        that.activity = that.activity
                            .concat(response)
                            .filter(a => a.change && a.change.length > 0);
                    });
            });
        }

        cancel () {
            this.dismiss();
        }

        goToApi () {
            this.$location.path('/resources/chpl-api');
            this.cancel();
        }

        _interpretActivity (activity) {
            var curr, prev;
            activity.change = [];
            prev = activity.originalData;
            curr = activity.newData;
            if (activity.description.startsWith('Updated certified product')) {
                this._interpretCertificationCriteria(prev, curr, activity);
                this._interpretCqms(prev, curr, activity);
                this._interpretListingChange(prev, curr, activity);
            } else if (activity.description === 'Created a certified product') {
                activity.change.push('Certified product was uploaded to the CHPL');
            } else if (activity.description.startsWith('Surveillance was added')) {
                activity.change.push('Surveillance activity was added');
            } else if (activity.description.startsWith('Surveillance was updated')) {
                activity.change.push('Surveillance activity was updated');
            } else if (activity.description.startsWith('Surveillance was delete')) {
                activity.change.push('Surveillance activity was deleted');
            }
            return activity;
        }

        _interpretCertificationCriteria (prev, curr, activity) {
            var pCC = prev.certificationResults;
            var cCC = curr.certificationResults;
            var i, j;

            pCC.sort(function (a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
            cCC.sort(function (a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
            for (i = 0; i < pCC.length; i++) {
                var obj = { criteria: pCC[i].number, changes: [] };

                // Became certified to a criteria
                if (!pCC[i].success && cCC[i].success) {
                    obj.changes.push('<li>Certification Criteria was added</li>');
                }

                // Added/removed G1 or G2 success
                if (pCC[i].g1Success !== cCC[i].g1Success) {
                    obj.changes.push('<li>Certification Criteria became ' + (cCC[i].g1Success ? 'Certified to' : 'Decertified from') + ' G1</li>');
                }
                if (pCC[i].g2Success !== cCC[i].g2Success) {
                    obj.changes.push('<li>Certification Criteria became ' + (cCC[i].g2Success ? 'Certified to' : 'Decertified from') + ' G2</li>');
                }

                // Change to G1/G2 Macra Measures
                var measures = this.utilService.arrayCompare(pCC[i].g1MacraMeasures,cCC[i].g1MacraMeasures);
                if (measures.added.length > 0) {
                    obj.changes.push('<li>Added G1 MACRA Measure' + (measures.added.length > 1 ? 's' : '') + ':<ul>');
                    for (j = 0; j < measures.added.length; j++) {
                        obj.changes.push('<li>' + measures.added[j].abbreviation + '</li>');
                    }
                    obj.changes.push('</ul></li>');
                }
                if (measures.removed.length > 0) {
                    obj.changes.push('<li>Removed G1 MACRA Measure' + (measures.removed.length > 1 ? 's' : '') + ':<ul>');
                    for (j = 0; j < measures.removed.length; j++) {
                        obj.changes.push('<li>' + measures.removed[j].abbreviation + '</li>');
                    }
                    obj.changes.push('</ul></li>');
                }
                measures = this.utilService.arrayCompare(pCC[i].g2MacraMeasures,cCC[i].g2MacraMeasures);
                if (measures.added.length > 0) {
                    obj.changes.push('<li>Added G2 MACRA Measure' + (measures.added.length > 1 ? 's' : '') + ':<ul>');
                    for (j = 0; j < measures.added.length; j++) {
                        obj.changes.push('<li>' + measures.added[j].abbreviation + '</li>');
                    }
                    obj.changes.push('</ul></li>');
                }
                if (measures.removed.length > 0) {
                    obj.changes.push('<li>Removed G2 MACRA Measure' + (measures.removed.length > 1 ? 's' : '') + ':<ul>');
                    for (j = 0; j < measures.removed.length; j++) {
                        obj.changes.push('<li>' + measures.removed[j].abbreviation + '</li>');
                    }
                    obj.changes.push('</ul></li>');
                }

                if (obj.changes.length > 0) {
                    activity.change.push(obj.criteria + ' changes:<ul>' + obj.changes.join('') + '</ul>');
                }
            }
        }

        _interpretCertificationStatusChanges () {
            var ce = this.listing.certificationEvents;
            this.activity = this.activity.concat(
                ce.filter(e => !e.eventTypeId || e.eventTypeId === 1)
                    .map(e => {
                        e.activityDate = parseInt(e.eventDate, 10);
                        if (e.eventTypeId && e.eventTypeId === 1) {
                            e.change = ['Certification Status became "Active"'];
                        } else if (e.certificationStatusName) {
                            e.change = ['Certification Status became "' + e.certificationStatusName + '"'];
                        } else if (e.status) {
                            e.change = ['Certification Status became "' + e.status.name + '"'];
                        } else {
                            e.change = ['Undetermined change'];
                        }
                        return e;
                    }));
        }

        _interpretMuuHistory () {
            if (this.listing.meaningfulUseUserHistory && this.listing.meaningfulUseUserHistory.length > 0) {
                this.activity = this.activity.concat(
                    this.listing.meaningfulUseUserHistory
                        .sort((a, b) => a.muuDate - b.muuDate)
                        .map((item, idx, arr) => {
                            if (idx > 0) {
                                item.activityDate = parseInt(item.muuDate, 10);
                                item.change = ['Estimated number of Meaningful Use Users changed from ' + arr[idx - 1].muuCount
                                               + ' to ' + item.muuCount + ' on ' + this.$filter('date')(item.muuDate, 'mediumDate')];
                            } else {
                                item.activityDate = parseInt(item.muuDate, 10);
                                item.change = ['Estimated number of Meaningful Use Users became ' + item.muuCount + ' on ' + this.$filter('date')(item.muuDate, 'mediumDate')];
                            }
                            return item;
                        })
                );
            }
        }

        _interpretCqms (prev, curr, activity) {
            var pCqms = prev.cqmResults;
            var cCqms = curr.cqmResults;
            pCqms.sort(function (a,b) {return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0);} );
            cCqms.sort(function (a,b) {return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0);} );
            var i, j;
            for (i = 0; i < pCqms.length; i++) {
                var obj = { cmsId: pCqms[i].cmsId, changes: [] };
                if (pCqms[i].success !== cCqms[i].success) {
                    if (pCqms[i].success) {
                        obj.changes.push('<li>CQM became "False"</li>');
                    } else {
                        obj.changes.push('<li>CQM became "True"</li>');
                    }
                }
                for (j = 0; j < pCqms[i].allVersions.length; j++) {
                    if (pCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) < 0 && cCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) >= 0) {
                        obj.changes.push('<li>' + pCqms[i].allVersions[j] + ' added</li>');
                    }
                    if (pCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) >= 0 && cCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) < 0) {
                        obj.changes.push('<li>' + pCqms[i].allVersions[j] + ' removed</li>');
                    }
                }
                var criteria = this._compareArray(pCqms[i].criteria, cCqms[i].criteria, 'certificationNumber');
                for (j = 0; j < criteria.length; j++) {
                    obj.changes.push('<li>Certification Criteria "' + criteria[j].name + '" changes<ul>' + criteria[j].changes.join('') + '</ul></li>');
                }
                if (obj.changes.length > 0) {
                    activity.change.push(obj.cmsId + ' changes:<ul>' + obj.changes.join('') + '</ul>');
                }
            }
        }

        _interpretListingChange (prev, curr, activity) {
            if (prev.chplProductNumber !== curr.chplProductNumber) {
                activity.change.push('CHPL Product Number changed from ' + prev.chplProductNumber + ' to ' + curr.chplProductNumber);
            }
        }

        _interpretDeveloper (activity) {
            var curr, prev;
            activity.change = [];
            prev = activity.originalData;
            curr = activity.newData;
            if (activity.description.startsWith('Developer ')) {
                if (prev && prev.name !== curr.name) {
                    activity.change.push('Developer changed from ' + prev.name + ' to ' + curr.name);
                }
            } else if (activity.description.startsWith('Merged ')) {
                activity.change.push('Merged Developers ' + prev.map(d => d.name).join(', ') + ' to make Developer ' + curr.name);
                let that = this;
                prev.forEach(v => {  // look at history of "parent" Developers
                    that.networkService.getSingleDeveloperActivityMetadata(v.id).then(response => {
                        let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretDeveloper(response)));
                        that.$q.all(promises)
                            .then(response => {
                                that.activity = that.activity
                                    .concat(response)
                                    .filter(a => a.change && a.change.length > 0);
                            });
                    });
                });
            }
            return activity;
        }

        _interpretProduct (activity) {
            var curr, prev;
            activity.change = [];
            prev = activity.originalData;
            curr = activity.newData;
            if (activity.description.startsWith('Product ')) {
                if (prev && prev.name !== curr.name) {
                    activity.change.push('Product changed from ' + prev.name + ' to ' + curr.name);
                }
            } else if (activity.description.startsWith('Merged ')) {
                activity.change.push('Merged Products ' + prev.map(p => p.name).join(', ') + ' to make Product ' + curr.name);
                let that = this;
                prev.forEach(v => {  // look at history of "parent" Products
                    that.networkService.getSingleProductActivityMetadata(v.id).then(response => {
                        let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretProduct(response)));
                        that.$q.all(promises)
                            .then(response => {
                                that.activity = that.activity
                                    .concat(response)
                                    .filter(a => a.change && a.change.length > 0);
                            });
                    });
                });
            }
            return activity;
        }

        _interpretVersion (activity) {
            let curr, prev;
            activity.change = [];
            prev = activity.originalData;
            curr = activity.newData;
            if (activity.description.startsWith('Product Version ')) {
                if (prev && prev.version !== curr.version) {
                    activity.change.push('Version changed from ' + prev.version + ' to ' + curr.version);
                }
            } else if (activity.description.startsWith('Merged ')) {
                activity.change.push('Merged Versions ' + prev.map(v => v.version).join(', ') + ' to make Version ' + curr.version);
                let that = this;
                prev.forEach(v => {  // look at history of "parent" Versions
                    that.networkService.getSingleVersionActivityMetadata(v.id).then(response => {
                        let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretVersion(response)));
                        that.$q.all(promises)
                            .then(response => {
                                that.activity = that.activity
                                    .concat(response)
                                    .filter(a => a.change && a.change.length > 0);
                            });
                    });
                });
            }
            return activity;
        }

        _compareArray (prev, curr, root) {
            var ret = [];
            var i, j;
            for (i = 0; i < prev.length; i++) {
                for (j = 0; j < curr.length; j++) {
                    if (prev[i][root] === curr[j][root]) {
                        prev[i].evaluated = true;
                        curr[j].evaluated = true;
                    }
                }
                if (!prev[i].evaluated) {
                    ret.push({ name: prev[i][root], changes: ['<li>' + prev[i][root] + ' removed</li>']});
                }
            }
            for (i = 0; i < curr.length; i++) {
                if (!curr[i].evaluated) {
                    ret.push({ name: curr[i][root], changes: ['<li>' + curr[i][root] + ' added</li>']});
                }
            }
            return ret;
        }
    },
}

angular
    .module('chpl.listing')
    .component('chplListingHistory', ListingHistoryComponent);
