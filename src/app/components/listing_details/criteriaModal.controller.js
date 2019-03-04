(function () {
    'use strict';

    angular.module('chpl.components')
        .controller('EditCertificationCriteriaController', EditCertificationCriteriaController);

    /** @ngInject */
    function EditCertificationCriteriaController ($filter, $log, $uibModal, $uibModalInstance, CertificationResultTestData, CertificationResultTestFunctionality, CertificationResultTestProcedure, CertificationResultTestStandard, CertificationResultTestTool, cert, isConfirming, hasIcs, resources, utilService) {
        var vm = this;

        vm.addNewValue = utilService.addNewValue;
        vm.cancel = cancel;
        vm.extendSelect = utilService.extendSelect;
        vm.isTestToolRetired = isTestToolRetired;
        vm.isToolDisabled = isToolDisabled;
        vm.save = save;
        vm.testDataOnChange = testDataOnChange;
        vm.testFunctionalityOnChange = testFunctionalityOnChange;
        vm.testProceduresOnChange = testProceduresOnChange;
        vm.testToolsOnChange = testToolsOnChange;
        vm.testToolValidation = testToolValidation;
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
            vm.isConfirming = isConfirming;
            vm.resources = resources;

            vm.selectedTestDataKeys = _getSelectedTestDataKeys();
            vm.selectedTestFunctionalityKeys = _getSelectedTestFunctionalityKeys();
            vm.selectedTestProcedureKeys = _getSelectedTestProcedureKeys();
            vm.selectedTestStandardKeys = _getSelectedTestStandardKeys();
            vm.selectedTestToolKeys = _getSelectedTestToolKeys();
            vm.sortedTestFunctionalities = _getSortedTestFunctionalities();

            _setTestToolDropDownText();
        }

        function cancel () {
            vm.cert = angular.copy(vm.certSave);
            $uibModalInstance.dismiss('cancelled');
        }

        function isToolDisabled (tool) {
            if (vm.isConfirming) {
                return isTestToolRetired(tool);
            } else {
                return false;
            }
        }

        function isTestToolRetired (testTool) {
            return testTool.retired;
        }


        function save () {
            $uibModalInstance.close();
        }

        function testDataOnChange (action) {
            switch (action.action) {
            case 'Remove':
                _testDataRemoveItem(action.item.item);
                break;
            case 'Add':
                vm.cert.testDataUsed.push(new CertificationResultTestData(action.item.item, action.item.additionalInputValue, action.item.additionalInput2Value));
                break;
            case 'Edit':
                _testDataEditItem(action.item)
                break;
            default:
            }
        }

        function testFunctionalityOnChange (action) {
            switch (action.action) {
            case 'Remove':
                _testFunctionalityRemoveItem(action.item.item);
                break;
            case 'Add':
                vm.cert.testFunctionality.push(new CertificationResultTestFunctionality(action.item.item));
                break;
            default:
            }
        }

        function testProceduresOnChange (action) {
            switch (action.action) {
            case 'Remove':
                _testProceduresRemoveItem(action.item.item);
                break;
            case 'Add':
                vm.cert.testProcedures.push(new CertificationResultTestProcedure(action.item.item, action.item.additionalInputValue));
                break;
            case 'Edit':
                _testProceduresEditItem(action.item)
                break;
            default:
            }
        }

        function testStandardOnChange (action) {
            switch (action.action) {
            case 'Remove':
                _testStandardRemoveItem(action.item.item);
                break;
            case 'Add':
                vm.cert.testStandards.push(new CertificationResultTestStandard(action.item.item));
                break;
            default:
            }
        }

        function testToolsOnChange (action) {
            switch (action.action) {
            case 'Remove':
                _testToolsRemoveItem(action.item.item);
                break;
            case 'Add':
                vm.cert.testToolsUsed.push(new CertificationResultTestTool(action.item.item, action.item.additionalInputValue));
                break;
            case 'Edit':
                _testToolsEditItem(action.item)
                break;
            default:
            }
        }

        function testToolValidation (item) {
            var validation = {};
            validation.valid = true;
            validation.errors = [];
            validation.warnings = [];
            if (vm.isConfirming) {
                if (item.retired && !vm.hasIcs) {
                    validation.valid = false;
                    validation.errors.push(item.name + ' is retired.  Retired test tools are only valid if the Certified Product does not carry ICS.');
                }
            } else {
                if (item.retired) {
                    validation.valid = false;
                    validation.warnings.push(item.name + ' is retired. Please ensure is appropriate to use it.');
                }
            }
            return validation;
        }

        ////////////////////////////////////////////////////////////////////

        function _getSortedTestFunctionalities () {
            return $filter('orderBy')(vm.cert.allowedTestFunctionalities, 'name');
        }

        function _getSelectedTestDataKeys () {
            var tdKeys = [];
            vm.availableTestData = vm.resources.testData.data
                .filter(function (data) {
                    return data.criteria.number === vm.cert.number;
                });
            angular.forEach(vm.cert.testDataUsed, function (td) {
                tdKeys.push({
                    'key': td.testData.id,
                    'additionalInputValue': td.version,
                    'additionalInput2Value': td.alteration,
                });
            });
            return tdKeys;
        }

        function _getSelectedTestFunctionalityKeys () {
            var tfKeys = [];
            angular.forEach(vm.cert.testFunctionality, function (tf) {
                tfKeys.push({'key': tf.testFunctionalityId});
            });
            return tfKeys;
        }

        function _getSelectedTestProcedureKeys () {
            var tpKeys = [];
            vm.availableTestProcedures = vm.resources.testProcedures.data
                .filter(function (procedure) {
                    return procedure.criteria.number === vm.cert.number;
                });

            angular.forEach(vm.cert.testProcedures, function (tp) {
                tpKeys.push({'key': tp.testProcedure.id, 'additionalInputValue': tp.testProcedureVersion});
            });
            return tpKeys;
        }

        function _getSelectedTestStandardKeys () {
            var tsKeys = [];
            angular.forEach(vm.cert.testStandards, function (ts) {
                tsKeys.push({'key': ts.testStandardId});
            });
            return tsKeys;
        }

        function _getSelectedTestToolKeys () {
            var ttKeys = [];
            angular.forEach(vm.cert.testToolsUsed, function (tt) {
                ttKeys.push({'key': tt.testToolId, 'additionalInputValue': tt.testToolVersion});
            });
            return ttKeys;
        }

        function _setTestToolDropDownText () {
            angular.forEach(vm.resources.testTools.data, function (tt) {
                tt.dropDownText = tt.name;
                if (tt.retired) {
                    tt.dropDownText += ' (Retired)';
                }
            });
        }

        function _testDataEditItem (testData) {
            var crtds = vm.cert.testDataUsed.filter(function (crtd) {
                return crtd.testData.id === testData.item.id;
            });
            if (crtds && crtds.length > 0) {
                crtds[0].version = testData.additionalInputValue;
                crtds[0].alteration = testData.additionalInput2Value;
            }
        }

        function _testDataRemoveItem (testData) {
            var remaining = vm.cert.testDataUsed.filter( function (crtd) {
                return crtd.testData.id !== testData.id;
            });
            vm.cert.testDataUsed = remaining;
        }

        function _testFunctionalityRemoveItem (testFunctionality) {
            var remaining = vm.cert.testFunctionality.filter( function (crtf) {
                return crtf.testFunctionalityId !== testFunctionality.id;
            });
            vm.cert.testFunctionality = remaining;
        }

        function _testProceduresEditItem (testProcedure) {
            var crtps = vm.cert.testProcedures.filter(function (crtp) {
                return crtp.testProcedure.id === testProcedure.item.id;
            });
            if (crtps && crtps.length > 0) {
                crtps[0].testProcedureVersion = testProcedure.additionalInputValue;
            }
        }

        function _testProceduresRemoveItem (testProcedure) {
            var remaining = vm.cert.testProcedures.filter( function (crtp) {
                return crtp.testProcedure.id !== testProcedure.id;
            });
            vm.cert.testProcedures = remaining;
        }

        function _testStandardRemoveItem (testStandard) {
            var remaining = vm.cert.testStandards.filter( function (crts) {
                return crts.testStandardId !== testStandard.id;
            });
            vm.cert.testStandards = remaining;
        }

        function _testToolsEditItem (testTool) {
            var crtts = vm.cert.testToolsUsed.filter(function (crtt) {
                return crtt.testToolId === testTool.item.id;
            });
            if (crtts && crtts.length > 0) {
                crtts[0].testToolVersion = testTool.additionalInputValue;
            }
        }

        function _testToolsRemoveItem (testTool) {
            var remaining = vm.cert.testToolsUsed.filter( function (crtt) {
                return crtt.testToolId !== testTool.id;
            });
            vm.cert.testToolsUsed = remaining;
        }
    }
})();
