;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CertsController', ['$scope', '$log', function ($scope, $log) {
            var vm = this;

            vm.addIds = addIds;
            vm.hasC1 = hasC1;
            vm.hasC2 = hasC2;
            vm.saveEdits = saveEdits;
            vm.sortCerts = sortCerts;
            vm.sortCqms = sortCqms;
            vm.showDetails = showDetails;
            vm.showPanel = showPanel;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                if (vm.isEditing === undefined) {
                    vm.isEditing = false;
                }
                if (vm.viewAllCerts === undefined) {
                    vm.viewAllCerts = false;
                }
                vm.editCqms = {};
                vm.addIds();
                vm.panelShown = 'cert';
                if (vm.isEditing) {
                    attachBooleans();
                }
            }

            $scope.$watch('cqms', function (newCqms) {
                if (newCqms) {
                    vm.cqms = newCqms;
                    vm.addIds();
                }}, true);

            function addIds () {
                if (vm.cqms) {
                    for (var i = 0; i < vm.cqms.length; i++) {
                        vm.cqms[i].id = i;
                    }
                }
            }

            function hasC1 (cqm) {
                for (var i = 0; i < cqm.criteria.length; i++) {
                    if (cqm.criteria[i].certificationNumber === '170.315 (c)(1)') {
                        return true;
                    }
                }
                return false;
            }

            function hasC2 (cqm) {
                for (var i = 0; i < cqm.criteria.length; i++) {
                    if (cqm.criteria[i].certificationNumber === '170.315 (c)(2)') {
                        return true;
                    }
                }
                return false;
            }

            function saveEdits () {
                vm.countCerts = 0;
                vm.countCqms = 0;

                var changedTasks = [];
                var changedParticipants = [];

                for (var i = 0; i < vm.certs.length; i++) {
                    if (vm.certs[i].success) {
                        vm.countCerts += 1;
                    }
                    if (vm.certs[i].gap === 'null') {
                        delete (vm.certs[i].gap);
                    }
                    if (vm.certs[i].g1Success === 'null') {
                        delete (vm.certs[i].g1Success);
                    }
                    if (vm.certs[i].g2Success === 'null') {
                        delete (vm.certs[i].g2Success);
                    }
                    if (vm.certs[i].sed === 'null') {
                        delete (vm.certs[i].sed);
                    }
                    if (vm.certs[i].sed && vm.certs[i].testTasks) {
                        for (var j = 0; j < vm.certs[i].testTasks.length; j++) {
                            if (vm.certs[i].testTasks[j].changed) {
                                changedTasks.push(vm.certs[i].testTasks[j]);
                            }
                            if (vm.certs[i].testTasks[j].testParticipants) {
                                for (var k = 0; k < vm.certs[i].testTasks[j].testParticipants.length; k++) {
                                    if (vm.certs[i].testTasks[j].testParticipants[k].changed) {
                                        changedParticipants.push(vm.certs[i].testTasks[j].testParticipants[k]);
                                    }
                                }
                            }
                        }
                    }
                }
                //$log.debug('cd', changedTasks, changedParticipants);

                for (var i = 0; i < vm.certs.length; i++) {
                    if (vm.certs[i].sed && vm.certs[i].testTasks) {
                        for (var j = 0; j < vm.certs[i].testTasks.length; j++) {
                            for (var k = 0; i < changedTasks.length; i++) {
                                if (vm.certs[i].testTasks[j].testTaskId === changedTasks[k].testTaskId && !vm.certs[i].testTasks[j].changed && vm.certs[i].testTasks[j].testTaskId) {
                                    //$log.debug('equal task', vm.certs[i].testTasks[j], changedTasks[k]);
                                    vm.certs[i].testTasks[j].description = changedTasks[k].description;
                                    vm.certs[i].testTasks[j].taskErrors = changedTasks[k].taskErrors;
                                    vm.certs[i].testTasks[j].taskErrorsStddev = changedTasks[k].taskErrorsStddev;
                                    vm.certs[i].testTasks[j].taskPathDeviationObserved = changedTasks[k].taskPathDeviationObserved;
                                    vm.certs[i].testTasks[j].taskPathDeviationOptimal = changedTasks[k].taskPathDeviationOptimal;
                                    vm.certs[i].testTasks[j].taskRating = changedTasks[k].taskRating;
                                    vm.certs[i].testTasks[j].taskRatingScale = changedTasks[k].taskRatingScale;
                                    vm.certs[i].testTasks[j].taskSuccessAverage = changedTasks[k].taskSuccessAverage;
                                    vm.certs[i].testTasks[j].taskSuccessStddev = changedTasks[k].taskSuccessStddev;
                                    vm.certs[i].testTasks[j].taskTimeAvg = changedTasks[k].taskTimeAvg;
                                    vm.certs[i].testTasks[j].taskTimeDeviationObservedAvg = changedTasks[k].taskTimeDeviationObservedAvg;
                                    vm.certs[i].testTasks[j].taskTimeDeviationOptimalAvg = changedTasks[k].taskTimeDeviationOptimalAvg;
                                    vm.certs[i].testTasks[j].taskTimeStddev = changedTasks[k].taskTimeStddev;
                                    vm.certs[i].testTasks[j].testTaskId = changedTasks[k].testTaskId;
                                }
                            }
                            if (vm.certs[i].testTasks[j].testParticipants) {
                                for (var k = 0; k < vm.certs[i].testTasks[j].testParticipants.length; k++) {
                                    for (var l = 0; l < changedParticipants.length; l++) {
                                        if (vm.certs[i].testTasks[j].testParticipants[k].testParticipantId === changedParticipants[l].testParticipantId && !vm.certs[i].testTasks[j].testParticipants[k].changed && vm.certs[i].testTasks[j].testParticipants[k].testParticipantId) {
                                            //$log.debug('equal participant', vm.certs[i].testTasks[j].testParticipants[k], changedParticipants[l]);

                                            vm.certs[i].testTasks[j].testParticipants[k].ageRange = changedParticipants[l].ageRange;
                                            vm.certs[i].testTasks[j].testParticipants[k].ageRangeId = changedParticipants[l].ageRangeId;
                                            vm.certs[i].testTasks[j].testParticipants[k].assistiveTechnologyNeeds = changedParticipants[l].assistiveTechnologyNeeds;
                                            vm.certs[i].testTasks[j].testParticipants[k].computerExperienceMonths = changedParticipants[l].computerExperienceMonths;
                                            vm.certs[i].testTasks[j].testParticipants[k].educationTypeId = changedParticipants[l].educationTypeId;
                                            vm.certs[i].testTasks[j].testParticipants[k].educationTypeName = changedParticipants[l].educationTypeName;
                                            vm.certs[i].testTasks[j].testParticipants[k].gender = changedParticipants[l].gender;
                                            vm.certs[i].testTasks[j].testParticipants[k].occupation = changedParticipants[l].occupation;
                                            vm.certs[i].testTasks[j].testParticipants[k].productExperienceMonths = changedParticipants[l].productExperienceMonths;
                                            vm.certs[i].testTasks[j].testParticipants[k].professionalExperienceMonths = changedParticipants[l].professionalExperienceMonths;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                for (var i = 0; i < vm.cqms.length; i++) {
                    if (vm.cqms[i].success || vm.cqms[i].successVersions.length > 0) {
                        vm.countCqms += 1;
                    }
                }
            }

            function sortCerts (cert) {
                var ret = 0;
                if (cert.number) {
                    var letter;
                    var number;
                    letter = cert.number.substring(9,10);
                    if (cert.number.substring(0,6) === '170.30') {
                        number = cert.number.substring(6,7);
                        ret = parseInt(number) * 100 + letter.charCodeAt(0);
                    } else {
                        number = cert.number.substring(12,14);
                        if (number.substring(1,2) === ')')
                            number = number.substring(0,1);
                        ret = letter.charCodeAt(0) * 100 + parseInt(number);
                    }
                }
                return ret;
            }

            function sortCqms (cqm) {
                var ret = 0;
                if (cqm.cmsId) {
                    ret = parseInt(cqm.cmsId.substring(3));
                } else {
                    ret = parseInt(cqm.nqfNumber);
                }
                return ret;
            }

            function showDetails (number) {
                vm.certDetails = vm.certDetails === number ? '' : number;
                vm.showSed = false;
            }

            function showPanel (panel) {
                vm.panelShown = vm.panelShown === panel ? '' : panel;
            }

            ////////////////////////////////////////////////////////////////////

            function attachBooleans () {
                for (var i = 0; i < vm.certs.length; i++) {
//                    vm.editForm['data_' + vm.certs[i].number + '_gap'] = vm.certs[i].gap;
                }
            }
        }]);

    angular.module('app.common')
        .directive('aiCerts', ['commonService', '$log', function (commonService, $log) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/certs.html',
                bindToController: {
                    certs: '=',
                    cqms: '=',
                    viewAllCerts: '=defaultAll',
                    countCerts: '=',
                    countCqms: '=',
                    editMode: '=',
                    reportFileLocation: '@',
                    isEditing: '=',
                    isConfirming: '=',
                    save: '&',
                    product: '=',
                    cap: '='
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'CertsController',
                link: function (scope, element, attr, ctrl) {
                    var handler = ctrl.save({
                        handler: function () {
                            ctrl.saveEdits();
                        }
                    });
                    scope.$on('$destroy', handler);
                }
            };
        }]);
})();
