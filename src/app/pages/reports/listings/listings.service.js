import { compareArrays, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { isCures, sortCriteria } from 'services/criteria.service';
import { sortCqms } from 'services/cqms.service';
import { getDisplayDateFormat } from 'services/date-util';

let lookup;

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
        write: (f) => `Certification Status "${f.status?.name ?? f.certificationStatusName}"`,
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
        write: (f) => `CQM "${f.cmsId}"`,
      };
      break;
    case 'certificationResults':
    case 'cqmResults.criteria':
    case 'measures.associatedCriteria':
    case 'testTasks.criteria':
    case 'ucdProcesses.criteria':
      options = {
        sort: (p, c) => sortCriteria(p.criterion ?? p, c.criterion ?? c),
        write: (f) => (f.criterion ? `${f.criterion.number}${isCures(f.criterion) ? ' <span class="cures-update">(Cures Update)</span>' : ''}` : `${f.number ?? f.certificationNumber}${isCures(f) ? ' <span class="cures-update">(Cures Update)</span>' : ''}`),
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
        sort: (p, c) => (p.name < c.name ? -1 : p.name > c.name ? 1 : 0),
        write: (f) => `Test Functionality "${f.name}"`,
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
        sort: (p, c) => (p.testingLabName < c.testingLabName ? -1 : p.testingLabName > c.testingLabName ? 1 : 0),
        write: (f) => `Testing Lab "${f.testingLabName}"`,
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
        write: (f) => `Test Functionality "${f.name}"`,
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
        sort: (p, c) => (p.testToolName < c.testToolName ? -1 : p.testToolName > c.testToolName ? 1 : 0),
        write: (f) => `Test Tool "${f.testToolName}"`,
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
  const changes = compareArrays(before, after, { ...options, root: key }, lookup);
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

lookup = {
  shortCircuit: [
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
  'additionalSoftware.certifiedProductNumber': { message: (before, after) => comparePrimitive(before, after, 'certifiedProductNumber', 'Certified Product Code') },
  'additionalSoftware.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'additionalSoftware.grouping': { message: (before, after) => comparePrimitive(before, after, 'grouping', 'Group') },
  'additionalSoftware.id': { message: () => undefined },
  'additionalSoftware.version': { message: (before, after) => comparePrimitive(before, after, 'version', 'Version') },
  'certificationEvents.eventDate': { message: (before, after) => comparePrimitive(before, after, 'eventDate', 'Status Change Date', getDisplayDateFormat) },
  'certificationEvents.id': { message: () => undefined },
  'certificationEvents.lastModifiedDate': { message: () => undefined },
  'certificationEvents.lastModifiedUser': { message: () => undefined },
  'certificationEvents.reason': { message: (before, after) => comparePrimitive(before, after, 'reason', 'Reason for Status change') },
  'certificationEvents.status': { message: () => 'Certification Status' },
  'certificationEvents.status.id': { message: () => undefined },
  'certificationEvents.status.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Status') },
  'certificationResults.additionalSoftware': { message: (before, after) => compare(before, after, 'additionalSoftware', 'Relied Upon Software') },
  'certificationResults.allowedConformanceMethods': { message: () => undefined },
  'certificationResults.allowedMacraMeasures': { message: () => undefined },
  'certificationResults.allowedOptionalStandards': { message: () => undefined },
  'certificationResults.allowedSvaps': { message: () => undefined },
  'certificationResults.allowedTestFunctionalities': { message: () => undefined },
  'certificationResults.allowedTestTools': { message: () => undefined },
  'certificationResults.apiDocumentation': { message: (before, after) => comparePrimitive(before, after, 'apiDocumentation', 'API Documentation') },
  'certificationResults.attestationAnswer': { message: (before, after) => comparePrimitive(before, after, 'attestationAnswer', 'Attestation') },
  'certificationResults.conformanceMethods': { message: (before, after) => compare(before, after, 'conformanceMethods', 'Conformance Methods') },
  'certificationResults.documentationUrl': { message: (before, after) => comparePrimitive(before, after, 'documentationUrl', 'Documentation URL') },
  'certificationResults.exportDocumentation': { message: (before, after) => comparePrimitive(before, after, 'exportDocumentation', 'Export Documentation') },
  'certificationResults.functionalitiesTested': { message: (before, after) => compare(before, after, 'functionalitiesTested', 'Test Functionality') },
  'certificationResults.g1MacraMeasures': { message: (before, after) => compare(before, after, 'g1MacraMeasures', 'G1 MACRA Measures') },
  'certificationResults.g1Success': { message: (before, after) => comparePrimitive(before, after, 'g1Success', 'G1 Success') },
  'certificationResults.g2MacraMeasures': { message: (before, after) => compare(before, after, 'g2MacraMeasures', 'G2 MACRA Measures') },
  'certificationResults.g2Success': { message: (before, after) => comparePrimitive(before, after, 'g2Success', 'G2 Success') },
  'certificationResults.gap': { message: (before, after) => comparePrimitive(before, after, 'gap', 'GAP') },
  'certificationResults.number': { message: () => undefined },
  'certificationResults.optionalStandards': { message: (before, after) => compare(before, after, 'optionalStandards', 'Optional Standards') },
  'certificationResults.privacySecurityFramework': { message: (before, after) => comparePrimitive(before, after, 'privacySecurityFramework', 'Privacy & Security Framework') },
  'certificationResults.sed': { message: (before, after) => comparePrimitive(before, after, 'sed', 'SED tested') },
  'certificationResults.serviceBaseUrlList': { message: (before, after) => comparePrimitive(before, after, 'serviceBaseUrlList', 'Service Base URL List') },
  'certificationResults.success': { message: (before, after) => comparePrimitive(before, after, 'success', 'Successful') },
  'certificationResults.svaps': { message: (before, after) => compare(before, after, 'svaps', 'SVAP') },
  'certificationResults.testDataUsed': { message: (before, after) => compare(before, after, 'testDataUsed', 'Test Data') },
  'certificationResults.testFunctionality': { message: (before, after) => compare(before, after, 'testFunctionality', 'Test Functionality') },
  'certificationResults.testProcedures': { message: (before, after) => compare(before, after, 'testProcedures', 'Test Procedures') },
  'certificationResults.testStandards': { message: (before, after) => compare(before, after, 'testStandards', 'Test Standards') },
  'certificationResults.testTasks': { message: (before, after) => compare(before, after, 'testTasks', 'Test Tasks') },
  'certificationResults.testToolsUsed': { message: (before, after) => compare(before, after, 'testToolsUsed', 'Test Tools') },
  'certificationResults.title': { message: () => undefined },
  'certificationResults.ucdProcesses': { message: (before, after) => compare(before, after, 'ucdProcesses', 'UCD Processes') },
  'certificationResults.useCases': { message: (before, after) => comparePrimitive(before, after, 'useCases', 'Use Cases') },
  'children.lastModifiedDate': { message: () => undefined },
  'conformanceMethods.conformanceMethod': { message: (before) => `Conformance Method "${before.name}"` },
  'conformanceMethods.conformanceMethod.removed': { message: (before, after) => comparePrimitive(before, after, 'removed', 'Removed') },
  'conformanceMethods.conformanceMethodVersion': { message: (before, after) => comparePrimitive(before, after, 'conformanceMethodVersion', 'Version') },
  'conformanceMethods.id': { message: () => undefined },
  'cqmResults.allVersions': { message: () => undefined },
  'cqmResults.criteria': { message: (before, after) => compare(before, after, 'cqmResults.criteria', 'Certification Criteria') },
  'cqmResults.criteria.id': { message: () => undefined },
  'cqmResults.description': { message: () => undefined },
  'cqmResults.id': { message: () => undefined },
  'cqmResults.number': { message: () => undefined },
  'cqmResults.nqfNumber': { message: () => undefined },
  'cqmResults.success': { message: (before, after) => comparePrimitive(before, after, 'success', 'Successful') },
  'cqmResults.successVersions': { message: (before, after) => compare(before, after, 'text', 'CQM Versions') },
  'cqmResults.title': { message: () => undefined },
  'measures.associatedCriteria': { message: (before, after) => compare(before, after, 'measures.associatedCriteria', 'Certification Criteria') },
  'measures.id': { message: () => undefined },
  'measures.measure.allowedCriteria': { message: () => undefined },
  'measures.measureType': { message: () => 'Measure Type' },
  'measures.measureType.id': { message: () => undefined },
  'measures.measureType.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Type') },
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
  'nonconformities.id': { message: () => undefined },
  'nonconformities.lastModifiedDate': { message: () => undefined },
  'nonconformities.nonconformityCloseDate': { message: (before, after) => comparePrimitive(before, after, 'nonconformityCloseDate', 'Close Date', getDisplayDateFormat) },
  'nonconformities.nonconformityCloseDay': { message: (before, after) => comparePrimitive(before, after, 'nonconformityCloseDay', 'Close Day', getDisplayDateFormat) },
  'nonconformities.nonconformityStatus': { message: (before, after) => comparePrimitive(before, after, 'nonconformityStatus', 'Status') },
  'nonconformities.resolution': { message: (before, after) => comparePrimitive(before, after, 'resolution', 'Resolution') },
  'nonconformities.summary': { message: (before, after) => comparePrimitive(before, after, 'summary', 'Summary') },
  'nonconformities.status': { message: () => 'Non-conformity status' },
  'nonconformities.status.id': { message: () => undefined },
  'nonconformities.status.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Status') },
  'parents.lastModifiedDate': { message: () => undefined },
  'qmsStandards.id': { message: () => undefined },
  'qmsStandards.applicableCriteria': { message: (before, after) => comparePrimitive(before, after, 'applicableCriteria', 'Applicable Criteria') },
  'qmsStandards.qmsModification': { message: (before, after) => comparePrimitive(before, after, 'qmsModification', 'QMS Modification') },
  'requirements.criterion': { message: () => 'Certification Criterion' },
  'requirements.criterion.certificationEdition': { message: () => undefined },
  'requirements.criterion.certificationEditionId': { message: () => undefined },
  'requirements.criterion.id': { message: () => undefined },
  'requirements.criterion.number': { message: (before, after) => comparePrimitive(before, after, 'number', 'Number') },
  'requirements.criterion.removed': { message: () => undefined },
  'requirements.criterion.title': { message: (before, after) => comparePrimitive(before, after, 'title', 'Title') },
  'requirements.nonconformities': { message: (before, after) => compare(before, after, 'nonconformities', 'Non-conformities') },
  'requirements.result': { message: () => 'Requirement' },
  'requirements.result.id': { message: () => undefined },
  'requirements.result.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'requirements.requirement': { message: (before, after) => comparePrimitive(before, after, 'requirement', 'Requirement') },
  'requirements.requirementType': { message: () => 'Requirement Type' },
  'requirements.requirementType.id': { message: () => undefined },
  'requirements.requirementType.number': { message: () => undefined },
  'requirements.requirementType.removed': { message: () => undefined },
  'requirements.requirementType.title': { message: (before, after) => comparePrimitive(before, after, 'title', 'Title') },
  'requirements.requirementTypeOther': { message: (before, after) => comparePrimitive(before, after, 'requirementTypeOther', 'Requirement Type (Other)') },
  'requirements.requirementName': { message: (before, after) => comparePrimitive(before, after, 'requirementName', 'Requirement Name') },
  'requirements.type': { message: () => 'Requirement Type' },
  'requirements.type.id': { message: () => undefined },
  'requirements.type.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Type') },
  'root.acbCertificationId': { message: (before, after) => comparePrimitive(before, after, 'acbCertificationId', 'ONC-ACB Certification ID') },
  'root.accessibilityStandards': { message: (before, after) => compare(before, after, 'accessibilityStandards', 'Accessibility Standards') },
  'root.businessErrorMessages': { message: () => undefined },
  'root.certificationDate': { message: (before, after) => comparePrimitive(before, after, 'certificationDate', 'Certification Date', getDisplayDateFormat) },
  'root.certificationEvents': { message: (before, after) => compare(before, after, 'certificationEvents', 'Certification Status') },
  'root.certificationResults': { message: (before, after) => compare(before, after, 'certificationResults', 'Certification Criteria') },
  'root.certificationStatus': { message: () => 'Certification Status' },
  'root.certificationStatus.id': { message: () => undefined },
  'root.certificationStatus.date': { message: (before, after) => comparePrimitive(before, after, 'date', 'Certification Status Date', getDisplayDateFormat) },
  'root.certificationStatus.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Status') },
  'root.chplProductNumber': { message: (before, after) => comparePrimitive(before, after, 'chplProductNumber', 'CHPL Product Number') },
  'root.chplProductNumberHistory': { message: () => undefined }, // probably?
  'root.classificationType': { message: () => 'Listing Classification' },
  'root.classificationType.id': { message: () => undefined },
  'root.classificationType.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Type') },
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
  'root.directReviews': { message: () => undefined },
  'root.errorMessages': { message: () => undefined },
  'root.ics': {
    message: (before) => {
      if (typeof before !== 'object') { console.debug({ before, key: 'root.ics' }); }
      return 'Inherited Certified Status changes';
    },
  },
  'root.ics.children': { message: (before, after) => compare(before, after, 'children', 'ICS Children') },
  'root.ics.inherits': { message: (before, after) => comparePrimitive(before, after, 'inherits', 'ICS Status') },
  'root.ics.parents': { message: (before, after) => compare(before, after, 'parents', 'ICS Parents') },
  'root.lastModifiedDate': { message: () => undefined },
  'root.mandatoryDisclosures': { message: (before, after) => comparePrimitive(before, after, 'mandatoryDisclosures', 'Mandatory Disclosures URL') },
  'root.meaningfulUseUserHistory': { message: (before, after) => compare(before, after, 'meaningfulUseUserHistory', 'Meaningful Use User History') },
  'root.measures': { message: (before, after) => compare(before, after, 'measures', 'G1/G2 Measure') },
  'root.otherAcb': { message: (before, after) => comparePrimitive(before, after, 'otherAcb', 'Other ONC-ACB') },
  'root.practiceType': { message: () => 'Practice Type' },
  'root.practiceType.id': { message: () => undefined },
  'root.practiceType.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'root.productAdditionalSoftware': { message: (before, after) => comparePrimitive(before, after, 'productAdditionalSoftware', 'Listing Relied Upon Software') },
  'root.promotingInteroperabilityUserHistory': { message: (before, after) => compare(before, after, 'promotingInteroperabilityUserHistory', 'Promoting Interoperability User History') },
  'root.qmsStandards': { message: (before, after) => compare(before, after, 'qmsStandards', 'QMS Standards') },
  'root.reportFileLocation': { message: (before, after) => comparePrimitive(before, after, 'reportFileLocation', 'ONC-ATL Test Report File Location') },
  'root.rwtPlansCheckDate': { message: (before, after) => comparePrimitive(before, after, 'rwtPlansCheckDate', 'Real World Testing Plans Last Completeness Check Date', getDisplayDateFormat) },
  'root.rwtPlansUrl': { message: (before, after) => comparePrimitive(before, after, 'rwtPlansUrl', 'Real World Testing Plans URL') },
  'root.rwtResultsCheckDate': { message: (before, after) => comparePrimitive(before, after, 'rwtResultsCheckDate', 'Real World Testing Results Last Completeness Check Date', getDisplayDateFormat) },
  'root.rwtResultsUrl': { message: (before, after) => comparePrimitive(before, after, 'rwtResultsUrl', 'Real World Testing Results URL') },
  'root.sed': { message: () => 'SED Changes' },
  'root.sed.testTasks': { message: (before, after) => compare(before, after, 'testTasks', 'SED Test Tasks') },
  'root.sed.ucdProcesses': { message: (before, after) => compare(before, after, 'ucdProcesses', 'SED Processes') },
  'root.sedIntendedUserDescription': { message: (before, after) => comparePrimitive(before, after, 'sedIntendedUserDescription', 'SED Intended User Description') },
  'root.sedReportFileLocation': { message: (before, after) => comparePrimitive(before, after, 'sedReportFileLocation', 'SED Report File Location') },
  'root.sedTestingEndDate': { message: (before, after) => (before.sedTestingEndDay ? undefined : comparePrimitive(before, after, 'sedTestingEndDate', 'SED Testing End Date', getDisplayDateFormat)) },
  'root.sedTestingEndDay': { message: (before, after) => comparePrimitive(before, after, 'sedTestingEndDay', 'SED Testing End Date', getDisplayDateFormat) },
  'root.surveillance': { message: (before, after) => compare(before, after, 'surveillance', 'Surveillance') },
  'root.svapNoticeUrl': { message: (before, after) => comparePrimitive(before, after, 'svapNoticeUrl', 'SVAP Notice URL') },
  'root.targetedUsers': { message: (before, after) => compare(before, after, 'targetedUsers', 'Targeted Users ') },
  'root.termsOfUse': { message: (before, after) => comparePrimitive(before, after, 'termsOfUse', 'Terms Of Use') },
  'root.testingLab': { message: () => 'ONC-ATL' },
  'root.testingLab.code': { message: () => undefined },
  'root.testingLab.id': { message: () => undefined },
  'root.testingLab.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'ONC-ATL') },
  'root.testingLabs': { message: (before, after) => compare(before, after, 'testingLabs', 'Testing Labs') },
  'root.transparencyAttestationUrl': { message: (before, after) => comparePrimitive(before, after, 'transparencyAttestationUrl', 'Mandatory Disclosures URL') },
  'root.visibleOnChpl': { message: (before, after) => comparePrimitive(before, after, 'visibleOnChpl', 'Visible on CHPL') },
  'root.warningMessages': { message: () => undefined },
  'surveillance.endDate': { message: (before, after) => comparePrimitive(before, after, 'endDate', 'End Date', getDisplayDateFormat) },
  'surveillance.endDay': { message: (before, after) => comparePrimitive(before, after, 'endDay', 'End Day', getDisplayDateFormat) },
  'surveillance.errorMessages': { message: () => undefined },
  'surveillance.lastModifiedDate': { message: () => undefined },
  'surveillance.requirements': { message: (before, after) => compare(before, after, 'requirements', 'Requirements') },
  'surveillance.startDate': { message: (before, after) => comparePrimitive(before, after, 'startDate', 'Start Date', getDisplayDateFormat) },
  'surveillance.startDay': { message: (before, after) => comparePrimitive(before, after, 'startDay', 'Start Day', getDisplayDateFormat) },
  'surveillance.warningMessages': { message: () => undefined },
  'testDataUsed.id': { message: () => undefined },
  'testDataUsed.alteration': { message: (before, after) => comparePrimitive(before, after, 'alteration', 'Alteration') },
  'testDataUsed.version': { message: (before, after) => comparePrimitive(before, after, 'version', 'Version') },
  'testProcedures.id': { message: () => undefined },
  'testProcedures.testProcedureVersion': { message: (before, after) => comparePrimitive(before, after, 'testProcedureVersion', 'Version') },
  'testStandards.id': { message: () => undefined },
  'testTasks.criteria': { message: (before, after) => compare(before, after, 'testTasks.criteria', 'Certification Criteria') },
  'testTasks.id': { message: () => undefined },
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
  'testTasks.testTaskId': { message: () => undefined },
  'testToolsUsed.id': { message: () => undefined },
  'testToolsUsed.testToolVersion': { message: (before, after) => comparePrimitive(before, after, 'testToolVersion', 'Version') },
  'ucdProcesses.criteria': { message: (before, after) => compare(before, after, 'ucdProcesses.criteria', 'Certification Criteria') },
  'ucdProcesses.details': { message: (before, after) => comparePrimitive(before, after, 'details', 'UCD Process Details') },
  'ucdProcesses.id': { message: () => undefined },
  'ucdProcesses.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
};

const compareListing = (prev, curr) => compareObject(prev, curr, lookup);

export { compareListing }; // eslint-disable-line import/prefer-default-export
