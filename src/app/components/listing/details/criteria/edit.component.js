import * as jsJoda from '@js-joda/core';

import { getCodeSetFormat } from 'services/date-util';

const isStandardInteresting = (standard) => (standard.endDay && jsJoda.LocalDate.now() <= standard.endDay) // interesting because soon to expire
      || (standard.endDay && jsJoda.LocalDate.now() > standard.endDay) // interesting because it's already expired
      || (standard.requiredDay && jsJoda.LocalDate.now() < standard.requiredDay); // interesting because it will be required soon

const CertificationCriteriaEditComponent = {
  templateUrl: 'chpl.components/listing/details/criteria/edit.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller: class CertificationCriteriaEditController {
    constructor($filter, $log, authService, utilService, CertificationResultConformanceMethod, CertificationResultSvap, CertificationResultOptionalStandard, CertificationResultTestData, CertificationResultFunctionalitiesTested, CertificationResultTestProcedure, CertificationResultTestStandard, CertificationResultTestTool) {
      'ngInject';

      this.$filter = $filter;
      this.$log = $log;
      this.hasAnyRole = authService.hasAnyRole;
      this.addNewValue = utilService.addNewValue;
      this.extendSelect = utilService.extendSelect;
      this.CertificationResultFunctionalitiesTested = CertificationResultFunctionalitiesTested;
      this.CertificationResultConformanceMethod = CertificationResultConformanceMethod;
      this.CertificationResultOptionalStandard = CertificationResultOptionalStandard;
      this.CertificationResultTestData = CertificationResultTestData;
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

      this.setAvailableCodeSets();
      this.setAvailableTestTools();
      this.setAvailableStandards();
      this.setAvailableOptionalStandards();
      this.setAvailableConformanceMethods();
      this.setAvailableTestValues();
      this.setAvailableSvaps();
      this.selectedCodeSetKeys = this.getSelectedCodeSetKeys();
      this.selectedConformanceMethodKeys = this.getSelectedConformanceMethodKeys();
      this.selectedTestDataKeys = this.getSelectedTestDataKeys();
      this.selectedFunctionalityTestedKeys = this.getSelectedFunctionalityTestedKeys();
      this.selectedTestProcedureKeys = this.getSelectedTestProcedureKeys();
      this.selectedStandardKeys = this.getSelectedStandardKeys();
      this.selectedOptionalStandardKeys = this.getSelectedOptionalStandardKeys();
      this.selectedTestStandardKeys = this.getSelectedTestStandardKeys();
      this.newOptionalStandards = this.getNewOptionalStandards();
      this.newTestStandards = this.getNewTestStandards();
      this.selectedTestToolKeys = this.getSelectedTestToolKeys();
      this.sortedFunctionalitiesTested = this.getSortedFunctionalitiesTested();
      this.selectedSvapKeys = this.getSelectedSvapKeys();
    }

    cancel() {
      this.cert = angular.copy(this.certSave);
      this.dismiss();
    }

    canEdit() {
      return this.hasAnyRole(['chpl-admin', 'ROLE_ONC']) // can always edit
        || this.cert.criterion.editable; // ROLE_ACB can only edit when criteria has been recently removed
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

    codeSetsOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.codeSetDates = this.cert.codeSetDates
            .filter((crcs) => {
              if (action.item.item.id === 'newItem') {
                return crcs.codeSet.value !== action.item.item.value;
              }
              return crcs.codeSet.id !== action.item.item.id;
            });
          break;
        case 'Add':
          this.cert.codeSetDates = [].concat(this.cert.codeSetDates).concat({ codeSetDate: action.item.item }).filter((item) => item);
          break;
        default:
      }
    }

    conformanceMethodsOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.conformanceMethods = this.cert.conformanceMethods
            .filter((crcm) => !(crcm.conformanceMethod.id === action.item.item.id
                              && crcm.conformanceMethodVersion === action.item.additionalInputValue));
          break;
        case 'Add':
          this.cert.conformanceMethods = [].concat(this.cert.conformanceMethods).concat(new this.CertificationResultConformanceMethod(action.item.item, action.item.additionalInputValue)).filter((item) => item);
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
          this.cert.svaps = [].concat(this.cert.svaps).concat(new this.CertificationResultSvap(action.item.item)).filter((item) => item);
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
          this.cert.testDataUsed = [].concat(this.cert.testDataUsed).concat(new this.CertificationResultTestData(action.item.item, action.item.additionalInputValue, action.item.additionalInput2Value)).filter((item) => item);
          break;
        case 'Edit':
          this.cert.testDataUsed = action.item.map((i) => new this.CertificationResultTestData(i.item, i.additionalInputValue, i.additionalInput2Value));
          break;
        // no default
      }
    }

    functionalityTestedOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.functionalitiesTested = this.cert.functionalitiesTested
            .filter((crft) => crft.functionalityTested.id !== action.item.item.id);
          break;
        case 'Add':
          this.cert.functionalitiesTested = [].concat(this.cert.functionalitiesTested).concat(new this.CertificationResultFunctionalitiesTested(action.item.item)).filter((item) => item);
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
          this.cert.testProcedures = [].concat(this.cert.testProcedures).concat(new this.CertificationResultTestProcedure(action.item.item, action.item.additionalInputValue)).filter((item) => item);
          break;
        case 'Edit':
          this.cert.testProcedures = action.item.map((i) => new this.CertificationResultTestProcedure(i.item, i.additionalInputValue));
          break;
        // no default
      }
    }

    standardsOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.standards = this.cert.standards
            .filter((crs) => {
              if (action.item.item.id === 'newItem') {
                return crs.standard.value !== action.item.item.value;
              }
              return crs.standard.id !== action.item.item.id;
            });
          break;
        case 'Add':
          this.cert.standards = [].concat(this.cert.standards).concat({ standard: action.item.item }).filter((item) => item);
          break;
        default:
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
          this.cert.optionalStandards = [].concat(this.cert.optionalStandards).concat(new this.CertificationResultOptionalStandard(action.item.item)).filter((item) => item);
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
          this.cert.testStandards = [].concat(this.cert.testStandards).concat(new this.CertificationResultTestStandard(action.item.item)).filter((item) => item);
          break;
        default:
      }
    }

    testToolsOnChange(action) {
      switch (action.action) {
        case 'Remove':
          this.cert.testToolsUsed = this.cert.testToolsUsed
            .filter((crtt) => !(crtt.testTool.id === action.item.item.id
              && crtt.version === action.item.additionalInputValue));
          break;
        case 'Add':
          this.cert.testToolsUsed = [].concat(this.cert.testToolsUsed).concat(new this.CertificationResultTestTool(action.item.item, action.item.additionalInputValue)).filter((item) => item);
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
          validation.errors.push(`${item.name} is retired. Retired test tools are only valid if the Certified Product carries ICS.`);
        }
      } else if (item.retired) {
        validation.valid = false;
        validation.warnings.push(`${item.name} is retired. Please ensure it is appropriate to use it.`);
      }
      return validation;
    }

    /// /////////////////////////////////////////////////////////////////

    // setup helper functions
    getSelectedCodeSetKeys() {
      const that = this;
      if (!this.cert.codeSetDates) {
        return [];
      }
      return this.cert.codeSetDates
        .filter((cs) => cs.codeSetDate.id
                && that.resources.codeSets.filter((acs) => acs.id === cs.codeSetDate.id).length > 0)
        .map((cs) => ({ key: cs.codeSetDate.id }));
    }

    getSelectedConformanceMethodKeys() {
      const that = this;
      if (!this.cert.conformanceMethods) {
        return [];
      }
      return this.cert.conformanceMethods
        .filter((cm) => cm.conformanceMethod.id
            && that.resources.conformanceMethods.filter((acm) => acm.id === cm.conformanceMethod.id).length > 0)
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

    getSelectedFunctionalityTestedKeys() {
      if (!this.cert.functionalitiesTested) {
        return [];
      }
      return this.cert.functionalitiesTested.map((ft) => ({ key: ft.functionalityTested.id }));
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

    getSelectedStandardKeys() {
      const that = this;
      if (!this.cert.standards) {
        return [];
      }
      return this.cert.standards
        .filter((s) => isStandardInteresting(s.standard))
        .filter((s) => s.standard.id
                && that.resources.standards.filter((as) => as.id === s.standard.id).length > 0)
        .map((s) => ({ key: s.standard.id }));
    }

    getSelectedOptionalStandardKeys() {
      const that = this;
      if (!this.cert.optionalStandards) {
        return [];
      }
      return this.cert.optionalStandards
        .filter((os) => os.optionalStandardId
          && that.resources.optionalStandards.filter((aos) => aos.id === os.optionalStandardId).length > 0)
        .map((os) => ({ key: os.optionalStandardId }));
    }

    getNewOptionalStandards() {
      const that = this;
      if (!this.cert.optionalStandards) {
        return [];
      }
      return this.cert.optionalStandards
        .filter((os) => !os.optionalStandardId
          || that.resources.optionalStandards.filter((aos) => aos.id === os.optionalStandardId).length === 0)
        .map((os) => os.citation);
    }

    getSelectedTestStandardKeys() {
      if (!this.cert.testStandards) {
        return [];
      }
      const keys = this.cert.testStandards
        .filter((ts) => ts.testStandardId)
        .map((ts) => ({ key: ts.testStandardId }));
      this.resources.testStandards.data = this.resources.testStandards.data.filter((ts) => keys.find((k) => k.key === ts.id));
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
        key: tt.testTool.id,
        additionalInputValue: tt.version,
      }));
    }

    getSortedFunctionalitiesTested() {
      return this.resources.functionalitiesTested
        .filter((ft) => ft.criteria.some((c) => c.id === this.cert.criterion.id))
        .sort((a, b) => (a.value < b.value ? -1 : 1))
        .map((ft) => ({
          ...ft,
          displayText: `${(ft.retired ? 'Expired | ' : '')} ${ft.regulatoryTextCitation}: ${ft.value}`,
        }));
    }

    setAvailableTestValues() {
      const { criterion: { id } } = this.cert;
      this.availableTestData = this.resources.testData.data.filter((item) => item.criteria.id === id);
      this.availableTestProcedures = this.resources.testProcedures.data.filter((item) => item.criteria.id === id);
    }

    setAvailableSvaps() {
      this.allowedSvaps = this.resources.svaps
        .filter((svap) => svap.criteria.some((cc) => cc.id === this.cert.criterion.id))
        .map((svap) => ({
          ...svap,
          displayText: `${(svap.replaced ? 'Replaced | ' : '')} ${svap.regulatoryTextCitation} ${svap.approvedStandardVersion}`,
        }));
    }

    setAvailableTestTools() {
      if (Array.isArray(this.resources.testTools)) {
        this.cert.allowedTestTools = this.resources.testTools
          .filter((tt) => tt.criteria.some((cc) => cc.id === this.cert.criterion.id))
          .map((tt) => ({
            ...tt,
            dropDownText: (tt.retired ? 'Retired | ' : '') + tt.value,
          }));
      }
    }

    setAvailableCodeSets() {
      if (Array.isArray(this.resources.codeSets)) {
        this.cert.allowedCodeSets = this.resources.codeSets
          .filter((cs) => cs.criteria.some((cc) => cc.id === this.cert.criterion.id))
          // .filter((cs) => cs.startDay <= jsJoda.LocalDate.now()) // starts in the future; can't be used now
          .map((cs) => ({
            ...cs,
            dropDownText: getCodeSetFormat(cs.requiredDay),
          }));
      }
    }

    setAvailableConformanceMethods() {
      if (Array.isArray(this.resources.conformanceMethods)) {
        this.cert.allowedConformanceMethods = this.resources.conformanceMethods
          .filter((cm) => cm.criteria.some((cc) => cc.id === this.cert.criterion.id))
          .map((cm) => ({
            ...cm,
            dropDownText: (cm.retired ? 'Retired | ' : '') + cm.value,
          }));
      }
    }

    setAvailableStandards() {
      if (Array.isArray(this.resources.standards)) {
        this.cert.allowedStandards = this.resources.standards
          .filter((s) => s.criteria.some((cc) => cc.id === this.cert.criterion.id))
          .filter((s) => s.startDay <= jsJoda.LocalDate.now()) // starts in the future; can't be used now
          .filter((s) => (!s.endDay || jsJoda.LocalDate.now() <= s.endDay || !this.isConfirming)) // ends in the past; can't be used on confirmation
          .filter(isStandardInteresting)
          .map((s) => ({
            ...s,
            dropDownText: s.regulatoryTextCitation + (s.retired ? ' (Retired)' : ''),
          }));
      }
    }

    setAvailableOptionalStandards() {
      if (Array.isArray(this.resources.optionalStandards)) {
        this.cert.allowedOptionalStandards = this.resources.optionalStandards
          .filter((os) => os.criteria.some((cc) => cc.id === this.cert.criterion.id))
          .map((os) => ({
            ...os,
            dropDownText: os.value + (os.retired ? ' (Retired)' : ''),
          }));
      }
    }
  },
};

angular
  .module('chpl.components')
  .component('chplCertificationCriteriaEdit', CertificationCriteriaEditComponent);

export default CertificationCriteriaEditComponent;
