const CertificationCriteriaEditComponent = {
  templateUrl: 'chpl.components/listing/details/criteria/edit.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller: class CertificationCriteriaEditController {
    constructor($filter, $log, authService, featureFlags, utilService, CertificationResultConformanceMethod, CertificationResultSvap, CertificationResultOptionalStandard, CertificationResultTestData, CertificationResultTestFunctionality, CertificationResultTestProcedure, CertificationResultTestStandard, CertificationResultTestTool) {
      'ngInject';

      this.$filter = $filter;
      this.$log = $log;
      this.hasAnyRole = authService.hasAnyRole;
      this.isOn = featureFlags.isOn;
      this.addNewValue = utilService.addNewValue;
      this.extendSelect = utilService.extendSelect;
      this.CertificationResultConformanceMethod = CertificationResultConformanceMethod;
      this.CertificationResultOptionalStandard = CertificationResultOptionalStandard;
      this.CertificationResultTestData = CertificationResultTestData;
      this.CertificationResultTestFunctionality = CertificationResultTestFunctionality;
      this.CertificationResultTestProcedure = CertificationResultTestProcedure;
      this.CertificationResultTestStandard = CertificationResultTestStandard;
      this.CertificationResultTestTool = CertificationResultTestTool;
      this.CertificationResultSvap = CertificationResultSvap;
    }

    $onInit() {
      this.cert = angular.copy(this.resolve.cert);
      this.hasIcs = this.resolve.hasIcs;
      this.isConfirming = this.resolve.isConfirming;
      this.resources = angular.copy(this.resolve.resources);
      this.options = [
        { name: 'True', value: true },
        { name: 'False', value: false },
      ];
      this.yesNo = [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ];
      this.allMeasures = [
        { abbreviation: 'MD' },
        { abbreviation: 'LP' },
      ];
      this.cert.metViaAdditionalSoftware = this.cert.additionalSoftware && this.cert.additionalSoftware.length > 0;
      this.certSave = angular.copy(this.cert);

      this.selectedConformanceMethodKeys = this.getSelectedConformanceMethodKeys();
      this.selectedTestDataKeys = this.getSelectedTestDataKeys();
      this.selectedTestFunctionalityKeys = this.getSelectedTestFunctionalityKeys();
      this.selectedTestProcedureKeys = this.getSelectedTestProcedureKeys();
      this.selectedOptionalStandardKeys = this.getSelectedOptionalStandardKeys();
      this.selectedTestStandardKeys = this.getSelectedTestStandardKeys();
      this.newOptionalStandards = this.getNewOptionalStandards();
      this.newTestStandards = this.getNewTestStandards();
      this.selectedTestToolKeys = this.getSelectedTestToolKeys();
      this.sortedTestFunctionalities = this.getSortedTestFunctionalities();
      this.selectedSvapKeys = this.getSelectedSvapKeys();
      this.setAvailableTestValues();
      this.setSvapDisplayText();
      this.setAvailableTestTools();
    }

    cancel() {
      this.cert = angular.copy(this.certSave);
      this.dismiss();
    }

    canEdit() {
      return this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // can always edit
        || !this.cert.criterion.removed; // ROLE_ACB can only edit when not removed criteria
    }

    isToolDisabled(tool) {
      if (this.isConfirming) {
        return tool.retired && !this.hasIcs;
      }
      return false;
    }

    save() {
      this.close({ $value: this.cert });
    }

    conformanceMethodsOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.conformanceMethods = this.cert.conformanceMethods
            .filter((crcm) => !(crcm.conformanceMethod.id === action.item.item.id
                              && crcm.conformanceMethodVersion === action.item.additionalInputValue));
          break;
        case 'Add':
          this.cert.conformanceMethods.push(new this.CertificationResultConformanceMethod(action.item.item, action.item.additionalInputValue));
          break;
        case 'Edit':
          this.cert.conformanceMethods = action.item.map((i) => new this.CertificationResultConformanceMethod(i.item, i.additionalInputValue));
          break;
          // no default
      }
    }

    svapOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.svaps = this.cert.svaps
            .filter((svap) => svap.svapId !== action.item.item.svapId);
          break;
        case 'Add':
          this.cert.svaps.push(new this.CertificationResultSvap(action.item.item));
          break;
        // no default
      }
    }

    testDataOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.testDataUsed = this.cert.testDataUsed
            .filter((crtd) => !(crtd.testData.id === action.item.item.id
              && crtd.version === action.item.additionalInputValue
              && crtd.alteration === action.item.additionalInput2Value));
          break;
        case 'Add':
          this.cert.testDataUsed.push(new this.CertificationResultTestData(action.item.item, action.item.additionalInputValue, action.item.additionalInput2Value));
          break;
        case 'Edit':
          this.cert.testDataUsed = action.item.map((i) => new this.CertificationResultTestData(i.item, i.additionalInputValue, i.additionalInput2Value));
          break;
        // no default
      }
    }

    testFunctionalityOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.testFunctionality = this.cert.testFunctionality
            .filter((crtf) => crtf.testFunctionalityId !== action.item.item.id);
          break;
        case 'Add':
          this.cert.testFunctionality.push(new this.CertificationResultTestFunctionality(action.item.item));
          break;
        default:
      }
    }

    testProceduresOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.testProcedures = this.cert.testProcedures
            .filter((crtp) => !(crtp.testProcedure.id === action.item.item.id
              && crtp.testProcedureVersion === action.item.additionalInputValue));
          break;
        case 'Add':
          this.cert.testProcedures.push(new this.CertificationResultTestProcedure(action.item.item, action.item.additionalInputValue));
          break;
        case 'Edit':
          this.cert.testProcedures = action.item.map((i) => new this.CertificationResultTestProcedure(i.item, i.additionalInputValue));
          break;
        // no default
      }
    }

    optionalStandardsOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.optionalStandards = this.cert.optionalStandards
            .filter((cros) => {
              if (action.item.item.id === 'newItem') {
                return cros.citation !== action.item.item.citation;
              }
              return cros.optionalStandardId !== action.item.item.id;
            });
          break;
        case 'Add':
          this.cert.optionalStandards.push(new this.CertificationResultOptionalStandard(action.item.item));
          break;
        default:
      }
    }

    testStandardOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.testStandards = this.cert.testStandards.filter((crts) => {
            if (action.item.item.id === 'newItem') {
              return crts.testStandardName !== action.item.item.name;
            }
            return crts.testStandardId !== action.item.item.id;
          });
          break;
        case 'Add':
          this.cert.testStandards.push(new this.CertificationResultTestStandard(action.item.item));
          break;
        default:
      }
    }

    testToolsOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.testToolsUsed = this.cert.testToolsUsed
            .filter((crtt) => !(crtt.testToolId === action.item.item.id
              && crtt.testToolVersion === action.item.additionalInputValue));
          break;
        case 'Add':
          this.cert.testToolsUsed.push(new this.CertificationResultTestTool(action.item.item, action.item.additionalInputValue));
          break;
        case 'Edit':
          this.cert.testToolsUsed = action.item.map((i) => new this.CertificationResultTestTool(i.item, i.additionalInputValue));
          break;
        // no default
      }
    }

    testToolValidation(item) {
      const validation = {};
      validation.valid = true;
      validation.errors = [];
      validation.warnings = [];
      if (this.isConfirming) {
        if (item.retired && !this.hasIcs) {
          validation.valid = false;
          validation.errors.push(`${item.name} is retired.  Retired test tools are only valid if the Certified Product carries ICS.`);
        }
      } else if (item.retired) {
        validation.valid = false;
        validation.warnings.push(`${item.name} is retired. Please ensure it is appropriate to use it.`);
      }
      return validation;
    }

    /// /////////////////////////////////////////////////////////////////

    // setup helper functions
    getSelectedConformanceMethodKeys() {
      const that = this;
      if (!this.cert.conformanceMethods) {
        return [];
      }
      return this.cert.conformanceMethods
        .filter((cm) => cm.conformanceMethod.id
            && that.cert.allowedConformanceMethods
            && that.cert.allowedConformanceMethods.length > 0
            && that.cert.allowedConformanceMethods.filter((acm) => acm.id === cm.conformanceMethod.id).length > 0)
        .map((cm) => ({
          key: cm.conformanceMethod.id,
          additionalInputValue: cm.conformanceMethodVersion,
        }));
    }

    getSelectedSvapKeys() {
      if (!this.cert.svaps) {
        return [];
      }
      return this.cert.svaps.map((s) => ({ key: s.svapId }));
    }

    getSelectedTestDataKeys() {
      if (!this.cert.testDataUsed) {
        return [];
      }
      return this.cert.testDataUsed.map((td) => ({
        key: td.testData.id,
        additionalInputValue: td.version,
        additionalInput2Value: td.alteration,
      }));
    }

    getSelectedTestFunctionalityKeys() {
      if (!this.cert.testFunctionality) {
        return [];
      }
      return this.cert.testFunctionality.map((tf) => ({ key: tf.testFunctionalityId }));
    }

    getSelectedTestProcedureKeys() {
      if (!this.cert.testProcedures) {
        return [];
      }
      return this.cert.testProcedures.map((tp) => ({
        key: tp.testProcedure.id,
        additionalInputValue: tp.testProcedureVersion,
      }));
    }

    getSelectedOptionalStandardKeys() {
      const that = this;
      if (!this.cert.optionalStandards) {
        return [];
      }
      return this.cert.optionalStandards
        .filter((os) => os.optionalStandardId
          && that.cert.allowedOptionalStandards
          && that.cert.allowedOptionalStandards.length > 0
          && that.cert.allowedOptionalStandards.filter((aos) => aos.id === os.optionalStandardId).length > 0)
        .map((os) => ({ key: os.optionalStandardId }));
    }

    getNewOptionalStandards() {
      const that = this;
      if (!this.cert.optionalStandards) {
        return [];
      }
      return this.cert.optionalStandards
        .filter((os) => !os.optionalStandardId
          || !that.cert.allowedOptionalStandards
          || that.cert.allowedOptionalStandards.length === 0
          || that.cert.allowedOptionalStandards.filter((aos) => aos.id === os.optionalStandardId).length === 0)
        .map((os) => os.citation);
    }

    getSelectedTestStandardKeys() {
      if (!this.cert.testStandards) {
        return [];
      }
      const keys = this.cert.testStandards
        .filter((ts) => ts.testStandardId)
        .map((ts) => ({ key: ts.testStandardId }));
      if (this.isOn('optional-standards')) {
        this.resources.testStandards.data = this.resources.testStandards.data.filter((ts) => keys.find((k) => k.key === ts.id));
      }
      return keys;
    }

    getNewTestStandards() {
      if (!this.cert.testStandards) {
        return [];
      }
      return this.cert.testStandards
        .filter((ts) => !ts.testStandardId)
        .map((ts) => ts.testStandardName);
    }

    getSelectedTestToolKeys() {
      if (!this.cert.testToolsUsed) {
        return [];
      }
      return this.cert.testToolsUsed.map((tt) => ({
        key: tt.testToolId,
        additionalInputValue: tt.testToolVersion,
      }));
    }

    getSortedTestFunctionalities() {
      return this.$filter('orderBy')(this.cert.allowedTestFunctionalities, 'name');
    }

    setAvailableTestValues() {
      const { number } = this.cert;
      const { title } = this.cert;
      this.availableTestData = this.resources.testData.data.filter((item) => item.criteria.number === number && item.criteria.title === title);
      this.availableTestProcedures = this.resources.testProcedures.data.filter((item) => item.criteria.number === number && item.criteria.title === title);
    }

    setSvapDisplayText() {
      if (Array.isArray(this.cert.allowedSvaps)) {
        this.cert.allowedSvaps = this.cert.allowedSvaps.map((svap) => ({ ...svap, displayText: `${(svap.replaced ? 'Replaced | ' : '') + svap.regulatoryTextCitation} ${svap.approvedStandardVersion}` }));
      }
    }

    setAvailableTestTools() {
      if (Array.isArray(this.cert.allowedTestTools)) {
        this.cert.allowedTestTools = this.cert.allowedTestTools
          .map((att) => ({
            ...att,
            dropDownText: att.name + (att.retired ? ' (Retired)' : ''),
          }));
        this.cert.testToolsUsed.forEach((tt) => {
          if (!this.cert.allowedTestTools.find((att) => att.id === tt.testToolId)) {
            this.cert.allowedTestTools.push({
              id: tt.testToolId,
              name: tt.testToolName,
              retired: tt.retired,
              dropDownText: tt.testToolName + (tt.retired ? ' (Retired)' : ''),
            });
          }
        });
      }
    }
  },
};

angular
  .module('chpl.components')
  .component('chplCertificationCriteriaEdit', CertificationCriteriaEditComponent);

export default CertificationCriteriaEditComponent;
