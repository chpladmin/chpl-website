(function () {
    'use strict';

    angular.module('chpl')
        .controller('EditCertificationCriteriaController', EditCertificationCriteriaController);

    /** @ngInject */
    function EditCertificationCriteriaController ($log, $uibModal, $uibModalInstance, cert, hasIcs, resources, utilService) {
        var vm = this;

        vm.addNewValue = utilService.addNewValue;
        vm.cancel = cancel;
        vm.extendSelect = utilService.extendSelect;
        vm.isToolAvailable = isToolAvailable;
        vm.save = save;
        vm.testFunctionalityOnChnage = testFunctionalityOnChnage;
        vm.testProceduresOnChange = testProceduresOnChange;
        vm.testToolsOnChange = testToolsOnChange;
        vm.isTestToolDisabled = isTestToolDisabled;
        vm.testDataOnChange = testDataOnChange;
        vm.testStandardOnChange = testStandardOnChange;
        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.certSave = angular.copy(cert);
            vm.cert = cert;
            vm.options = [
                {name: 'True', value: true},
                {name: 'False', value: false},
            ];
            vm.allMeasures = [
                {abbreviation: 'MD'},
                {abbreviation: 'LP'},
            ];
            vm.cert.metViaAdditionalSoftware = vm.cert.additionalSoftware && vm.cert.additionalSoftware.length > 0;
            vm.hasIcs = hasIcs;
            vm.resources = resources;

            vm.selectedTestFunctionalityKeys = getSelectedTestFunctionalityKeys();
            vm.selectedTestToolKeys = getSelectedTestToolKeys();
            vm.selectedTestProcedureKeys = getSelectedTestProcedureKeys();
            vm.selectedTestDataKeys = getSelectedTestDataKeys();
            vm.selectedTestStandardKeys = getSelectedTestStandardKeys();

            _getAvailableTestOptions();
        }

        function cancel () {
            vm.cert = angular.copy(vm.certSave);
            $uibModalInstance.dismiss('cancelled');
        }

        function isToolAvailable (tool) {
            return vm.hasIcs || !tool.retired;
        }

        function save () {
            $uibModalInstance.close();
        }

        function testDataOnChange (action) {
            if (action.action === 'Remove') {
                testDataRemoveItem(action.item);
            } else if (action.action === 'Add') {
                testDataAddItem(action.item);
            } else if (action.action === 'Edit') {
                testDataEditItem(action.item)
            }
        }

        function testFunctionalityOnChnage (action) {
            if (action.action === 'Remove') {
                testFunctionalityRemoveItem(action.item);
            } else if (action.action === 'Add') {
                testFunctionalityAddItem(action.item);
            }
        }

        function testStandardOnChange (action) {
            if (action.action === 'Remove') {
                testStandardRemoveItem(action.item);
            } else if (action.action === 'Add') {
                testStandardAddItem(action.item);
            }
        }

        function testToolsOnChange (action) {
            if (action.action === 'Remove') {
                testToolsRemoveItem(action.item);
            } else if (action.action === 'Add') {
                testToolsAddItem(action.item);
            } else if (action.action === 'Edit') {
                testToolsEditItem(action.item)
            }
        }

        function testProceduresOnChange (action) {
            if (action.action === 'Remove') {
                testProceduresRemoveItem(action.item);
            } else if (action.action === 'Add') {
                testProceduresAddItem(action.item);
            } else if (action.action === 'Edit') {
                testProceduresEditItem(action.item)
            }
        }
        ////////////////////////////////////////////////////////////////////

        function _getAvailableTestOptions () {
            vm.availableTestProcedures = vm.resources.testProcedures.data
                .filter(function (procedure) {
                    return procedure.criteria.number === vm.cert.number;
                });
            vm.availableTestData = vm.resources.testData.data
                .filter(function (data) {
                    return data.criteria.number === vm.cert.number;
                });
        }

        function getSelectedTestDataKeys () {
            var tdKeys = [];
            angular.forEach(vm.cert.testDataUsed, function (td) {
                tdKeys.push({
                    'key': td.testData.id,
                    'additionalInputValue': td.version,
                    'additionalInput2Value': td.alteration,
                });
            });
            return tdKeys;
        }

        function getSelectedTestFunctionalityKeys () {
            var tfKeys = [];
            angular.forEach(vm.cert.testFunctionality, function (tf) {
                tfKeys.push({'key': tf.testFunctionalityId});
            });
            return tfKeys;
        }

        function getSelectedTestProcedureKeys () {
            var tpKeys = [];
            angular.forEach(vm.cert.testProcedures, function (tp) {
                tpKeys.push({'key': tp.testProcedure.id, 'additionalInputValue': tp.testProcedureVersion});
            });
            return tpKeys;
        }

        function getSelectedTestStandardKeys () {
            var tsKeys = [];
            angular.forEach(vm.cert.testStandards, function (ts) {
                tsKeys.push({'key': ts.testStandardId});
            });
            return tsKeys;
        }

        function getSelectedTestToolKeys () {
            var ttKeys = [];
            angular.forEach(vm.cert.testToolsUsed, function (tt) {
                ttKeys.push({'key': tt.testToolId, 'additionalInputValue': tt.testToolVersion});
            });
            return ttKeys;
        }

        function isTestToolDisabled (testTool) {
            return testTool.retired;
        }

        function testDataAddItem (testData) {
            var crtd = {
                'testData': testData.item,
                'version': testData.additionalInputValue,
                'alteration': testData.additionalInput2Value,
            };
            vm.cert.testDataUsed.push(crtd);
        }

        function testDataEditItem (testData) {
            var crtds = vm.cert.testDataUsed.filter(function (crtd) {
                return crtd.testData.id === testData.item.id;
            });
            if (crtds && crtds.length > 0) {
                crtds[0].version = testData.additionalInputValue;
                crtds[0].alteration = testData.additionalInput2Value;
            }
        }

        function testDataRemoveItem (testData) {
            var remaining = vm.cert.testDataUsed.filter( function (crtd) {
                return crtd.testData.id !== testData.item.id;
            });
            vm.cert.testDataUsed = remaining;
        }

        function testFunctionalityAddItem (testFunctionality) {
            var crtf = {
                'description': testFunctionality.item.description,
                'name': testFunctionality.item.name,
                'testFunctionalityId': testFunctionality.item.id,
                'year': testFunctionality.item.year,
            };
            vm.cert.testFunctionality.push(crtf);
        }

        function testFunctionalityRemoveItem (testFunctionality) {
            var remaining = vm.cert.testFunctionality.filter( function (crtf) {
                return crtf.testFunctionalityId !== testFunctionality.id;
            });
            vm.cert.testFunctionality = remaining;
        }

        function testProceduresAddItem (testProcedure) {
            var crtp = {
                'testProcedure': testProcedure.item,
                'testProcedureVersion': testProcedure.additionalInputValue,
            };
            vm.cert.testProcedures.push(crtp);
        }

        function testProceduresEditItem (testProcedure) {
            var crtps = vm.cert.testProcedures.filter(function (crtp) {
                return crtp.testProcedure.id === testProcedure.item.id;
            });
            if (crtps && crtps.length > 0) {
                crtps[0].testProcedureVersion = testProcedure.additionalInputValue;
            }
        }

        function testProceduresRemoveItem (testProcedure) {
            var remaining = vm.cert.testProcedures.filter( function (crtp) {
                return crtp.testProcedure.id !== testProcedure.item.id;
            });
            vm.cert.testProcedures = remaining;
        }

        function testStandardAddItem (testStandard) {
            var crts = {
                'description': testStandard.item.description,
                'testStandardName': testStandard.item.name,
                'testStandardId': testStandard.item.id,
            };
            vm.cert.testStandards.push(crts);
        }

        function testStandardRemoveItem (testStandard) {
            var remaining = vm.cert.testStandards.filter( function (crts) {
                return crts.testStandardId !== testStandard.item.id;
            });
            vm.cert.testStandards = remaining;
        }

        function testToolsAddItem (testTool) {
            var crtt = {
                'retired': testTool.item.retired,
                'testToolId': testTool.item.id,
                'testToolName': testTool.item.name,
                'testToolVersion': testTool.additionalInputValue,
            };
            vm.cert.testToolsUsed.push(crtt);
        }

        function testToolsEditItem (testTool) {
            var crtts = vm.cert.testToolsUsed.filter(function (crtt) {
                return crtt.testToolId === testTool.item.id;
            });
            if (crtts && crtts.length > 0) {
                crtts[0].testToolVersion = testTool.additionalInputValue;
            }
        }

        function testToolsRemoveItem (testTool) {
            var remaining = vm.cert.testToolsUsed.filter( function (crtt) {
                return crtt.testToolId !== testTool.item.id;
            });
            vm.cert.testToolsUsed = remaining;
        }
    }
})();
