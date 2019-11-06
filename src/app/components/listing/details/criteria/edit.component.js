export const CertificationCriteriaEditComponent = {
    templateUrl: 'chpl.components/listing/details/criteria/edit.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&',
    },
    controller: class CertificationCriteriaEditController {
        constructor ($filter, $log, utilService, CertificationResultTestData, CertificationResultTestFunctionality, CertificationResultTestProcedure, CertificationResultTestStandard, CertificationResultTestTool) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.addNewValue = utilService.addNewValue;
            this.extendSelect = utilService.extendSelect;
            this.CertificationResultTestData = CertificationResultTestData;
            this.CertificationResultTestFunctionality = CertificationResultTestFunctionality;
            this.CertificationResultTestProcedure = CertificationResultTestProcedure;
            this.CertificationResultTestStandard = CertificationResultTestStandard;
            this.CertificationResultTestTool = CertificationResultTestTool;
        }

        $onInit () {
            this.cert = angular.copy(this.resolve.cert);
            this.hasIcs = this.resolve.hasIcs;
            this.isConfirming = this.resolve.isConfirming;
            this.resources = angular.copy(this.resolve.resources);
            this.options = [
                {name: 'True', value: true},
                {name: 'False', value: false},
            ];
            this.allMeasures = [
                {abbreviation: 'MD'},
                {abbreviation: 'LP'},
            ];
            this.cert.metViaAdditionalSoftware = this.cert.additionalSoftware && this.cert.additionalSoftware.length > 0;
            this.certSave = angular.copy(this.cert);

            this.selectedTestDataKeys = this._getSelectedTestDataKeys();
            this.selectedTestFunctionalityKeys = this._getSelectedTestFunctionalityKeys();
            this.selectedTestProcedureKeys = this._getSelectedTestProcedureKeys();
            this.selectedTestStandardKeys = this._getSelectedTestStandardKeys();
            this.selectedTestToolKeys = this._getSelectedTestToolKeys();
            this.sortedTestFunctionalities = this._getSortedTestFunctionalities();
            this._setTestToolDropDownText();
        }

        cancel () {
            this.cert = angular.copy(this.certSave);
            this.dismiss();
        }

        isToolDisabled (tool) {
            if (this.isConfirming) {
                return tool.retired && !this.hasIcs;
            } else {
                return false;
            }
        }

        save () {
            this.close({$value: this.cert});
        }

        testDataOnChange (action) {
            switch (action.action) {
            case 'Remove':
                this._testDataRemoveItem(action.item.item);
                break;
            case 'Add':
                this.cert.testDataUsed.push(new this.CertificationResultTestData(action.item.item, action.item.additionalInputValue, action.item.additionalInput2Value));
                break;
            case 'Edit':
                this._testDataEditItem(action.item)
                break;
            default:
            }
        }

        testFunctionalityOnChange (action) {
            switch (action.action) {
            case 'Remove':
                this._testFunctionalityRemoveItem(action.item.item);
                break;
            case 'Add':
                this.cert.testFunctionality.push(new this.CertificationResultTestFunctionality(action.item.item));
                break;
            default:
            }
        }

        testProceduresOnChange (action) {
            switch (action.action) {
            case 'Remove':
                this._testProceduresRemoveItem(action.item.item);
                break;
            case 'Add':
                this.cert.testProcedures.push(new this.CertificationResultTestProcedure(action.item.item, action.item.additionalInputValue));
                break;
            case 'Edit':
                this._testProceduresEditItem(action.item)
                break;
            default:
            }
        }

        testStandardOnChange (action) {
            switch (action.action) {
            case 'Remove':
                this._testStandardRemoveItem(action.item.item);
                break;
            case 'Add':
                this.cert.testStandards.push(new this.CertificationResultTestStandard(action.item.item));
                break;
            default:
            }
        }

        testToolsOnChange (action) {
            switch (action.action) {
            case 'Remove':
                this._testToolsRemoveItem(action.item.item);
                break;
            case 'Add':
                this.cert.testToolsUsed.push(new this.CertificationResultTestTool(action.item.item, action.item.additionalInputValue));
                break;
            case 'Edit':
                this._testToolsEditItem(action.item)
                break;
            default:
            }
        }

        testToolValidation (item) {
            var validation = {};
            validation.valid = true;
            validation.errors = [];
            validation.warnings = [];
            if (this.isConfirming) {
                if (item.retired && !this.hasIcs) {
                    validation.valid = false;
                    validation.errors.push(item.name + ' is retired.  Retired test tools are only valid if the Certified Product carries ICS.');
                }
            } else {
                if (item.retired) {
                    validation.valid = false;
                    validation.warnings.push(item.name + ' is retired. Please ensure it is appropriate to use it.');
                }
            }
            return validation;
        }

        ////////////////////////////////////////////////////////////////////

        _getSortedTestFunctionalities () {
            return this.$filter('orderBy')(this.cert.allowedTestFunctionalities, 'name');
        }

        _getSelectedTestDataKeys () {
            let that = this;
            var tdKeys = [];
            this.availableTestData = this.resources.testData.data
                .filter(function (data) {
                    return data.criteria.number === that.cert.number;
                });
            angular.forEach(this.cert.testDataUsed, function (td) {
                tdKeys.push({
                    'key': td.testData.id,
                    'additionalInputValue': td.version,
                    'additionalInput2Value': td.alteration,
                });
            });
            return tdKeys;
        }

        _getSelectedTestFunctionalityKeys () {
            var tfKeys = [];
            angular.forEach(this.cert.testFunctionality, function (tf) {
                tfKeys.push({'key': tf.testFunctionalityId});
            });
            return tfKeys;
        }

        _getSelectedTestProcedureKeys () {
            let that = this;
            var tpKeys = [];
            this.availableTestProcedures = this.resources.testProcedures.data
                .filter(function (procedure) {
                    return procedure.criteria.number === that.cert.number;
                });

            angular.forEach(this.cert.testProcedures, function (tp) {
                tpKeys.push({'key': tp.testProcedure.id, 'additionalInputValue': tp.testProcedureVersion});
            });
            return tpKeys;
        }

        _getSelectedTestStandardKeys () {
            var tsKeys = [];
            angular.forEach(this.cert.testStandards, function (ts) {
                tsKeys.push({'key': ts.testStandardId});
            });
            return tsKeys;
        }

        _getSelectedTestToolKeys () {
            var ttKeys = [];
            angular.forEach(this.cert.testToolsUsed, function (tt) {
                ttKeys.push({'key': tt.testToolId, 'additionalInputValue': tt.testToolVersion});
            });
            return ttKeys;
        }

        _setTestToolDropDownText () {
            angular.forEach(this.resources.testTools.data, function (tt) {
                tt.dropDownText = tt.name;
                if (tt.retired) {
                    tt.dropDownText += ' (Retired)';
                }
            });
        }

        _testDataEditItem (testData) {
            var crtds = this.cert.testDataUsed.filter(function (crtd) {
                return crtd.testData.id === testData.item.id;
            });
            if (crtds && crtds.length > 0) {
                crtds[0].version = testData.additionalInputValue;
                crtds[0].alteration = testData.additionalInput2Value;
            }
        }

        _testDataRemoveItem (testData) {
            var remaining = this.cert.testDataUsed.filter( function (crtd) {
                return crtd.testData.id !== testData.id;
            });
            this.cert.testDataUsed = remaining;
        }

        _testFunctionalityRemoveItem (testFunctionality) {
            var remaining = this.cert.testFunctionality.filter( function (crtf) {
                return crtf.testFunctionalityId !== testFunctionality.id;
            });
            this.cert.testFunctionality = remaining;
        }

        _testProceduresEditItem (testProcedure) {
            var crtps = this.cert.testProcedures.filter(function (crtp) {
                return crtp.testProcedure.id === testProcedure.item.id;
            });
            if (crtps && crtps.length > 0) {
                crtps[0].testProcedureVersion = testProcedure.additionalInputValue;
            }
        }

        _testProceduresRemoveItem (testProcedure) {
            var remaining = this.cert.testProcedures.filter( function (crtp) {
                return crtp.testProcedure.id !== testProcedure.id;
            });
            this.cert.testProcedures = remaining;
        }

        _testStandardRemoveItem (testStandard) {
            var remaining = this.cert.testStandards.filter( function (crts) {
                return crts.testStandardId !== testStandard.id;
            });
            this.cert.testStandards = remaining;
        }

        _testToolsEditItem (testTool) {
            var crtts = this.cert.testToolsUsed.filter(function (crtt) {
                return crtt.testToolId === testTool.item.id;
            });
            if (crtts && crtts.length > 0) {
                crtts[0].testToolVersion = testTool.additionalInputValue;
            }
        }

        _testToolsRemoveItem (testTool) {
            var remaining = this.cert.testToolsUsed.filter( function (crtt) {
                return crtt.testToolId !== testTool.id;
            });
            this.cert.testToolsUsed = remaining;
        }
    },
}

angular
    .module('chpl.components')
    .component('chplCertificationCriteriaEdit', CertificationCriteriaEditComponent);
