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
            this.yesNo = [
                {name: 'Yes', value: true},
                {name: 'No', value: false},
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
            this._setAvailableTestValues();
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
                this.cert.testDataUsed = this.cert.testDataUsed.filter(crtd => crtd.testData.id !== action.item.item.id);
                break;
            case 'Add':
                this.cert.testDataUsed.push(new this.CertificationResultTestData(action.item.item, action.item.additionalInputValue, action.item.additionalInput2Value));
                break;
            case 'Edit':
                this.cert.testDataUsed.forEach(crtd => {
                    if (crtd.testData.id === action.item.item.id) {
                        crtd.version = action.item.additionalInputValue;
                        crtd.alteration = action.item.additionalInput2Value;
                    }
                });
                break;
            default:
            }
        }

        testFunctionalityOnChange (action) {
            switch (action.action) {
            case 'Remove':
                this.cert.testFunctionality = this.cert.testFunctionality.filter(crtf => crtf.testFunctionalityId !== action.item.item.id);
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
                this.cert.testProcedures = this.cert.testProcedures.filter(crtp => crtp.testProcedure.id !== action.item.item.id);
                break;
            case 'Add':
                this.cert.testProcedures.push(new this.CertificationResultTestProcedure(action.item.item, action.item.additionalInputValue));
                break;
            case 'Edit':
                this.cert.testProcedures.forEach(crtp => {
                    if (crtp.testProcedure.id === action.item.item.id) {
                        crtp.testProcedureVersion = action.item.additionalInputValue;
                    }
                });
                break;
            default:
            }
        }

        testStandardOnChange (action) {
            switch (action.action) {
            case 'Remove':
                this.cert.testStandards = this.cert.testStandards.filter(crts => crts.testStandardId !== action.item.item.id);
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
                this.cert.testToolsUsed = this.cert.testToolsUsed.filter(crtt => crtt.testToolId !== action.item.item.id);
                break;
            case 'Add':
                this.cert.testToolsUsed.push(new this.CertificationResultTestTool(action.item.item, action.item.additionalInputValue));
                break;
            case 'Edit':
                this.cert.testToolsUsed.forEach(crtt => {
                    if (crtt.testToolId === action.item.item.id) {
                        crtt.testToolVersion = action.item.additionalInputValue;
                    }
                });
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

        // setup helper functions
        _getSelectedTestDataKeys () {
            if (!this.cert.testDataUsed) {
                return [];
            }
            return this.cert.testDataUsed.map(td => ({
                key: td.testData.id,
                additionalInputValue: td.version,
                additionalInput2Value: td.alteration,
            }));
        }

        _getSelectedTestFunctionalityKeys () {
            if (!this.cert.testFunctionality) {
                return [];
            }
            return this.cert.testFunctionality.map(tf => ({key: tf.testFunctionalityId}));
        }

        _getSelectedTestProcedureKeys () {
            if (!this.cert.testProcedures) {
                return [];
            }
            return this.cert.testProcedures.map(tp => ({
                key: tp.testProcedure.id,
                additionalInputValue: tp.testProcedureVersion,
            }));
        }

        _getSelectedTestStandardKeys () {
            if (!this.cert.testStandards) {
                return [];
            }
            return this.cert.testStandards.map(ts => ({key: ts.testStandardId}));
        }

        _getSelectedTestToolKeys () {
            if (!this.cert.testToolsUsed) {
                return [];
            }
            return this.cert.testToolsUsed.map(tt => ({
                key: tt.testToolId,
                additionalInputValue: tt.testToolVersion,
            }));
        }

        _getSortedTestFunctionalities () {
            return this.$filter('orderBy')(this.cert.allowedTestFunctionalities, 'name');
        }

        _setAvailableTestValues () {
            let number = this.cert.number
            this.availableTestData = this.resources.testData.data.filter(item => item.criteria.number === number);
            this.availableTestProcedures = this.resources.testProcedures.data.filter(item => item.criteria.number === number);
        }

        _setTestToolDropDownText () {
            this.resources.testTools.data.forEach(tt => {
                tt.dropDownText = tt.name + (tt.retired ? ' (Retired)' : '');
            });
        }
    },
}

angular
    .module('chpl.components')
    .component('chplCertificationCriteriaEdit', CertificationCriteriaEditComponent);
