import { compareArrays, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { sortCriteria } from 'services/criteria.service';
import { sortCqms } from 'services/cqms.service';
import { getDisplayDateFormat } from 'services/date-util';

let rules;

/* eslint-disable no-nested-ternary */
const compare = (before, after, key, title = 'unknown') => {
  let options;
  switch (key) {
    case 'accessibilityStandards':
      options = {
        sort: (p, c) => (p.accessibilityStandardName < c.accessibilityStandardName ? -1 : p.accessibilityStandardName > c.accessibilityStandardName ? 1 : 0),
        write: (f) => `Accessibility Standard "${f.accessibilityStandardName}"`,
      };
      break;
    case 'additionalSoftware':
      options = {
        sort: (p, c) => (p.id < c.id ? -1 : p.id > c.id ? 1 : 0),
        write: (f) => `Relied Upon Software "${f.certifiedProductNumber ?? f.name}"`,
      };
      break;
    case 'certificationEvents':
      options = {
        sort: (p, c) => ((p.status?.name ?? p.certificationStatusName) === (c.status?.name ?? c.certificationStatusName) ? 0 : p.eventDate - c.eventDate),
        write: (f) => `Certification Status "${f.status?.name ?? f.certificationStatusName}" as of "${getDisplayDateFormat(f.eventDay || f.eventDate)}"`,
      };
      break;
    case 'children':
    case 'parents':
      options = {
        sort: (p, c) => (p.chplProductNumber < c.chplProductNumber ? -1 : p.chplProductNumber > c.chplProductNumber ? 1 : 0),
        write: (f) => f.chplProductNumber,
      };
      break;
    case 'conformanceMethods':
      options = {
        sort: (p, c) => (p.conformanceMethod.name < c.conformanceMethod.name ? -1 : p.conformanceMethod.name > c.conformanceMethod.name ? 1 : 0),
        write: (f) => `Conformance Method "${f.conformanceMethod.name}"`,
      };
      break;
    case 'cqmResults':
      options = {
        sort: sortCqms,
        write: (f) => `CQM "${f.cmsId ? f.cmsId : `NQF-${f.nqfNumber}`}"`,
      };
      break;
    case 'certificationResults':
    case 'cqmResults.criteria':
    case 'measures.associatedCriteria':
    case 'testTasks.criteria':
    case 'ucdProcesses.criteria':
      options = {
        sort: (p, c) => sortCriteria(p.criterion ?? p, c.criterion ?? c),
        write: (f) => (f.criterion ? `${f.criterion.number}` : `${f.number ?? f.certificationNumber}`),
      };
      break;
    case 'documents':
      options = {
        sort: (p, c) => (p.fileName < c.fileName ? -1 : p.fileName > c.fileName ? 1 : 0),
        write: (f) => `File "${f.fileName}"`,
      };
      break;
    case 'functionalitiesTested':
      options = {
        sort: (p, c) => {
          if (p.name) { return (p.name < c.name ? -1 : p.name > c.name ? 1 : 0); }
          return (p.functionalityTested.value < c.functionalityTested.value ? -1 : p.functionalityTested.value > c.functionalityTested.value ? 1 : 0);
        },
        write: (f) => `Functionality Tested "${f.functionalityTested?.value ?? f.name}"`,
      };
      break;
    case 'g1MacraMeasures':
    case 'g2MacraMeasures':
      options = {
        sort: (p, c) => (p.abbreviation < c.abbreviation ? -1 : p.abbreviation > c.abbreviation ? 1 : 0),
        write: (f) => `MACRA Measure "${f.abbreviation}"`,
      };
      break;
    case 'meaningfulUseUserHistory':
      options = {
        sort: (p, c) => (p.userCountDate < c.userCountDate ? -1 : p.userCountDate > c.userCountDate ? 1 : 0),
        write: (f) => `Meaningful Use User Count of "${f.userCount}" as of "${getDisplayDateFormat(f.userCountDate)}"`,
      };
      break;
    case 'measures':
      options = {
        sort: (p, c) => (p.measure.id < c.measure.id ? -1 : p.measure.id > c.measure.id ? 1 : 0),
        write: (f) => `Measure "${f.measure.removed ? '<span class="removed">Removed | ' : ''}${f.measure.abbreviation}: ${f.measure.requiredTest}${f.measure.removed ? '</span>' : ''}"`,
      };
      break;
    case 'nonconformities':
      options = {
        sort: (p, c) => {
          if (p.type) {
            return (p.type.id < c.type.id ? -1 : p.type.id > c.type.id ? 1 : 0);
          }
          return (p.nonconformityType < c.nonconformityType ? -1 : p.nonconformityType > c.nonconformityType ? 1 : 0);
        },
        write: (f) => `Non-conformity "${f.type?.title ?? f.nonconformityType}"`,
      };
      break;
    case 'optionalStandards':
      options = {
        sort: (p, c) => (p.citation < c.citation ? -1 : p.citation > c.citation ? 1 : 0),
        write: (f) => `Optional Standard "${f.citation}: ${f.description}"`,
      };
      break;
    case 'promotingInteroperabilityUserHistory':
      options = {
        sort: (p, c) => (p.userCountDate < c.userCountDate ? -1 : p.userCountDate > c.userCountDate ? 1 : 0),
        write: (f) => `Promoting Interoperability User Count of "${f.userCount}" as of "${getDisplayDateFormat(f.userCountDate)}"`,
      };
      break;
    case 'qmsStandards':
      options = {
        sort: (p, c) => (p.qmsStandardName < c.qmsStandardName ? -1 : p.qmsStandardName > c.qmsStandardName ? 1 : 0),
        write: (f) => `QMS Standard "${f.qmsStandardName}"`,
      };
      break;
    case 'requirements':
      options = {
        sort: (p, c) => (p.id < c.id ? -1 : p.id > c.id ? 1 : 0),
        write: (f) => `Requirement "${f.requirementType?.title ?? f.requirement}"`,
      };
      break;
    case 'standards':
      options = {
        sort: (p, c) => (p.standard.value < c.standard.value ? -1 : p.standard.value > c.standard.value ? 1 : 0),
        write: (f) => `Standard "${f.standard.regulatoryTextCitation}: ${f.standard.value}"`,
      };
      break;
    case 'surveillance':
      options = {
        sort: (p, c) => (p.friendlyId < c.friendlyId ? -1 : p.friendlyId > c.friendlyId ? 1 : 0),
        write: (f) => `Surveillance "${f.friendlyId}"`,
      };
      break;
    case 'svaps':
      options = {
        sort: (p, c) => (p.regulatoryTextCitation < c.regulatoryTextCitation ? -1 : p.regulatoryTextCitation > c.regulatoryTextCitation ? 1 : 0),
        write: (f) => `SVAP "${f.regulatoryTextCitation}"`,
      };
      break;
    case 'targetedUsers':
      options = {
        sort: (p, c) => (p.targetedUserName < c.targetedUserName ? -1 : p.targetedUserName > c.targetedUserName ? 1 : 0),
        write: (f) => `Targeted User "${f.targetedUserName}"`,
      };
      break;
    case 'testingLabs':
      options = {
        sort: (p, c) => ((p.testingLabName ?? p.testingLab.name) < (c.testingLabName ?? c.testingLab.name) ? -1 : (p.testingLabName ?? p.testingLab.name) > (c.testingLabName ?? c.testingLab.name) ? 1 : 0),
        write: (f) => `Testing Lab "${f.testingLabName ?? f.testingLab.name}"`,
      };
      break;
    case 'testDataUsed':
      options = {
        sort: (p, c) => ((p.testData?.name ?? p.version) < (c.testData?.name ?? c.version) ? -1 : (p.testData?.name ?? p.version) > (c.testData?.name ?? c.version) ? 1 : 0),
        write: (f) => `Test Data "${f.testData?.name ?? f.version}"`,
      };
      break;
    case 'testFunctionality':
      options = {
        sort: (p, c) => (p.name < c.name ? -1 : p.name > c.name ? 1 : 0),
        write: (f) => `Functionality Tested "${f.name}"`,
      };
      break;
    case 'testProcedures':
      options = {
        sort: (p, c) => {
          if (!p.testProcedure) {
            if (p.testProcedureVersion !== c.testProcedureVersion) {
              console.debug({ p, c, msg: 'Test Procedure Version change found; no name availble' });
            }
            return 0;
          }
          return p.testProcedure?.name < c.testProcedure?.name ? -1 : p.testProcedure?.name > c.testProcedure?.name ? 1 : 0;
        },
        write: (f) => `Test Procedure "${f.testProcedure?.name ?? f.testProcedureVersion}"`,
      };
      break;
    case 'testStandards':
      options = {
        sort: (p, c) => {
          if (p.testStandardName === null && c.testStandardName !== null) {
            return -1;
          }
          if (p.testStandardName !== null && c.testStandardName === null) {
            return 1;
          }
          return (p.testStandardName < c.testStandardName ? -1 : p.testStandardName > c.testStandardName ? 1 : 0);
        },
        write: (f) => `Test Standard "${f.testStandardName}"`,
      };
      break;
    case 'testTasks':
      options = {
        sort: (p, c) => (p.description < c.description ? -1 : p.description > c.description ? 1 : 0),
        write: (f) => `Test Task "${f.description}"`,
      };
      break;
    case 'testToolsUsed':
      options = {
        sort: (p, c) => {
          if (p.testTool) {
            return p.testTool.value < c.testTool.value ? -1 : p.testTool.value > c.testTool.value ? 1 : 0;
          }
          return (p.testToolName < c.testToolName ? -1 : p.testToolName > c.testToolName ? 1 : 0);
        },
        write: (f) => `Test Tool "${f.testToolName ?? f.testTool.value}"`,
      };
      break;
    case 'text':
      options = {
        sort: (p, c) => (p < c ? -1 : p > c ? 1 : 0),
        write: (f) => `"${f}"`,
      };
      break;
    case 'ucdProcesses':
      options = {
        sort: (p, c) => ((p.name ?? p.ucdProcessName) < (c.name ?? c.ucdProcessName) ? -1 : (p.name ?? p.ucdProcessName) > (c.name ?? c.ucdProcessName) ? 1 : 0),
        write: (f) => `UCD Process "${f.name ?? f.ucdProcessName}"`,
      };
      break;
    default:
      if (after.length > 0) {
        console.debug({ before, after, key });
      }
      return undefined;
  }
  const changes = compareArrays(before, after, { ...options, root: key }, rules);
  if (changes && changes.length > 0) {
    return `${title} changes<ul>${changes.join('')}</ul>`;
  }
  return undefined;
};

const compareTestParticipants = (before, after) => {
  const added = after.filter((a) => !before.some((b) => b.id === a.id));
  const removed = before.filter((b) => !after.some((a) => a.id === b.id));
  const changes = [];
  if (added.length > 0) {
    changes.push(`<li>Added ${added.length} Test Participant${added.length > 1 ? 's' : ''}`);
  }
  if (removed.length > 0) {
    changes.push(`<li>Removed ${removed.length} Test Participant${removed.length > 1 ? 's' : ''}`);
  }
  if (changes && changes.length > 0) {
    return `Test Participant changes<ul>${changes.join('')}</ul>`;
  }
  return undefined;
};

const briefLookup = {
  shortCircuit: [
    'cqmResults.criteria.criterion',
    'requirements.requirementType.certificationEdition',
    'requirements.requirementType.requirementGroupType',
    'root.currentStatus',
    'root.developer',
    'root.oldestStatus',
    'root.product',
    'root.version',
    'surveillance.certifiedProduct',
  ],
  'accessibilityStandards.id': { message: () => undefined },
  'additionalSoftware.certifiedProductId': { message: () => undefined },
  'additionalSoftware.certifiedProductNumber': { message: () => undefined },
  'additionalSoftware.name': { message: () => undefined },
  'additionalSoftware.grouping': { message: () => undefined },
  'additionalSoftware.id': { message: () => undefined },
  'additionalSoftware.version': { message: () => undefined },
  'certificationEvents.eventDate': { message: () => undefined },
  'certificationEvents.eventDay': { message: () => undefined },
  'certificationEvents.id': { message: () => undefined },
  'certificationEvents.lastModifiedDate': { message: () => undefined },
  'certificationEvents.lastModifiedUser': { message: () => undefined },
  'certificationEvents.reason': { message: () => undefined },
  'certificationEvents.status': { message: () => undefined },
  'certificationEvents.status.id': { message: () => undefined },
  'certificationEvents.status.name': { message: () => undefined },
  'certificationResults.additionalSoftware': { message: () => undefined },
  'certificationResults.allowedConformanceMethods': { message: () => undefined },
  'certificationResults.allowedMacraMeasures': { message: () => undefined },
  'certificationResults.allowedOptionalStandards': { message: () => undefined },
  'certificationResults.allowedSvaps': { message: () => undefined },
  'certificationResults.allowedTestFunctionalities': { message: () => undefined },
  'certificationResults.allowedTestTools': { message: () => undefined },
  'certificationResults.apiDocumentation': { message: () => undefined },
  'certificationResults.attestationAnswer': { message: () => undefined },
  'certificationResults.conformanceMethods': { message: () => undefined },
  'certificationResults.documentationUrl': { message: () => undefined },
  'certificationResults.exportDocumentation': { message: () => undefined },
  'certificationResults.functionalitiesTested': { message: () => undefined },
  'certificationResults.g1MacraMeasures': { message: (before, after) => compare(before, after, 'g1MacraMeasures', 'G1 MACRA Measures') },
  'certificationResults.g1Success': { message: (before, after) => comparePrimitive(before, after, 'g1Success', 'G1 Success') },
  'certificationResults.g2MacraMeasures': { message: (before, after) => compare(before, after, 'g2MacraMeasures', 'G2 MACRA Measures') },
  'certificationResults.g2Success': { message: (before, after) => comparePrimitive(before, after, 'g2Success', 'G2 Success') },
  'certificationResults.gap': { message: () => undefined },
  'certificationResults.number': { message: () => undefined },
  'certificationResults.optionalStandards': { message: () => undefined },
  'certificationResults.privacySecurityFramework': { message: () => undefined },
  'certificationResults.riskManagementSummaryInformation': { message: () => undefined },
  'certificationResults.sed': { message: () => undefined },
  'certificationResults.serviceBaseUrlList': { message: () => undefined },
  'certificationResults.standards': { message: () => undefined },
  'certificationResults.success': { message: (before, after) => comparePrimitive(before, after, 'success', 'Successful') },
  'certificationResults.svaps': { message: () => undefined },
  'certificationResults.testDataUsed': { message: () => undefined },
  'certificationResults.testFunctionality': { message: () => undefined },
  'certificationResults.testProcedures': { message: () => undefined },
  'certificationResults.testStandards': { message: () => undefined },
  'certificationResults.testTasks': { message: () => undefined },
  'certificationResults.testToolsUsed': { message: () => undefined },
  'certificationResults.title': { message: () => undefined },
  'certificationResults.ucdProcesses': { message: () => undefined },
  'certificationResults.useCases': { message: () => undefined },
  'children.lastModifiedDate': { message: () => undefined },
  'conformanceMethods.conformanceMethod': { message: () => undefined },
  'conformanceMethods.conformanceMethod.removed': { message: () => undefined },
  'conformanceMethods.conformanceMethodVersion': { message: () => undefined },
  'conformanceMethods.id': { message: () => undefined },
  'cqmResults.allVersions': { message: () => undefined },
  'cqmResults.criteria': { message: (before, after) => compare(before, after, 'cqmResults.criteria', 'Certification Criteria') },
  'cqmResults.criteria.certificationId': { message: () => undefined },
  'cqmResults.criteria.id': { message: () => undefined },
  'cqmResults.description': { message: () => undefined },
  'cqmResults.id': { message: () => undefined },
  'cqmResults.nqfNumber': { message: () => undefined },
  'cqmResults.number': { message: () => undefined },
  'cqmResults.success': { message: (before, after) => comparePrimitive(before, after, 'success', 'Successful') },
  'cqmResults.successVersions': { message: (before, after) => compare(before, after, 'text', 'CQM Versions') },
  'cqmResults.title': { message: () => undefined },
  'functionalitiesTested.functionalityTested.criteria': { message: () => undefined },
  'measures.associatedCriteria': { message: (before, after) => compare(before, after, 'measures.associatedCriteria', 'Certification Criteria') },
  'measures.id': { message: () => undefined },
  'measures.measure.allowedCriteria': { message: () => undefined },
  'measures.measureType': { message: () => 'Measure Type' },
  'measures.measureType.id': { message: () => undefined },
  'measures.measureType.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Type') },
  'nonconformities.capApprovalDate': { message: () => undefined },
  'nonconformities.capApprovalDay': { message: () => undefined },
  'nonconformities.capEndDate': { message: () => undefined },
  'nonconformities.capEndDay': { message: () => undefined },
  'nonconformities.capMustCompleteDate': { message: () => undefined },
  'nonconformities.capMustCompleteDay': { message: () => undefined },
  'nonconformities.capStartDate': { message: () => undefined },
  'nonconformities.capStartDay': { message: () => undefined },
  'nonconformities.dateOfDetermination': { message: () => undefined },
  'nonconformities.developerExplanation': { message: () => undefined },
  'nonconformities.documents': { message: () => undefined },
  'nonconformities.findings': { message: () => undefined },
  'nonconformities.id': { message: () => undefined },
  'nonconformities.lastModifiedDate': { message: () => undefined },
  'nonconformities.nonconformityCloseDate': { message: () => undefined },
  'nonconformities.nonconformityCloseDay': { message: () => undefined },
  'nonconformities.nonconformityStatus': { message: () => undefined },
  'nonconformities.resolution': { message: () => undefined },
  'nonconformities.summary': { message: () => undefined },
  'nonconformities.status': { message: () => undefined },
  'nonconformities.status.id': { message: () => undefined },
  'nonconformities.status.name': { message: () => undefined },
  'parents.lastModifiedDate': { message: () => undefined },
  'qmsStandards.id': { message: () => undefined },
  'qmsStandards.applicableCriteria': { message: () => undefined },
  'qmsStandards.qmsModification': { message: () => undefined },
  'requirements.criterion': { message: () => undefined },
  'requirements.criterion.certificationEdition': { message: () => undefined },
  'requirements.criterion.certificationEditionId': { message: () => undefined },
  'requirements.criterion.id': { message: () => undefined },
  'requirements.criterion.number': { message: () => undefined },
  'requirements.criterion.removed': { message: () => undefined },
  'requirements.criterion.title': { message: () => undefined },
  'requirements.nonconformities': { message: () => undefined },
  'requirements.result': { message: () => undefined },
  'requirements.result.id': { message: () => undefined },
  'requirements.result.name': { message: () => undefined },
  'requirements.requirement': { message: () => undefined },
  'requirements.requirementType': { message: () => undefined },
  'requirements.requirementType.id': { message: () => undefined },
  'requirements.requirementType.number': { message: () => undefined },
  'requirements.requirementType.removed': { message: () => undefined },
  'requirements.requirementType.title': { message: () => undefined },
  'requirements.requirementTypeOther': { message: () => undefined },
  'requirements.requirementName': { message: () => undefined },
  'requirements.type': { message: () => undefined },
  'requirements.type.id': { message: () => undefined },
  'requirements.type.name': { message: () => undefined },
  'root.acbCertificationId': { message: () => undefined },
  'root.accessibilityStandards': { message: () => undefined },
  'root.businessErrorMessages': { message: () => undefined },
  'root.certificationDate': { message: () => undefined },
  'root.certificationDay': { message: () => undefined },
  'root.certificationEvents': { message: () => undefined },
  'root.certificationResults': { message: (before, after) => compare(before, after, 'certificationResults', 'Certification Criteria') },
  'root.certificationStatus': { message: () => undefined },
  'root.certificationStatus.id': { message: () => undefined },
  'root.certificationStatus.date': { message: () => undefined },
  'root.certificationStatus.name': { message: () => undefined },
  'root.chplProductNumber': { message: (before, after) => comparePrimitive(before, after, 'chplProductNumber', 'CHPL Product Number') },
  'root.chplProductNumberHistory': { message: () => undefined }, // probably?
  'root.classificationType': { message: () => undefined },
  'root.classificationType.id': { message: () => undefined },
  'root.classificationType.name': { message: () => undefined },
  'root.countCerts': { message: () => undefined },
  'root.countClosedNonconformities': { message: () => undefined },
  'root.countClosedSurveillance': { message: () => undefined },
  'root.countCqms': { message: () => undefined },
  'root.countOpenNonconformities': { message: () => undefined },
  'root.countOpenSurveillance': { message: () => undefined },
  'root.cqmResults': { message: (before, after) => compare(before, after, 'cqmResults', 'CQM Changes') },
  'root.curesUpdate': { message: (before, after) => comparePrimitive(before, after, 'curesUpdate', '2015 Edition Cures Update status') },
  'root.dataErrorMessages': { message: () => undefined },
  'root.decertificationDate': { message: () => undefined },
  'root.decertificationDay': { message: () => undefined },
  'root.directReviews': { message: () => undefined },
  'root.errorMessages': { message: () => undefined },
  'root.ics': { message: () => undefined },
  'root.ics.children': { message: () => undefined },
  'root.ics.inherits': { message: () => undefined },
  'root.ics.parents': { message: () => undefined },
  'root.lastModifiedDate': { message: () => undefined },
  'root.mandatoryDisclosures': { message: () => undefined },
  'root.meaningfulUseUserHistory': { message: () => undefined },
  'root.measures': { message: (before, after) => compare(before, after, 'measures', 'G1/G2 Measure') },
  'root.otherAcb': { message: () => undefined },
  'root.practiceType': { message: () => undefined },
  'root.practiceType.id': { message: () => undefined },
  'root.practiceType.name': { message: () => undefined },
  'root.productAdditionalSoftware': { message: () => undefined },
  'root.promotingInteroperabilityUserHistory': { message: (before, after) => compare(before, after, 'promotingInteroperabilityUserHistory', 'Promoting Interoperability User History') },
  'root.qmsStandards': { message: () => undefined },
  'root.reportFileLocation': { message: () => undefined },
  'root.rwtPlansCheckDate': { message: () => undefined },
  'root.rwtPlansUrl': { message: (before, after) => comparePrimitive(before, after, 'rwtPlansUrl', 'Real World Testing Plans URL') },
  'root.rwtResultsCheckDate': { message: () => undefined },
  'root.rwtResultsUrl': { message: (before, after) => comparePrimitive(before, after, 'rwtResultsUrl', 'Real World Testing Results URL') },
  'root.sed': { message: () => undefined },
  'root.sed.testTasks': { message: () => undefined },
  'root.sed.ucdProcesses': { message: () => undefined },
  'root.sedIntendedUserDescription': { message: () => undefined },
  'root.sedReportFileLocation': { message: () => undefined },
  'root.sedTestingEndDate': { message: () => undefined },
  'root.sedTestingEndDay': { message: () => undefined },
  'root.surveillance': { message: () => undefined },
  'root.svapNoticeUrl': { message: () => undefined },
  'root.targetedUsers': { message: () => undefined },
  'root.termsOfUse': { message: () => undefined },
  'root.testingLab': { message: () => undefined },
  'root.testingLab.code': { message: () => undefined },
  'root.testingLab.id': { message: () => undefined },
  'root.testingLab.name': { message: () => undefined },
  'root.testingLabs': { message: () => undefined },
  'root.transparencyAttestationUrl': { message: () => undefined },
  'root.visibleOnChpl': { message: () => undefined },
  'root.warningMessages': { message: () => undefined },
  'surveillance.endDate': { message: () => undefined },
  'surveillance.endDay': { message: () => undefined },
  'surveillance.errorMessages': { message: () => undefined },
  'surveillance.lastModifiedDate': { message: () => undefined },
  'surveillance.requirements': { message: () => undefined },
  'surveillance.startDate': { message: () => undefined },
  'surveillance.startDay': { message: () => undefined },
  'surveillance.warningMessages': { message: () => undefined },
  'testingLabs.id': { message: () => undefined },
  'testingLabs.testingLab': { message: () => undefined },
  'testDataUsed.id': { message: () => undefined },
  'testDataUsed.alteration': { message: () => undefined },
  'testDataUsed.version': { message: () => undefined },
  'testProcedures.id': { message: () => undefined },
  'testProcedures.testProcedureVersion': { message: () => undefined },
  'testStandards.id': { message: () => undefined },
  'testTasks.criteria': { message: () => undefined },
  'testTasks.criteria.id': { message: () => undefined },
  'testTasks.criteria.removed': { message: () => undefined },
  'testTasks.criteria.title': { message: () => undefined },
  'testTasks.id': { message: () => undefined },
  'testTasks.taskErrors': { message: () => undefined },
  'testTasks.taskErrorsStddev': { message: () => undefined },
  'testTasks.taskPathDeviationObserved': { message: () => undefined },
  'testTasks.taskPathDeviationOptimal': { message: () => undefined },
  'testTasks.taskRating': { message: () => undefined },
  'testTasks.taskRatingScale': { message: () => undefined },
  'testTasks.taskRatingStddev': { message: () => undefined },
  'testTasks.taskSuccessAverage': { message: () => undefined },
  'testTasks.taskSuccessStddev': { message: () => undefined },
  'testTasks.taskTimeAvg': { message: () => undefined },
  'testTasks.taskTimeDeviationObservedAvg': { message: () => undefined },
  'testTasks.taskTimeDeviationOptimalAvg': { message: () => undefined },
  'testTasks.taskTimeStddev': { message: () => undefined },
  'testTasks.testParticipants': { message: () => undefined },
  'testTasks.testTaskId': { message: () => undefined },
  'testToolsUsed.id': { message: () => undefined },
  'testToolsUsed.testTool.criteria': { message: () => undefined },
  'testToolsUsed.testToolVersion': { message: () => undefined },
  'testToolsUsed.version': { message: () => undefined },
  'ucdProcesses.criteria': { message: () => undefined },
  'ucdProcesses.criteria.id': { message: () => undefined },
  'ucdProcesses.criteria.removed': { message: () => undefined },
  'ucdProcesses.criteria.title': { message: () => undefined },
  'ucdProcesses.details': { message: () => undefined },
  'ucdProcesses.id': { message: () => undefined },
  'ucdProcesses.name': { message: () => undefined },
};

const lookup = {
  ...briefLookup,
  'additionalSoftware.certifiedProductNumber': { message: (before, after) => comparePrimitive(before, after, 'certifiedProductNumber', 'Certified Product Code') },
  'additionalSoftware.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'additionalSoftware.grouping': { message: (before, after) => comparePrimitive(before, after, 'grouping', 'Group') },
  'additionalSoftware.version': { message: (before, after) => comparePrimitive(before, after, 'version', 'Version') },
  'certificationEvents.eventDate': { message: (before, after) => comparePrimitive(before, after, 'eventDate', 'Status Change Date', getDisplayDateFormat) },
  'certificationEvents.eventDay': { message: (before, after) => comparePrimitive(before, after, 'eventDay', 'Status Change Date', getDisplayDateFormat) },
  'certificationEvents.id': { message: () => undefined },
  'certificationEvents.lastModifiedDate': { message: () => undefined },
  'certificationEvents.lastModifiedUser': { message: () => undefined },
  'certificationEvents.reason': { message: (before, after) => comparePrimitive(before, after, 'reason', 'Reason for Status change') },
  'certificationEvents.status': { message: () => 'Certification Status' },
  'certificationEvents.status.id': { message: () => undefined },
  'certificationEvents.status.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Status') },
  'certificationResults.additionalSoftware': { message: (before, after) => compare(before, after, 'additionalSoftware', 'Relied Upon Software') },
  'certificationResults.apiDocumentation': { message: (before, after) => comparePrimitive(before, after, 'apiDocumentation', 'API Documentation') },
  'certificationResults.attestationAnswer': { message: (before, after) => comparePrimitive(before, after, 'attestationAnswer', 'Attestation') },
  'certificationResults.conformanceMethods': { message: (before, after) => compare(before, after, 'conformanceMethods', 'Conformance Methods') },
  'certificationResults.documentationUrl': { message: (before, after) => comparePrimitive(before, after, 'documentationUrl', 'Documentation URL') },
  'certificationResults.exportDocumentation': { message: (before, after) => comparePrimitive(before, after, 'exportDocumentation', 'Export Documentation') },
  'certificationResults.functionalitiesTested': { message: (before, after) => compare(before, after, 'functionalitiesTested', 'Functionality Tested') },
  'certificationResults.gap': { message: (before, after) => comparePrimitive(before, after, 'gap', 'GAP') },
  'certificationResults.optionalStandards': { message: (before, after) => compare(before, after, 'optionalStandards', 'Optional Standards') },
  'certificationResults.privacySecurityFramework': { message: (before, after) => comparePrimitive(before, after, 'privacySecurityFramework', 'Privacy & Security Framework') },
  'certificationResults.riskManagementSummaryInformation': { message: (before, after) => comparePrimitive(before, after, 'riskManagementSummaryInformation', 'Risk Management Summary Information') },
  'certificationResults.sed': { message: (before, after) => comparePrimitive(before, after, 'sed', 'SED tested') },
  'certificationResults.serviceBaseUrlList': { message: (before, after) => comparePrimitive(before, after, 'serviceBaseUrlList', 'Service Base URL List') },
  'certificationResults.standards': { message: (before, after) => compare(before, after, 'standards', 'Standards') },
  'certificationResults.svaps': { message: (before, after) => compare(before, after, 'svaps', 'SVAP') },
  'certificationResults.testDataUsed': { message: (before, after) => compare(before, after, 'testDataUsed', 'Test Data') },
  'certificationResults.testFunctionality': { message: (before, after) => compare(before, after, 'testFunctionality', 'Functionality Tested') },
  'certificationResults.testProcedures': { message: (before, after) => compare(before, after, 'testProcedures', 'Test Procedures') },
  'certificationResults.testStandards': { message: (before, after) => compare(before, after, 'testStandards', 'Test Standards') },
  'certificationResults.testTasks': { message: (before, after) => compare(before, after, 'testTasks', 'Test Tasks') },
  'certificationResults.testToolsUsed': { message: (before, after) => compare(before, after, 'testToolsUsed', 'Test Tools') },
  'certificationResults.ucdProcesses': { message: (before, after) => compare(before, after, 'ucdProcesses', 'UCD Processes') },
  'certificationResults.useCases': { message: (before, after) => comparePrimitive(before, after, 'useCases', 'Use Cases') },
  'conformanceMethods.conformanceMethod': { message: (before) => `Conformance Method "${before.name}"` },
  'conformanceMethods.conformanceMethod.removed': { message: (before, after) => comparePrimitive(before, after, 'removed', 'Removed') },
  'conformanceMethods.conformanceMethodVersion': { message: (before, after) => comparePrimitive(before, after, 'conformanceMethodVersion', 'Version') },
  'nonconformities.capApprovalDate': { message: (before, after) => comparePrimitive(before, after, 'capApprovalDate', 'CAP Approval Date', getDisplayDateFormat) },
  'nonconformities.capApprovalDay': { message: (before, after) => comparePrimitive(before, after, 'capApprovalDay', 'CAP Approval Day', getDisplayDateFormat) },
  'nonconformities.capEndDate': { message: (before, after) => comparePrimitive(before, after, 'capEndDate', 'CAP End Date', getDisplayDateFormat) },
  'nonconformities.capEndDay': { message: (before, after) => comparePrimitive(before, after, 'capEndDay', 'CAP End Day', getDisplayDateFormat) },
  'nonconformities.capMustCompleteDate': { message: (before, after) => comparePrimitive(before, after, 'capMustCompleteDate', 'CAP Must Complete Date', getDisplayDateFormat) },
  'nonconformities.capMustCompleteDay': { message: (before, after) => comparePrimitive(before, after, 'capMustCompleteDay', 'CAP Must Complete Day', getDisplayDateFormat) },
  'nonconformities.capStartDate': { message: (before, after) => comparePrimitive(before, after, 'capStartDate', 'CAP Start Date', getDisplayDateFormat) },
  'nonconformities.capStartDay': { message: (before, after) => comparePrimitive(before, after, 'capStartDay', 'CAP Start Day', getDisplayDateFormat) },
  'nonconformities.dateOfDetermination': { message: (before, after) => comparePrimitive(before, after, 'dateOfDetermination', 'Date of Determination', getDisplayDateFormat) },
  'nonconformities.developerExplanation': { message: (before, after) => comparePrimitive(before, after, 'developerExplanation', 'Developer Explanation') },
  'nonconformities.documents': { message: (before, after) => compare(before, after, 'documents', 'Documents') },
  'nonconformities.findings': { message: (before, after) => comparePrimitive(before, after, 'findings', 'Findings') },
  'nonconformities.nonconformityCloseDate': { message: (before, after) => comparePrimitive(before, after, 'nonconformityCloseDate', 'Close Date', getDisplayDateFormat) },
  'nonconformities.nonconformityCloseDay': { message: (before, after) => comparePrimitive(before, after, 'nonconformityCloseDay', 'Close Day', getDisplayDateFormat) },
  'nonconformities.nonconformityStatus': { message: (before, after) => comparePrimitive(before, after, 'nonconformityStatus', 'Status') },
  'nonconformities.resolution': { message: (before, after) => comparePrimitive(before, after, 'resolution', 'Resolution') },
  'nonconformities.summary': { message: (before, after) => comparePrimitive(before, after, 'summary', 'Summary') },
  'nonconformities.status': { message: () => 'Non-conformity status' },
  'nonconformities.status.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Status') },
  'qmsStandards.applicableCriteria': { message: (before, after) => comparePrimitive(before, after, 'applicableCriteria', 'Applicable Criteria') },
  'qmsStandards.qmsModification': { message: (before, after) => comparePrimitive(before, after, 'qmsModification', 'QMS Modification') },
  'requirements.criterion': { message: () => 'Certification Criterion' },
  'requirements.criterion.number': { message: (before, after) => comparePrimitive(before, after, 'number', 'Number') },
  'requirements.criterion.title': { message: (before, after) => comparePrimitive(before, after, 'title', 'Title') },
  'requirements.nonconformities': { message: (before, after) => compare(before, after, 'nonconformities', 'Non-conformities') },
  'requirements.result': { message: () => 'Requirement' },
  'requirements.result.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'requirements.requirement': { message: (before, after) => comparePrimitive(before, after, 'requirement', 'Requirement') },
  'requirements.requirementType': { message: () => 'Requirement Type' },
  'requirements.requirementType.title': { message: (before, after) => comparePrimitive(before, after, 'title', 'Title') },
  'requirements.requirementTypeOther': { message: (before, after) => comparePrimitive(before, after, 'requirementTypeOther', 'Requirement Type (Other)') },
  'requirements.requirementName': { message: (before, after) => comparePrimitive(before, after, 'requirementName', 'Requirement Name') },
  'requirements.type': { message: () => 'Requirement Type' },
  'requirements.type.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Type') },
  'root.acbCertificationId': { message: (before, after) => comparePrimitive(before, after, 'acbCertificationId', 'ONC-ACB Certification ID') },
  'root.accessibilityStandards': { message: (before, after) => compare(before, after, 'accessibilityStandards', 'Accessibility Standards') },
  'root.certificationDate': { message: (before, after) => comparePrimitive(before, after, 'certificationDate', 'Certification Date', getDisplayDateFormat, 'certificationDay') },
  'root.certificationDay': { message: (before, after) => comparePrimitive(before, after, 'certificationDay', 'Certification Day', getDisplayDateFormat) },
  'root.certificationEvents': { message: (before, after) => compare(before, after, 'certificationEvents', 'Certification Status') },
  'root.certificationStatus': { message: () => 'Certification Status' },
  'root.certificationStatus.date': { message: (before, after) => comparePrimitive(before, after, 'date', 'Certification Status Date', getDisplayDateFormat) },
  'root.certificationStatus.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Status') },
  'root.classificationType': { message: () => 'Listing Classification' },
  'root.classificationType.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Type') },
  'root.decertificationDay': { message: (before, after) => comparePrimitive(before, after, 'decertificationDay', 'Decertification Date', getDisplayDateFormat) },
  'root.decertificationDate': { message: (before, after) => comparePrimitive(before, after, 'decertificationDate', 'Decertification Date', getDisplayDateFormat) },
  'root.': { message: () => undefined },
  'root.ics': {
    message: (before) => {
      if (typeof before !== 'object') { console.debug({ before, key: 'root.ics' }); }
      return 'Inherited Certified Status changes';
    },
  },
  'root.ics.children': { message: (before, after) => compare(before, after, 'children', 'ICS Children') },
  'root.ics.inherits': { message: (before, after) => comparePrimitive(before, after, 'inherits', 'ICS Status') },
  'root.ics.parents': { message: (before, after) => compare(before, after, 'parents', 'ICS Parents') },
  'root.mandatoryDisclosures': { message: (before, after) => comparePrimitive(before, after, 'mandatoryDisclosures', 'Mandatory Disclosures URL') },
  'root.meaningfulUseUserHistory': { message: (before, after) => compare(before, after, 'meaningfulUseUserHistory', 'Meaningful Use User History') },
  'root.otherAcb': { message: (before, after) => comparePrimitive(before, after, 'otherAcb', 'Other ONC-ACB') },
  'root.practiceType': { message: () => 'Practice Type' },
  'root.practiceType.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'root.productAdditionalSoftware': { message: (before, after) => comparePrimitive(before, after, 'productAdditionalSoftware', 'Listing Relied Upon Software') },
  'root.qmsStandards': { message: (before, after) => compare(before, after, 'qmsStandards', 'QMS Standards') },
  'root.reportFileLocation': { message: (before, after) => comparePrimitive(before, after, 'reportFileLocation', 'ONC-ATL Test Report File Location') },
  'root.rwtPlansCheckDate': { message: (before, after) => comparePrimitive(before, after, 'rwtPlansCheckDate', 'Real World Testing Plans Last Completeness Check Date', getDisplayDateFormat) },
  'root.rwtResultsCheckDate': { message: (before, after) => comparePrimitive(before, after, 'rwtResultsCheckDate', 'Real World Testing Results Last Completeness Check Date', getDisplayDateFormat) },
  'root.sed': { message: () => 'SED Changes' },
  'root.sed.testTasks': { message: (before, after) => compare(before, after, 'testTasks', 'SED Test Tasks') },
  'root.sed.ucdProcesses': { message: (before, after) => compare(before, after, 'ucdProcesses', 'SED Processes') },
  'root.sedIntendedUserDescription': { message: (before, after) => comparePrimitive(before, after, 'sedIntendedUserDescription', 'SED Intended User Description') },
  'root.sedReportFileLocation': { message: (before, after) => comparePrimitive(before, after, 'sedReportFileLocation', 'SED Report File Location') },
  'root.sedTestingEndDate': { message: (before, after) => comparePrimitive(before, after, 'sedTestingEndDate', 'SED Testing End Date', getDisplayDateFormat, 'sedTestingEndDay') },
  'root.sedTestingEndDay': { message: (before, after) => comparePrimitive(before, after, 'sedTestingEndDay', 'SED Testing End Date', getDisplayDateFormat) },
  'root.surveillance': { message: (before, after) => compare(before, after, 'surveillance', 'Surveillance') },
  'root.svapNoticeUrl': { message: (before, after) => comparePrimitive(before, after, 'svapNoticeUrl', 'SVAP Notice URL') },
  'root.targetedUsers': { message: (before, after) => compare(before, after, 'targetedUsers', 'Targeted Users ') },
  'root.termsOfUse': { message: (before, after) => comparePrimitive(before, after, 'termsOfUse', 'Terms Of Use') },
  'root.testingLab': { message: () => 'ONC-ATL' },
  'root.testingLab.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'ONC-ATL') },
  'root.testingLabs': { message: (before, after) => compare(before, after, 'testingLabs', 'Testing Labs') },
  'root.transparencyAttestationUrl': { message: (before, after) => comparePrimitive(before, after, 'transparencyAttestationUrl', 'Mandatory Disclosures URL') },
  'root.visibleOnChpl': { message: (before, after) => comparePrimitive(before, after, 'visibleOnChpl', 'Visible on CHPL') },
  'surveillance.endDate': { message: (before, after) => comparePrimitive(before, after, 'endDate', 'End Date', getDisplayDateFormat) },
  'surveillance.endDay': { message: (before, after) => comparePrimitive(before, after, 'endDay', 'End Day', getDisplayDateFormat) },
  'surveillance.requirements': { message: (before, after) => compare(before, after, 'requirements', 'Requirements') },
  'surveillance.startDate': { message: (before, after) => comparePrimitive(before, after, 'startDate', 'Start Date', getDisplayDateFormat) },
  'surveillance.startDay': { message: (before, after) => comparePrimitive(before, after, 'startDay', 'Start Day', getDisplayDateFormat) },
  'testDataUsed.alteration': { message: (before, after) => comparePrimitive(before, after, 'alteration', 'Alteration') },
  'testDataUsed.version': { message: (before, after) => comparePrimitive(before, after, 'version', 'Version') },
  'testProcedures.testProcedureVersion': { message: (before, after) => comparePrimitive(before, after, 'testProcedureVersion', 'Version') },
  'testTasks.criteria': { message: (before, after) => compare(before, after, 'testTasks.criteria', 'Certification Criteria') },
  'testTasks.taskErrors': { message: (before, after) => comparePrimitive(before, after, 'taskErrors', 'Task Errors') },
  'testTasks.taskErrorsStddev': { message: (before, after) => comparePrimitive(before, after, 'taskErrorsStddev', 'Task Errors Standard Deviation') },
  'testTasks.taskPathDeviationObserved': { message: (before, after) => comparePrimitive(before, after, 'taskPathDeviationObserved', 'Task Path Deviation Observed') },
  'testTasks.taskPathDeviationOptimal': { message: (before, after) => comparePrimitive(before, after, 'taskPathDeviationOptimal', 'Task Path Deviation Optimal') },
  'testTasks.taskRating': { message: (before, after) => comparePrimitive(before, after, 'taskRating', 'Task Rating') },
  'testTasks.taskRatingScale': { message: (before, after) => comparePrimitive(before, after, 'taskRatingScale', 'Task Rating Scale') },
  'testTasks.taskRatingStddev': { message: (before, after) => comparePrimitive(before, after, 'taskRatingStddev', 'Task Rating Standard Deviation') },
  'testTasks.taskSuccessAverage': { message: (before, after) => comparePrimitive(before, after, 'taskSuccessAverage', 'Task Success Average') },
  'testTasks.taskSuccessStddev': { message: (before, after) => comparePrimitive(before, after, 'taskSuccessStddev', 'Task Success Standard Deviation') },
  'testTasks.taskTimeAvg': { message: (before, after) => comparePrimitive(before, after, 'taskTimeAvg', 'Task Time Average') },
  'testTasks.taskTimeDeviationObservedAvg': { message: (before, after) => comparePrimitive(before, after, 'taskTimeDeviationObservedAvg', 'Task Time Deviation Observed Average') },
  'testTasks.taskTimeDeviationOptimalAvg': { message: (before, after) => comparePrimitive(before, after, 'taskTimeDeviationOptimalAvg', 'Task Time Deviation Optimal Average') },
  'testTasks.taskTimeStddev': { message: (before, after) => comparePrimitive(before, after, 'taskTimeStddev', 'Task Time Standard Deviation') },
  'testTasks.testParticipants': { message: compareTestParticipants },
  'testToolsUsed.testToolVersion': { message: (before, after) => comparePrimitive(before, after, 'testToolVersion', 'Version') },
  'testToolsUsed.version': { message: (before, after) => comparePrimitive(before, after, 'version', 'Version') },
  'ucdProcesses.criteria': { message: (before, after) => compare(before, after, 'ucdProcesses.criteria', 'Certification Criteria') },
  'ucdProcesses.details': { message: (before, after) => comparePrimitive(before, after, 'details', 'UCD Process Details') },
  'ucdProcesses.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
};

const compareListing = (prev, curr, optionalRules = lookup) => {
  rules = optionalRules;
  return compareObject(prev, curr, rules);
};

export {
  briefLookup,
  compareListing,
};
