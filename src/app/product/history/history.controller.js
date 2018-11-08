(function () {
    'use strict';

    angular
        .module('chpl.product')
        .controller('ProductHistoryController', ProductHistoryController);

    /** @ngInject */
    function ProductHistoryController ($filter, $location, $log, $uibModalInstance, activity, utilService) {
        var vm = this;

        vm.cancel = cancel;
        vm.goToApi = goToApi;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.activity = activity;
            _interpretActivity();
            vm.activity = vm.activity.filter(function (a) { return a.change && a.change.length > 0; });
        }

        function cancel () {
            $uibModalInstance.dismiss('product history cancelled');
        }

        function goToApi () {
            $location.path('/resources/chpl_api');
            vm.cancel();
        }

        ////////////////////////////////////////////////////////////////////

        // Exposing helper functions for testing purposes
        vm._interpretCertificationStatusChanges = _interpretCertificationStatusChanges;
        vm._interpretMuuHistory = _interpretMuuHistory;

        function _interpretActivity () {
            var activity, curr, prev, statusIndex;
            statusIndex = -1;
            for (var i = 0; i < vm.activity.length; i++) {
                activity = vm.activity[i];
                activity.change = [];
                prev = activity.originalData;
                curr = activity.newData;
                if (prev) {
                    vm.listingId = prev.id;
                } else {
                    vm.listingId = curr.id;
                }
                if (activity.description.startsWith('Updated certified product')) {
                    statusIndex = i;
                    _interpretCertificationCriteria(prev, curr, activity);
                    _interpretCqms(prev, curr, activity);
                    _interpretListingChange(prev, curr, activity);
                } else if (activity.description === 'Created a certified product') {
                    statusIndex = i;
                    activity.change.push('Certified product was uploaded to the CHPL');
                } else if (activity.description.startsWith('Surveillance was added')) {
                    statusIndex = i;
                    activity.change.push('Surveillance activity was added');
                } else if (activity.description.startsWith('Surveillance was updated')) {
                    statusIndex = i;
                    activity.change.push('Surveillance activity was updated');
                } else if (activity.description.startsWith('Surveillance was delete')) {
                    statusIndex = i;
                    activity.change.push('Surveillance activity was deleted');
                }
            }
            if (statusIndex !== -1) {
                _interpretCertificationStatusChanges(vm.activity[statusIndex]);
                _interpretMuuHistory(vm.activity[statusIndex]);
            }
        }

        function _interpretCertificationCriteria (prev, curr, activity) {
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
                var measures = utilService.arrayCompare(pCC[i].g1MacraMeasures,cCC[i].g1MacraMeasures);
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
                measures = utilService.arrayCompare(pCC[i].g2MacraMeasures,cCC[i].g2MacraMeasures);
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

        function _interpretCertificationStatusChanges (activity) {
            var ce = activity.newData.certificationEvents;
            vm.activity = vm.activity.concat(
                ce.filter(function (e) {
                    return !e.eventTypeId || e.eventTypeId === 1;
                }).map(function (e) {
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

        function _interpretMuuHistory (activity) {
            if (activity.newData.meaningfulUseUserHistory && activity.newData.meaningfulUseUserHistory.length > 0) {
                vm.activity = vm.activity.concat(
                    activity.newData.meaningfulUseUserHistory
                        .sort((a, b) => a.muuDate - b.muuDate)
                        .map((item, idx, arr) => {
                            if (idx > 0) {
                                item.activityDate = parseInt(item.muuDate, 10);
                                item.change = ['Estimated number of Meaningful Use Users changed from ' + arr[idx - 1].muuCount
                                               + ' to ' + item.muuCount + ' on ' + $filter('date')(item.muuDate, 'mediumDate')];
                            } else {
                                item.activityDate = parseInt(item.muuDate, 10);
                                item.change = ['Estimated number of Meaningful Use Users became ' + item.muuCount + ' on ' + $filter('date')(item.muuDate, 'mediumDate')];
                            }
                            return item;
                        })
                );
            }
        }

        function _interpretCqms (prev, curr, activity) {
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
                var criteria = _compareArray(pCqms[i].criteria, cCqms[i].criteria, 'certificationNumber');
                for (j = 0; j < criteria.length; j++) {
                    obj.changes.push('<li>Certification Criteria "' + criteria[j].name + '" changes<ul>' + criteria[j].changes.join('') + '</ul></li>');
                }
                if (obj.changes.length > 0) {
                    activity.change.push(obj.cmsId + ' changes:<ul>' + obj.changes.join('') + '</ul>');
                }
            }
        }

        function _interpretListingChange (prev, curr, activity) {
            if (prev.chplProductNumber !== curr.chplProductNumber) {
                activity.change.push('CHPL Product Number changed from ' + prev.chplProductNumber + ' to ' + curr.chplProductNumber);
            }
        }

        function _compareArray (prev, curr, root) {
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
    }
})();
