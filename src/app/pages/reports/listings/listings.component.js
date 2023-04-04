import { compareArrays, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { isCures, sortCriteria } from 'services/criteria.service';
import { sortCqms } from 'services/cqms.service';
import { getDisplayDateFormat } from 'services/date-util';

let lookup;

const compare = (before, after, key, title = 'unknown') => {
  let options;
  switch (key) {
    case 'accessibilityStandards':
      options = {
        sort: (p, c) => p.accessibilityStandardName < c.accessibilityStandardName ? -1 : p.accessibilityStandardName > c.accessibilityStandardName ? 1 : 0,
        write: f => `Accessibility Standard "${f.accessibilityStandardName}"`,
      };
      break;
    case 'additionalSoftware':
      options = {
        sort: (p, c) => p.name < c.name ? -1 : p.name > c.name ? 1 : 0,
        write: s => `Relied Upon Software "${s.name}"`,
      };
      break;
    case 'certificationEvents':
      options = {
        sort: (p, c) => p.eventDate - c.eventDate,
        write: f => `Certification Status "${f.status.name}"`,
      };
      break;
    case 'children':
    case 'parents':
      options = {
        sort: (p, c) => p.chplProductNumber < c.chplProductNumber ? -1 : p.chplProductNumber > c.chplProductNumber ? 1 : 0,
        write: f => f.chplProductNumber,
      };
      break;
    case 'conformanceMethods':
      options = {
        sort: (p, c) => p.conformanceMethod.name < c.conformanceMethod.name ? -1 : p.conformanceMethod.name > c.conformanceMethod.name ? 1 : 0,
        write: f => 'Conformance Method "' + f.conformanceMethod.name + '"',
      };
      break;
    case 'cqmResults':
      options = {
        sort: sortCqms,
        write: f => `CQM "${f.cmsId}"`,
      };
      break;
    case 'certificationResults':
    case 'cqmResults.criteria':
    case 'measures.associatedCriteria':
    case 'testTasks.criteria':
    case 'ucdProcesses.criteria':
      options = {
        sort: (p, c) => sortCriteria(p.criterion ?? p, c.criterion ?? c),
        write: f => f.criterion ? `${f.criterion.number}${isCures(f.criterion) ? ' <span class="cures-update">(Cures Update)</span>' : ''}` : `${f.number}${isCures(f) ? ' <span class="cures-update">(Cures Update)</span>' : ''}`,
      };
      break;
    case 'functionalitiesTested':
      options = {
        sort: (p, c) => p.name < c.name ? -1 : p.name > c.name ? 1 : 0,
        write: f => 'Test Functionality "' + f.name + '"',
      };
      break;
    case 'g1MacraMeasures':
    case 'g2MacraMeasures':
      options = {
        sort: (p, c) => p.abbreviation < c.abbreviation ? -1 : p.abbreviation > c.abbreviation ? 1 : 0,
        write: f => 'MACRA Measure "' + f.abbreviation + '"',
      };
      break;
    case 'measures':
      options = {
        sort: (p, c) => p.measure.abbreviation < c.measure.abbreviation ? -1 : p.measure.abbreviation > c.measure.abbreviation ? 1 : 0,
        write: f => `Measure "${f.measure.abbreviation}: ${f.measure.requiredTest}"`,
      };
      break;
    case 'optionalStandards':
      options = {
        sort: (p, c) => p.citation < c.citation ? -1 : p.citation > c.citation ? 1 : 0,
        write: f => 'Optional Standard "' + f.citation + ': ' + f.description + '"',
      };
      break;
    case 'promotingInteroperabilityUserHistory':
      options = {
        sort: (p, c) => p.userCountDate < c.userCountDate ? -1 : p.userCountDate > c.userCountDate ? 1 : 0,
        write: f => `Promoting Interoperability User Count of "${f.userCount}" as of "${getDisplayDateFormat(f.userCountDate)}"`
      };
      break;
    case 'qmsStandards':
      options = {
        sort: (p, c) => p.qmsStandardName < c.qmsStandardName ? -1 : p.qmsStandardName > c.qmsStandardName ? 1 : 0,
        write: f => `QMS Standard "${f.qmsStandardName}"`,
      };
      break;
    case 'svaps':
      options = {
        sort: (p, c) => p.regulatoryTextCitation < c.regulatoryTextCitation ? -1 : p.regulatoryTextCitation > c.regulatoryTextCitation ? 1 : 0,
        write: f => 'SVAP "' + f.regulatoryTextCitation + '"',
      };
      break;
    case 'targetedUsers':
      options = {
        sort: (p, c) => p.targetedUserName < c.targetedUserName ? -1 : p.targetedUserName > c.targetedUserName ? 1 : 0,
        write: f => `Targeted User "${f.targetedUserName}"`,
      };
      break;
    case 'testingLabs':
      options = {
        sort: (p, c) => p.testingLabName < c.testingLabName ? -1 : p.testingLabName > c.testingLabName ? 1 : 0,
        write: f => `Testing Lab "${f.testingLabName}"`,
      };
      break;
    case 'testDataUsed':
      options = {
        sort: (p, c) => p.testData.name < c.testData.name ? -1 : p.testData.name > c.testData.name ? 1 : 0,
        write: f => 'Test Data "' + f.testData.name + '"',
      };
      break;
    case 'testFunctionality':
      options = {
        sort: (p, c) => p.name < c.name ? -1 : p.name > c.name ? 1 : 0,
        write: f => 'Test Functionality "' + f.name + '"',
      };
      break;
    case 'testProcedures':
      options = {
        sort: (p, c) => {
          if (!p.testProcedure) {
            if (p.testProcedureVersion !== c.testProcedureVersion) {
              console.debug({p, c, msg: 'Test Procedure Version change found; no name availble'});
            }
            return 0;
          }
          return p.testProcedure?.name < c.testProcedure?.name ? -1 : p.testProcedure?.name > c.testProcedure?.name ? 1 : 0;
        },
        write: f => 'Test Procedure "' + f.testProcedure.name + '"',
      };
      break;
    case 'testStandards':
      options = {
        sort: (p, c) => p.testStandardName < c.testStandardName ? -1 : p.testStandardName > c.testStandardName ? 1 : 0,
        write: f => 'Test Standard "' + f.testStandardName + '"',
      };
      break;
    case 'testTasks':
      options = {
        sort: (p, c) => p.description < c.description ? -1 : p.description > c.description ? 1 : 0,
        write: f => 'Test Task "' + f.description + '"',
      };
      break;
    case 'testToolsUsed':
      options = {
        sort: (p, c) => p.testToolName < c.testToolName ? -1 : p.testToolName > c.testToolName ? 1 : 0,
        write: f => 'Test Tool "' + f.testToolName + '"',
      };
      break;
    case 'text':
      options = {
        sort: (p, c) => p < c ? -1 : p > c ? 1 : 0,
        write: f => `"${f}"`,
      };
      break;
    case 'ucdProcesses':
      options = {
        sort: (p, c) => p.name < c.name ? -1 : p.name > c.name ? 1 : 0,
        write: f => 'UCD Process "' + f.name + '"',
      };
      break;
    default:
      console.debug(after.length > 0 ? {before, after, key, site: 'compareArrayOptionFinder'} : {key, site: 'compareArrayOptionFinder'});
      return undefined;
  }
  const changes = compareArrays(before, after, {...options, root: key }, lookup);
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
}

lookup = {
  shortCircuit: ['root.currentStatus', 'root.developer', 'root.product'],
  'additionalSoftware.certifiedProductId': { message: () => undefined },
  'additionalSoftware.certifiedProductNumber': { message: (before, after) => comparePrimitive(before, after, 'certifiedProductNumber', 'Certified Product Code') },
  'additionalSoftware.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'additionalSoftware.grouping': { message: (before, after) => comparePrimitive(before, after, 'grouping', 'Group') },
  'additionalSoftware.id': { message: () => undefined },
  'additionalSoftware.version': { message: (before, after) => comparePrimitive(before, after, 'version', 'Version') },
  'certificationEvents.reason': { message: (before, after) => comparePrimitive(before, after, 'reason', 'Reason for Status change') },
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
  'certificationResults.g2MacraMeasures': { message: (before, after) => compare(before, after, 'g2MacraMeasures', 'G2 MACRA Measures') },
  'certificationResults.gap': { message: (before, after) => comparePrimitive(before, after, 'gap', 'GAP') },
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
  'certificationResults.testToolsUsed': { message: (before, after) => compare(before, after, 'testToolsUsed', 'Test Tools') },
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
  'measures.measure.allowedCriteria': { message: () => undefined },
  'parents.lastModifiedDate': { message: () => undefined },
  'root.acbCertificationId': { message: (before, after) => comparePrimitive(before, after, 'acbCertificationId', 'ONC-ACB Certification ID') },
  'root.accessibilityStandards': { message: (before, after) => compare(before, after, 'accessibilityStandards', 'Accessibility Standards') },
  'root.certificationEvents': { message: (before, after) => compare(before, after, 'certificationEvents', 'Certification Status') },
  'root.certificationResults': { message: (before, after) => compare(before, after, 'certificationResults', 'Certification Criteria') },
  'root.chplProductNumber': { message: (before, after) => comparePrimitive(before, after, 'chplProductNumber', 'CHPL Product Number') },
  'root.chplProductNumberHistory': { message: () => undefined }, // probably?
  'root.countCerts': { message: () => undefined },
  'root.countClosedNonconformities': { message: () => undefined },
  'root.countClosedSurveillance': { message: () => undefined },
  'root.countCqms': { message: () => undefined },
  'root.countOpenNonconformities': { message: () => undefined },
  'root.countOpenSurveillance': { message: () => undefined },
  'root.cqmResults': { message: (before, after) => compare(before, after, 'cqmResults', 'CQM Changes') },
  'root.curesUpdate': { message: (before, after) => comparePrimitive(before, after, 'curesUpdate', '2015 Edition Cures Update status') },
  'root.decertificationDate': { message: () => undefined },
  'root.directReviews': { message: () => undefined },
  'root.errorMessages': { message: () => undefined },
  'root.ics': { message: (before) => {
    typeof before !== 'object' && console.debug({before, key: 'root.ics'});
    return 'Inherited Certification Status changes';
  }},
  'root.ics.children': { message: (before, after) => compare(before, after, 'children', 'ICS Children') },
  'root.ics.inherits': { message: (before, after) => comparePrimitive(before, after, 'inherits', 'ICS Status') },
  'root.ics.parents': { message: (before, after) => compare(before, after, 'parents', 'ICS Parents') },
  'root.lastModifiedDate': { message: () => undefined },
  'root.mandatoryDisclosures': { message: (before, after) => comparePrimitive(before, after, 'mandatoryDisclosures', 'Mandatory Disclosures URL') },
  'root.measures': { message: (before, after) => compare(before, after, 'measures', 'G1/G2 Measure') },
  'root.otherAcb': { message: (before, after) => comparePrimitive(before, after, 'otherAcb', 'Other ONC-ACB') },
  'root.promotingInteroperabilityUserHistory': { message: (before, after) => compare(before, after, 'promotingInteroperabilityUserHistory', 'Promoting Interoperability User') },
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
  'root.sedTestingEndDate': { message: (before, after) => before.sedTestingEndDay ? undefined : comparePrimitive(before, after, 'sedTestingEndDate', 'SED Testing End Date', getDisplayDateFormat) },
  'root.sedTestingEndDay': { message: (before, after) => comparePrimitive(before, after, 'sedTestingEndDay', 'SED Testing End Date', getDisplayDateFormat) },
  'root.surveillance': { message: () => undefined }, // consider making this do more
  'root.svapNoticeUrl': { message: (before, after) => comparePrimitive(before, after, 'svapNoticeUrl', 'SVAP Notice URL') },
  'root.targetedUsers': { message: (before, after) => compare(before, after, 'targetedUsers', 'Targeted Users') },
  'root.testingLabs': { message: (before, after) => compare(before, after, 'testingLabs', 'Testing Labs') },
  'root.transparencyAttestationUrl': { message: (before, after) => comparePrimitive(before, after, 'transparencyAttestationUrl', 'Mandatory Disclosures URL') },
  'root.warningMessages': { message: () => undefined },
  'testDataUsed.id': { message: () => undefined },
  'testDataUsed.version': { message: (before, after) => comparePrimitive(before, after, 'version', 'Version') },
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
  'testToolsUsed.id': { message: () => undefined },
  'testToolsUsed.testToolVersion': { message: (before, after) => comparePrimitive(before, after, 'testToolVersion', 'Version') },
  'ucdProcesses.criteria': { message: (before, after) => compare(before, after, 'ucdProcesses.criteria', 'Certification Criteria') },
  'ucdProcesses.details': { message: (before, after) => comparePrimitive(before, after, 'details', 'UCD Process Details') },
};

const ReportsListingsComponent = {
  templateUrl: 'chpl.reports/listings/listings.html',
  controller: class ReportsListingsComponent {
    constructor($filter, $log, $state, $stateParams, $uibModal, DateUtil, ReportService, authService, networkService, utilService) {
      'ngInject';

      this.$filter = $filter;
      this.$log = $log;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$uibModal = $uibModal;
      this.DateUtil = DateUtil;
      this.ReportService = ReportService;
      this.authService = authService;
      this.networkService = networkService;
      this.utilService = utilService;

      this.results = [];
      this.displayed = [];
      this.categoriesFilter = '|LISTING|';
      this.clearFilterHs = [];
      this.restoreStateHs = [];
      this.filename = `Reports_${new Date().getTime()}.csv`;
      this.filterText = '';
      this.tableController = {};
      this.loadProgress = {
        total: 0,
        complete: 0,
      };
      this.downloadProgress = 0;
      this.pageSize = 50;
      this.defaultDateRangeOffset = 60 * 24 * 60 * 60 * 1000; // 60 days
    }

    $onInit() {
      const that = this;
      const user = this.authService.getCurrentUser();
      this.networkService.getSearchOptions()
        .then((options) => {
          that.acbItems = options.acbs
            .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
            .map((a) => {
              const ret = {
                value: a.id,
                display: a.name,
              };
              if (a.retired) {
                ret.display = `${a.name} (Retired)`;
                ret.retired = true;
                ret.selected = ((new Date()).getTime() - a.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4);
              } else {
                ret.selected = that.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
                  || user.organizations.filter((o) => o.name === a.name).length > 0;
              }
              return ret;
            });
        });
      if (this.$stateParams.listingId) {
        this.listingId = this.$stateParams.listingId;
      }
      this.search();
    }

    $onDestroy() {
      this.isDestroyed = true;
    }

    doFilter(filter) {
      const that = this;
      this.filterText = filter.dataFilter;
      if (filter.tableState.search.predicateObject.categoriesFilter) {
        this.tableController.search(filter.tableState.search.predicateObject.categoriesFilter, 'categoriesFilter');
      } else {
        this.tableController.search('|LISTING|', 'categoriesFilter');
      }
      if (filter.tableState.search.predicateObject.acbName) {
        this.tableController.search(filter.tableState.search.predicateObject.acbName, 'acbName');
      } else {
        this.tableController.search({}, 'acbName');
      }
      if (filter.tableState.search.predicateObject.date) {
        this.tableController.search(filter.tableState.search.predicateObject.date, 'date');
      } else {
        this.tableController.search({}, 'date');
      }
      this.restoreStateHs.forEach((handler) => handler(that.tableController.tableState()));
      this.tableController.sortBy(filter.tableState.sort.predicate, filter.tableState.sort.reverse);
    }

    registerClearFilter(handler) {
      this.clearFilterHs.push(handler);
    }

    registerRestoreState(handler) {
      this.restoreStateHs.push(handler);
    }

    downloadReady() {
      return this.displayed.reduce((acc, activity) => activity.action && acc, true);
    }

    tableStateListener(tableController) {
      this.tableController = tableController;
    }

    compareCerts(prev, curr) {
      const ret = [];
      let change;
      const certKeys = [
        { key: 'apiDocumentation', display: 'API Documentation' },
        { key: 'exportDocumentation', display: 'Export Documentation' },
        { key: 'documentationUrl', display: 'Documentation URL' },
        { key: 'attestationAnswer', display: 'Attestation' },
        { key: 'useCases', display: 'Use Cases' },
        { key: 'serviceBaseUrlList', display: 'Service Base URL List' },
        { key: 'g1Success', display: 'Certified to G1' },
        { key: 'g2Success', display: 'Certified to G2' },
        { key: 'gap', display: 'GAP Tested' },
        { key: 'privacySecurityFramework', display: 'Privacy &amp; Security Framework' },
        { key: 'sed', display: 'SED tested' },
        { key: 'success', display: 'Successful' },
      ];
      let i;
      let j;
      prev.sort((a, b) => this.utilService.sortCertActual(a, b));
      curr.sort((a, b) => this.utilService.sortCertActual(a, b));
      for (i = 0; i < prev.length; i += 1) {
        const obj = { number: curr[i].number ?? curr[i].criterion.number, title: curr[i].title || curr[i].criterion.title, changes: [] };
        for (j = 0; j < certKeys.length; j += 1) {
          change = this.ReportService.compareItem(prev[i], curr[i], certKeys[j].key, certKeys[j].display, certKeys[j].filter);
          if (change) {
            obj.changes.push(`<li>${change}</li>`);
          }
        }
        let measures = this.utilService.arrayCompare(prev[i].g1MacraMeasures, curr[i].g1MacraMeasures);
        if (measures.added.length > 0) {
          obj.changes.push(`<li>Added G1 MACRA Measure${measures.added.length > 1 ? 's' : ''}:<ul>`);
          for (j = 0; j < measures.added.length; j += 1) {
            obj.changes.push(`<li>${measures.added[j].abbreviation}</li>`);
          }
          obj.changes.push('</ul></li>');
        }
        if (measures.removed.length > 0) {
          obj.changes.push(`<li>Removed G1 MACRA Measure${measures.removed.length > 1 ? 's' : ''}:<ul>`);
          for (j = 0; j < measures.removed.length; j += 1) {
            obj.changes.push(`<li>${measures.removed[j].abbreviation}</li>`);
          }
          obj.changes.push('</ul></li>');
        }
        measures = this.utilService.arrayCompare(prev[i].g2MacraMeasures, curr[i].g2MacraMeasures);
        if (measures.added.length > 0) {
          obj.changes.push(`<li>Added G2 MACRA Measure${measures.added.length > 1 ? 's' : ''}:<ul>`);
          for (j = 0; j < measures.added.length; j += 1) {
            obj.changes.push(`<li>${measures.added[j].abbreviation}</li>`);
          }
          obj.changes.push('</ul></li>');
        }
        if (measures.removed.length > 0) {
          obj.changes.push(`<li>Removed G2 MACRA Measure${measures.removed.length > 1 ? 's' : ''}:<ul>`);
          for (j = 0; j < measures.removed.length; j += 1) {
            obj.changes.push(`<li>${measures.removed[j].abbreviation}</li>`);
          }
          obj.changes.push('</ul></li>');
        }
        const addlSw = this.ReportService.compare(prev[i].additionalSoftware, curr[i].additionalSoftware, 'additionalSoftware');
        if (addlSw.length > 0) {
          obj.changes.push(`<li>Relied Upon Software changes<ul>${addlSw.join('')}</li>`);
        }
        const testChanges = this.compareTestStuff(prev[i], curr[i]);
        if (testChanges) {
          obj.changes = obj.changes.concat(testChanges);
        }
        const testFunctionality = this.ReportService.compare(prev[i].testFunctionality, curr[i].testFunctionality, 'testFunctionality');
        if (testFunctionality.length > 0) {
          obj.changes.push(`<li>Test Functionality changes<ul>${testFunctionality.join('')}</li>`);
        }
        const functionalitiesTested = this.ReportService.compare(prev[i].functionalitiesTested, curr[i].functionalitiesTested, 'functionalitiesTested');
        if (functionalitiesTested.length > 0) {
          obj.changes.push(`<li>Functionalities Tested changes<ul>${functionalitiesTested.join('')}</li>`);
        }
        const svapKeys = [{ key: 'regulatoryTextCitation', display: 'SVAP' }];
        const svap = this.ReportService.compareArray(prev[i].svaps, curr[i].svaps, svapKeys, 'regulatoryTextCitation');
        if (svap.length > 0) {
          obj.changes.push('<li>SVAP changes<ul>');
          for (j = 0; j < svap.length; j += 1) {
            obj.changes.push(svap[j].changes.join(''));
          }
          obj.changes.push('</ul></li>');
        }
        const testToolsUsedKeys = [{ key: 'testToolVersion', display: 'Test Tool Version' }];
        const testToolsUsed = this.ReportService.compareArray(prev[i].testToolsUsed, curr[i].testToolsUsed, testToolsUsedKeys, 'testToolName');
        for (j = 0; j < testToolsUsed.length; j += 1) {
          obj.changes.push(`<li>Test Tool Name "${testToolsUsed[j].name}" changes<ul>${testToolsUsed[j].changes.join('')}</ul></li>`);
        }
        const testStandardsKeys = [{ key: 'testStandardName', display: 'Test Standard Name' }];
        const testStandards = this.ReportService.compareArray(prev[i].testStandards, curr[i].testStandards, testStandardsKeys, 'testStandardName');
        for (j = 0; j < testStandards.length; j += 1) {
          obj.changes.push(`<li>Test Standard Description "${testStandards[j].name}" changes<ul>${testStandards[j].changes.join('')}</ul></li>`);
        }
        if (prev[i].ucdProcesses) {
          const ucdProcessesKeys = [{ key: 'ucdProcessDetails', display: 'UCD Process Details' }];
          const ucdProcesses = this.ReportService.compareArray(prev[i].ucdProcesses, curr[i].ucdProcesses, ucdProcessesKeys, 'ucdProcessName');
          for (j = 0; j < ucdProcesses.length; j += 1) {
            obj.changes.push(`<li>UCD Process Name "${ucdProcesses[j].name}" changes<ul>${ucdProcesses[j].changes.join('')}</ul></li>`);
          }
        }
        if (prev[i].testTasks) {
          const testTasks = this.compareSedTasks(prev[i].testTasks, curr[i].testTasks);
          for (j = 0; j < testTasks.length; j += 1) {
            obj.changes.push(`<li>SED Test Task "${testTasks[j].name}" changes<ul>${testTasks[j].changes.join('')}</ul></li>`);
          }
        }
        if (obj.changes.length > 0) {
          ret.push(obj);
        }
      }
      return ret;
    }

    compareCertificationEvents(prev, curr) {
      let c = 0;
      let item;
      let p = 0;
      const ret = [];
      prev = this.$filter('orderBy')(prev.map((e) => { if (!e.certificationStatusName) { e.certificationStatusName = e.status.name; } return e; }), 'eventDate');
      curr = this.$filter('orderBy')(curr.map((e) => { if (!e.certificationStatusName) { e.certificationStatusName = e.status.name; } return e; }), 'eventDate');

      while (p < prev.length && c < curr.length) {
        item = '';
        if (prev[p].eventDate < curr[c].eventDate) {
          if (prev[p].certificationStatusName === curr[c].certificationStatusName) {
            item = `"${prev[p].certificationStatusName}" status changed effective date to ${this.$filter('date')(curr[c].eventDate, 'mediumDate', 'UTC')}`;
            if (curr[c].reason) {
              item += ` with reason: "${curr[c].reason}"`;
            }
            p += 1;
            c += 1;
          } else {
            item = `Removed "${prev[p].certificationStatusName}" status at ${this.$filter('date')(prev[p].eventDate, 'mediumDate', 'UTC')}`;
            if (prev[p].reason) {
              item += ` with reason: "${prev[p].reason}"`;
            }
            p += 1;
          }
        } else if (prev[p].eventDate > curr[c].eventDate) {
          if (prev[p].certificationStatusName === curr[c].certificationStatusName) {
            item = `"${prev[p].certificationStatusName}" status changed effective date to ${this.$filter('date')(curr[c].eventDate, 'mediumDate', 'UTC')}`;
            if (curr[c].reason) {
              item += ` with reason: "${curr[c].reason}"`;
            }
            p += 1;
            c += 1;
          } else {
            item = `Added "${curr[c].certificationStatusName}" status at ${this.$filter('date')(curr[c].eventDate, 'mediumDate', 'UTC')}`;
            if (curr[c].reason) {
              item += ` with reason: "${curr[c].reason}"`;
            }
            c += 1;
          }
        } else if (prev[p].certificationStatusName !== curr[c].certificationStatusName) {
          item = `"${prev[p].certificationStatusName}" status became "${curr[c].certificationStatusName}" at ${this.$filter('date')(curr[c].eventDate, 'mediumDate', 'UTC')}`;
          if (curr[c].reason) {
            item += ` with reason: "${curr[c].reason}"`;
          }
          p += 1;
          c += 1;
        } else {
          p += 1;
          c += 1;
        }
        if (item) {
          ret.push(item);
        }
      }
      while (p < prev.length) {
        item = `Removed "${prev[p].certificationStatusName}" status at ${this.$filter('date')(prev[p].eventDate, 'mediumDate', 'UTC')}`;
        if (prev[p].reason) {
          item += ` with reason: "${prev[p].reason}"`;
        }
        ret.push(item);
        p += 1;
      }
      while (c < curr.length) {
        item = `Added "${curr[c].certificationStatusName}" status at ${this.$filter('date')(curr[c].eventDate, 'mediumDate', 'UTC')}`;
        if (curr[c].reason) {
          item += ` with reason: "${curr[c].reason}"`;
        }
        ret.push(item);
        c += 1;
      }
      return ret;
    }

    compareCqms(prev, curr) {
      const ret = [];
      let change;
      prev.sort((a, b) => ((a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0)));
      curr.sort((a, b) => ((a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0)));
      let i;
      let j;
      for (i = 0; i < prev.length; i += 1) {
        const obj = { cmsId: curr[i].cmsId, changes: [] };
        change = this.ReportService.compareItem(prev[i], curr[i], 'success', 'Success');
        if (change) {
          obj.changes.push(`<li>${change}</li>`);
        }
        for (j = 0; j < prev[i].allVersions.length; j += 1) {
          if (prev[i].successVersions.indexOf(prev[i].allVersions[j]) < 0 && curr[i].successVersions.indexOf(prev[i].allVersions[j]) >= 0) {
            obj.changes.push(`<li>${prev[i].allVersions[j]} added</li>`);
          }
          if (prev[i].successVersions.indexOf(prev[i].allVersions[j]) >= 0 && curr[i].successVersions.indexOf(prev[i].allVersions[j]) < 0) {
            obj.changes.push(`<li>${prev[i].allVersions[j]} removed</li>`);
          }
        }
        const criteriaKeys = [];
        const criteria = this.ReportService.compareArray(prev[i].criteria, curr[i].criteria, criteriaKeys, 'certificationNumber');
        for (j = 0; j < criteria.length; j += 1) {
          let { name } = criteria[j];
          if (criteria[j].title && criteria[j].title.indexOf('Cures Update') > 0) {
            name += ' (Cures Update)';
          }
          obj.changes.push(`<li>Certification Criteria "${name}" changes<ul>${criteria[j].changes.join('')}</ul></li>`);
        }
        if (obj.changes.length > 0) {
          ret.push(obj);
        }
      }
      return ret;
    }

    compareSed(prev, curr) {
      let i;
      let j;
      let k;
      const ret = [];
      let c;
      let change;
      let changes;
      let p;

      const pUcd = prev.ucdProcesses.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      const cUcd = curr.ucdProcesses.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      const ucdProcessesKeys = [{ key: 'details', display: 'UCD Process Details' }];
      p = 0;
      c = 0;
      while (pUcd[p] || cUcd[c]) {
        if (!pUcd[p]) {
          ret.push(`<li>UCD Process Name "${cUcd[c].name}" was added</li>`);
          c++;
        } else if (!cUcd[c]) {
          ret.push(`<li>UCD Process Name "${pUcd[p].name}" was removed</li>`);
          p++;
        } else if (pUcd[p].name > cUcd[c].name) {
          ret.push(`<li>UCD Process Name "${cUcd[c].name}" was added</li>`);
          c++;
        } else if (pUcd[p].name < cUcd[c].name) {
          ret.push(`<li>UCD Process Name "${pUcd[p].name}" was removed</li>`);
          p++;
        } else {
          changes = [];
          for (i = 0; i < ucdProcessesKeys.length; i += 1) {
            change = this.ReportService.compareItem(pUcd[p], cUcd[c], ucdProcessesKeys[i].key, ucdProcessesKeys[i].display);
            if (change) {
              changes.push(change);
            }
          }
          change = this.ReportService.compare(pUcd[p].criteria, cUcd[c].criteria, 'criteria');
          if (change.length > 0) {
            changes.push(`<li>Certification Criteria changes:<ul>${change.join('')}</ul></li>`);
          }
          if (changes.length > 0) {
            ret.push(`<li>UCD Process Name "${pUcd[p].name}" changes<ul>${changes.join('')}</ul></li>`);
          }
          p += 1;
          c += 1;
        }
      }

      const pTask = prev.testTasks.sort((a, b) => (a.description < b.description ? -1 : a.description > b.description ? 1 : 0));
      const cTask = curr.testTasks.sort((a, b) => (a.description < b.description ? -1 : a.description > b.description ? 1 : 0));
      const taskKeys = [
        { key: 'taskErrors', display: 'Task Errors' },
        { key: 'taskErrorsStddev', display: 'Task Errors Standard Deviation' },
        { key: 'taskPathDeviationObserved', display: 'Task Path Deviation Observed' },
        { key: 'taskPathDeviationOptimal', display: 'Task Path Deviation Optimal' },
        { key: 'taskRating', display: 'Task Rating' },
        { key: 'taskRatingScale', display: 'Task Rating Scale' },
        { key: 'taskRatingStddev', display: 'Task Rating Standard Deviation' },
        { key: 'taskSuccessAverage', display: 'Task Success Average' },
        { key: 'taskSuccessStddev', display: 'Task Success Standard Deviation' },
        { key: 'taskTimeAvg', display: 'Task Time Average' },
        { key: 'taskTimeDeviationObservedAvg', display: 'Task Time Deviation Observed Average' },
        { key: 'taskTimeDeviationOptimalAvg', display: 'Task Time Deviation Optimal Average' },
        { key: 'taskTimeStddev', display: 'Task Time Standard Deviation' },
      ];
      p = 0;
      c = 0;
      while (pTask[p] || cTask[c]) {
        if (!pTask[p]) { // reached the end of the previous tasks; all remaining were added
          ret.push(`<li>Task Description "${cTask[c].description}" was added</li>`);
          c++;
        } else if (!cTask[c]) { // reached the end of the current tasks; all remaining were removed
          ret.push(`<li>Task Description "${pTask[p].description}" was removed</li>`);
          p++;
        } else if (pTask[p].description > cTask[c].description) { // found a new current task; it's added
          ret.push(`<li>Task Description "${cTask[c].description}" was added</li>`);
          c++;
        } else if (pTask[p].description < cTask[c].description) { // found a previous task that's not in the current set; it's removed
          ret.push(`<li>Task Description "${pTask[p].description}" was removed</li>`);
          p++;
        } else {
          changes = [];
          for (i = 0; i < taskKeys.length; i += 1) {
            change = this.ReportService.compareItem(pTask[p], cTask[c], taskKeys[i].key, taskKeys[i].display);
            if (change) {
              changes.push(change);
            }
          }
          change = this.ReportService.compare(pTask[p].criteria, cTask[c].criteria, 'criteria');
          if (change.length > 0) {
            changes.push(`<li>Certification Criteria changes:<ul>${change.join('')}</ul></li>`);
          }
          j = 0;
          k = 0;
          let added = 0;
          let removed = 0;
          const pParts = pTask[p].testParticipants.sort((a, b) => a.id - b.id);
          const cParts = cTask[c].testParticipants.sort((a, b) => a.id - b.id);
          while (pParts[j] || cParts[k]) {
            if (!pParts[j]) {
              added++;
              k++;
            } else if (!cParts[k]) {
              removed++;
              j++;
            } else if (pParts[j].id > cParts[k].id) {
              added++;
              k++;
            } else if (pParts[j].id < cParts[k].id) {
              removed++;
              j++;
            } else {
              j += 1;
              k += 1;
            }
          }
          if (added) {
            changes.push(`<li>Added ${added} Test Participant${added > 1 ? 's' : ''}`);
          }
          if (removed) {
            changes.push(`<li>Removed ${removed} Test Participant${removed > 1 ? 's' : ''}`);
          }
          if (changes.length > 0) {
            ret.push(`<li>Task Description "${pTask[p].description}" changes<ul>${changes.join('')}</ul></li>`);
          }
          p += 1;
          c += 1;
        }
      }

      let found;
      let part;
      let task;
      prev.allParticipants = [];
      for (i = 0; i < prev.testTasks.length; i += 1) {
        task = prev.testTasks[i];
        for (j = 0; j < task.testParticipants.length; j += 1) {
          part = task.testParticipants[j];
          found = false;
          for (k = 0; k < prev.allParticipants.length; k += 1) {
            if (part.id === prev.allParticipants[k].id) {
              found = true;
            }
          }
          if (!found) {
            prev.allParticipants.push(part);
          }
        }
      }
      curr.allParticipants = [];
      for (i = 0; i < curr.testTasks.length; i += 1) {
        task = curr.testTasks[i];
        for (j = 0; j < task.testParticipants.length; j += 1) {
          part = task.testParticipants[j];
          found = false;
          for (k = 0; k < curr.allParticipants.length; k += 1) {
            if (part.id === curr.allParticipants[k].id) {
              found = true;
            }
          }
          if (!found) {
            curr.allParticipants.push(part);
          }
        }
      }

      const testParticipantKeys = [
        { key: 'ageRange', display: 'Age Range' },
        { key: 'assistiveTechnologyNeeds', display: 'Assistive Technology Needs' },
        { key: 'computerExperienceMonths', display: 'Computer Experience Months' },
        { key: 'educationTypeName', display: 'Education Type' },
        { key: 'gender', display: 'Gender' },
        { key: 'occupation', display: 'Occupation' },
        { key: 'productExperienceMonths', display: 'Product Experience (Months)' },
        { key: 'professionalExperienceMonths', display: 'Professional Experience (Months)' },
      ];
      const participants = this.ReportService.compareArray(prev.allParticipants, curr.allParticipants, testParticipantKeys, 'id');
      for (i = 0; i < participants.length; i += 1) {
        ret.push(`<li>Participant changes<ul>${participants[i].changes.join('')}</ul></li>`);
      }
      return ret;
    }

    compareSedTasks(prev, curr) {
      const ret = [];
      let change;
      const keys = [
        { key: 'taskPathDeviationObserved', display: 'Path Deviation Observed' },
        { key: 'taskPathDeviationOptimal', display: 'Path Deviation Optimal' },
        { key: 'taskRating', display: 'Task Rating' },
        { key: 'taskRatingStddev', display: 'Task Rating Standard Deviation' },
        { key: 'taskRatingScale', display: 'Rating Scale' },
        { key: 'taskTimeAvg', display: 'Time Average' },
        { key: 'taskTimeDeviationObservedAvg', display: 'Time Deviation Observed Average' },
        { key: 'taskTimeDeviationOptimalAvg', display: 'Time Deviation Optimal Average' },
        { key: 'taskTimeStddev', display: 'Time Standard Deviation' },
      ];
      let i;
      let j;
      let k;
      if (prev !== null) {
        prev.sort((a, b) => ((a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0)));
        curr.sort((a, b) => ((a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0)));
        for (i = 0; i < prev.length; i += 1) {
          for (j = 0; j < curr.length; j += 1) {
            if (prev[i].description === curr[j].description) {
              const obj = { name: curr[j].description, changes: [] };
              for (k = 0; k < keys.length; k += 1) {
                change = this.ReportService.compareItem(prev[i], curr[j], keys[k].key, keys[k].display, keys[k].filter);
                if (change) { obj.changes.push(`<li>${change}</li>`); }
              }
              const testParticipantKeys = [
                { key: 'ageRange', display: 'Age' },
                { key: 'assistiveTechnologyNeeds', display: 'Assistive Technology Needs' },
                { key: 'computerExperienceMonths', display: 'Computer Experience Months' },
                { key: 'educationTypeName', display: 'Education Type' },
                { key: 'gender', display: 'Gender' },
                { key: 'occupation', display: 'Occupation' },
                { key: 'productExperienceMonths', display: 'Product Experience (Months)' },
                { key: 'professionalExperienceMonths', display: 'Professional Experience (Months)' },
              ];
              const testParticipants = this.ReportService.compareArray(prev[i].testParticipants, curr[j].testParticipants, testParticipantKeys, 'testParticipantId');
              for (k = 0; k < testParticipants.length; k += 1) {
                obj.changes.push(`<li>Test Participant "${testParticipants[k].name}" changes<ul>${testParticipants[k].changes.join('')}</ul></li>`);
              }
              if (obj.changes.length > 0) {
                ret.push(obj);
              }
              prev[i].evaluated = true;
              curr[j].evaluated = true;
            }
          }
          if (!prev[i].evaluated) {
            ret.push({ name: prev[i].description, changes: ['<li>Task removed</li>'] });
          }
        }
        for (i = 0; i < curr.length; i += 1) {
          if (!curr[i].evaluated) {
            ret.push({ name: curr[i].description, changes: ['<li>Task added</li>'] });
          }
        }
      }
      return ret;
    }

    compareSurveillances(oldS, newS) {
      this.$uibModal.open({
        component: 'chplCompareSurveillances',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          oldSurveillance: () => oldS,
          newSurveillance: () => newS,
        },
      });
    }

    compareTestStuff(prev, curr) {
      const ret = [];
      if (prev.conformanceMethods && curr.conformanceMethods) {
        prev.conformanceMethods.forEach((pre) => {
          if (pre.conformanceMethod) {
            curr.conformanceMethods.forEach((cur) => {
              if (!cur.found && !pre.found
                && pre.conformanceMethod.name === cur.conformanceMethod.name
                && pre.conformanceMethodVersion === cur.conformanceMethodVersion) {
                pre.found = true;
                cur.found = true;
              }
            });
          }
        });
        prev.conformanceMethods.forEach((pre) => {
          if (pre.conformanceMethod) {
            curr.conformanceMethods.forEach((cur) => {
              if (!cur.found && !pre.found && pre.conformanceMethod.name === cur.conformanceMethod.name) {
                pre.found = true;
                cur.found = true;
                ret.push(`<li>Conformance Method "${pre.conformanceMethod.name}" version changed from "${pre.conformanceMethodVersion}" to "${cur.conformanceMethodVersion}"</li>`);
              }
            });
            if (!pre.found) {
              ret.push(`<li>Conformance Method "${pre.conformanceMethod.name}" was removed</li>`);
            }
          }
        });
        curr.conformanceMethods.forEach((cur) => {
          if (cur.conformanceMethod) {
            if (!cur.found) {
              ret.push(`<li>Conformance Method "${cur.conformanceMethod.name}" was added</li>`);
            }
          }
        });
      }
      if (prev.testProcedures && curr.testProcedures) {
        prev.testProcedures.forEach((pre) => {
          if (pre.testProcedure) {
            curr.testProcedures.forEach((cur) => {
              if (!cur.found && !pre.found
                && pre.testProcedure.name === cur.testProcedure.name
                && pre.testProcedureVersion === cur.testProcedureVersion) {
                pre.found = true;
                cur.found = true;
              }
            });
          }
        });
        prev.testProcedures.forEach((pre) => {
          if (pre.testProcedure) {
            curr.testProcedures.forEach((cur) => {
              if (!cur.found && !pre.found && pre.testProcedure.name === cur.testProcedure.name) {
                pre.found = true;
                cur.found = true;
                ret.push(`<li>Test Procedure "${pre.testProcedure.name}" version changed from "${pre.testProcedureVersion}" to "${cur.testProcedureVersion}"</li>`);
              }
            });
            if (!pre.found) {
              ret.push(`<li>Test Procedure "${pre.testProcedure.name}" was removed</li>`);
            }
          }
        });
        curr.testProcedures.forEach((cur) => {
          if (cur.testProcedure) {
            if (!cur.found) {
              ret.push(`<li>Test Procedure "${cur.testProcedure.name}" was added</li>`);
            }
          }
        });
      }
      if (prev.testDataUsed && curr.testDataUsed) {
        prev.testDataUsed.forEach((pre) => {
          if (pre.testData) {
            curr.testDataUsed.forEach((cur) => {
              if (!cur.found && !pre.found
                && pre.testData.name === cur.testData.name
                && pre.version === cur.version
                && pre.alteration === cur.alteration) {
                pre.found = true;
                cur.found = true;
              }
            });
          }
        });
        prev.testDataUsed.forEach((pre) => {
          if (pre.testData) {
            curr.testDataUsed.forEach((cur) => {
              if (!cur.found && !pre.found
                && pre.testData.name === cur.testData.name) {
                pre.found = true;
                cur.found = true;
                if (pre.version !== cur.version) {
                  ret.push(`<li>Test Data "${pre.testData.name}" version changed from "${pre.version}" to "${cur.version}"</li>`);
                }
                if (pre.alteration !== cur.alteration) {
                  ret.push(`<li>Test Data "${pre.testData.name}" alteration changed from "${pre.alteration}" to "${cur.alteration}"</li>`);
                }
              }
            });
            if (!pre.found) {
              ret.push(`<li>Test Data "${pre.testData.name}" was removed</li>`);
            }
          }
        });
        curr.testDataUsed.forEach((cur) => {
          if (cur.testData) {
            if (!cur.found) {
              ret.push(`<li>Test Data "${cur.testData.name}" was added</li>`);
            }
          }
        });
      }

      if (!prev.optionalStandards) {
        prev.optionalStandards = [];
      }
      if (!curr.optionalStandards) {
        curr.optionalStandards = [];
      }
      curr.optionalStandards
        .filter((currOS) => prev.optionalStandards.filter((prevOS) => currOS.citation === prevOS.citation).length === 0)
        .forEach((addedOS) => {
          ret.push(`<li>Optional Standard "${addedOS.citation}: ${addedOS.description}" was added</li>`);
        });
      prev.optionalStandards
        .filter((prevOS) => curr.optionalStandards.filter((currOS) => prevOS.citation === currOS.citation).length === 0)
        .forEach((removedOS) => {
          ret.push(`<li>Optional Standard "${removedOS.citation}: ${removedOS.description}" was removed</li>`);
        });
      return ret;
    }

    parse(meta) {
      return this.networkService.getActivityById(meta.id, { ignoreLoadingBar: true }).then((item) => {
        const simpleCpFields = [
          { key: 'acbCertificationId', display: 'ACB Certification ID' },
          { key: 'accessibilityCertified', display: 'Accessibility Certified' },
          { key: 'certificationDate', display: 'Certification Date', filter: 'date' },
          { key: 'chplProductNumber', display: 'CHPL Product Number' },
          { key: 'curesUpdate', display: '2015 Edition Cures Update status' },
          { key: 'otherAcb', display: 'Other ONC-ACB' },
          { key: 'productAdditionalSoftware', display: 'Product-wide Relied Upon Software' },
          { key: 'reportFileLocation', display: 'ONC-ATL Test Report File Location' },
          { key: 'sedIntendedUserDescription', display: 'SED Intended User Description' },
          { key: 'sedReportFileLocation', display: 'SED Report File Location' },
          { key: 'sedTesting', display: 'SED Tested' },
          { key: 'sedTestingEndDate', display: 'SED Testing End Date', filter: 'date' },
          { key: 'sedTestingEndDay', display: 'SED Testing End Date' },
          { key: 'transparencyAttestationUrl', display: 'Mandatory Disclosures URL' },
          { key: 'mandatoryDisclosures', display: 'Mandatory Disclosures URL' },
          { key: 'rwtPlansUrl', display: 'Real World Testing Plans URL' },
          { key: 'rwtPlansCheckDate', display: 'Real World Testing Plans Last Completeness Check Date', filter: 'date' },
          { key: 'rwtResultsUrl', display: 'Real World Testing Results URL' },
          { key: 'rwtResultsCheckDate', display: 'Real World Testing Results Last Completeness Check Date', filter: 'date' },
          { key: 'svapNoticeUrl', display: 'SVAP Notice URL' },
        ];
        let nestedKeys = [
          { key: 'certifyingBody', subkey: 'name', display: 'Certifying Body' },
          { key: 'classificationType', subkey: 'name', display: 'Classification Type' },
          { key: 'ics', subkey: 'inherits', display: 'ICS Status' },
          { key: 'practiceType', subkey: 'name', display: 'Practice Type' },
          { key: 'testingLab', subkey: 'name', display: 'Testing Lab' },
        ];
        let change;

        let certChanges;
        let j;
        let k;
        let link;
        const activity = {
          action: '',
          details: [],
          newDetails: [],
        };
        if (item.description === 'Created a certified product') {
          activity.action = 'Created a certified product';
        } else if (item.description.startsWith('Updated certified')) {
          activity.action = 'Updated a certified product';
          activity.newDetails = compareObject(item.originalData, item.newData, lookup);
          if (item.newData.certificationStatus) {
            change = this.ReportService.nestedCompare(item.originalData, item.newData, 'certificationStatus', 'name', 'Certification Status');
            if (change) {
              activity.details.push(change);
            }
          } else {
            change = this.compareCertificationEvents(item.originalData.certificationEvents, item.newData.certificationEvents);
            if (change && change.length > 0) {
              activity.details.push(change);
            }
          }

          for (j = 0; j < simpleCpFields.length; j += 1) {
            change = this.ReportService.compareItem(item.originalData, item.newData, simpleCpFields[j].key, simpleCpFields[j].display, simpleCpFields[j].filter);
            if (change && this.shouldShowChange(item, simpleCpFields[j].key)) {
              activity.details.push(change);
            }
          }
          for (j = 0; j < nestedKeys.length; j += 1) {
            change = this.ReportService.nestedCompare(item.originalData, item.newData, nestedKeys[j].key, nestedKeys[j].subkey, nestedKeys[j].display, nestedKeys[j].filter);
            if (change) {
              activity.details.push(change);
            }
          }
          const accessibilityStandardsKeys = [];
          const accessibilityStandards = this.ReportService.compareArray(item.originalData.accessibilityStandards, item.newData.accessibilityStandards, accessibilityStandardsKeys, 'accessibilityStandardName');
          for (j = 0; j < accessibilityStandards.length; j += 1) {
            activity.details.push(`Accessibility Standard "${accessibilityStandards[j].name}" changes<ul>${accessibilityStandards[j].changes.join('')}</ul>`);
          }
          certChanges = this.compareCerts(item.originalData.certificationResults, item.newData.certificationResults);
          for (j = 0; j < certChanges.length; j += 1) {
            activity.details.push(`Certification "${certChanges[j].number}${certChanges[j].title.indexOf('Cures Update') > 0 ? ' (Cures Update)' : ''}" changes<ul>${certChanges[j].changes.join('')}</ul>`);
          }
          const cqmChanges = this.compareCqms(item.originalData.cqmResults, item.newData.cqmResults);
          for (j = 0; j < cqmChanges.length; j += 1) {
            activity.details.push(`CQM "${cqmChanges[j].cmsId}" changes<ul>${cqmChanges[j].changes.join('')}</ul>`);
          }
          if (typeof (item.originalData.ics) === 'object'
            && typeof (item.newData.ics) === 'object'
            && item.originalData.ics
            && item.newData.ics) {
            if (item.originalData.ics.parents) {
              const icsParentsKeys = [];
              const icsParents = this.ReportService.compareArray(item.originalData.ics.parents, item.newData.ics.parents, icsParentsKeys, 'chplProductNumber');
              for (j = 0; j < icsParents.length; j += 1) {
                activity.details.push(`ICS Parent "${icsParents[j].name}" changes<ul>${icsParents[j].changes.join('')}</ul>`);
              }
            }
            if (item.originalData.ics.children) {
              const icsChildrenKeys = [];
              const icsChildren = this.ReportService.compareArray(item.originalData.ics.children, item.newData.ics.children, icsChildrenKeys, 'chplProductNumber');
              for (j = 0; j < icsChildren.length; j += 1) {
                activity.details.push(`ICS Child "${icsChildren[j].name}" changes<ul>${icsChildren[j].changes.join('')}</ul>`);
              }
            }
          }
          if (item.originalData.promotingInteroperabilityUserHistory) {
            const promotingInteroperabilityUserHistory = this.ReportService.compare(item.originalData.promotingInteroperabilityUserHistory, item.newData.promotingInteroperabilityUserHistory, 'promotingInteroperabilityUserHistory');
            if (promotingInteroperabilityUserHistory.length > 0) {
              activity.details.push(`Promoting Interoperability user history changes<ul>${promotingInteroperabilityUserHistory.join('')}</ul>`);
            }
          }
          if (item.originalData.meaningfulUseUserHistory && !item.originalData.promotingInteroperabilityUserHistory) {
            const meaningfulUseUserHistory = this.ReportService.compare(item.originalData.meaningfulUseUserHistory, item.newData.meaningfulUseUserHistory, 'meaningfulUseUserHistory');
            if (meaningfulUseUserHistory.length > 0) {
              activity.details.push(`Meaningful use user history changes<ul>${meaningfulUseUserHistory.join('')}</ul>`);
            }
          }
          const measures = this.ReportService.compare(item.originalData.measures, item.newData.measures, 'measures');
          if (measures.length > 0) {
            activity.details.push(`G1/G2 measure changes:<ul>${measures.join('')}</ul>`);
          }
          if (item.originalData.testingLabs) {
            const testingLabsKeys = [];
            const testingLabs = this.ReportService.compareArray(item.originalData.testingLabs, item.newData.testingLabs, testingLabsKeys, 'testingLabName');
            for (j = 0; j < testingLabs.length; j += 1) {
              activity.details.push(`Testing Lab "${testingLabs[j].name}" changes<ul>${testingLabs[j].changes.join('')}</ul>`);
            }
          }
          const qmsStandards = this.ReportService.compare(item.originalData.qmsStandards, item.newData.qmsStandards, 'qmsStandards');
          if (qmsStandards.length > 0) {
            activity.details.push(`QMS Standards changes<ul>${qmsStandards.join('')}</ul>`);
          }
          if (item.originalData.sed && item.newData.sed) {
            const sedChanges = this.compareSed(item.originalData.sed, item.newData.sed);
            if (sedChanges && sedChanges.length > 0) {
              activity.details.push(`SED Changes<ul>${sedChanges.join('')}</ul>`);
            }
          }
          const targetedUsers = this.ReportService.compare(item.originalData.targetedUsers, item.newData.targetedUsers, 'targetedUsers');
          if (targetedUsers.length > 0) {
            activity.details.push(`Targeted Users changes:<ul>${targetedUsers.join('')}</ul>`);
          }
        } else if (item.description.startsWith('Changed ACB ownership')) {
          //console.log('ownership');
          const changes = ['Changed ONC-ACB ownership'];
          if (item.originalData.chplProductNumber !== item.newData.chplProductNumber) {
            changes.push(`<ul><li>CHPL Product Number changed from ${item.originalData.chplProductNumber} to ${item.newData.chplProductNumber}</li></ul>`);
          }
          activity.action = changes.join('');
        } else if (item.description.startsWith('Surveillance')) {
          if (item.description.startsWith('Surveillance was delete')) {
            activity.action = 'Surveillance was deleted';
          } else if (item.description.startsWith('Surveillance upload')) {
            activity.action = 'Surveillance was uploaded';
          } else if (item.description.startsWith('Surveillance was added')) {
            activity.action = 'Surveillance was added';
          } else if (item.description.startsWith('Surveillance was updated')) {
            activity.action = 'Surveillance was updated';
            activity.newDetails = compareObject(item.originalData, item.newData, lookup);
            for (j = 0; j < item.originalData.surveillance.length; j += 1) {
              let action = [`${item.originalData.surveillance[j].friendlyId}<ul><li>`];
              const actions = [];
              const simpleFields = [
                { key: 'endDate', display: 'End Date', filter: 'date' },
                { key: 'friendlyId', display: 'Surveillance ID' },
                { key: 'randomizedSitesUsed', display: 'Number of sites surveilled' },
                { key: 'startDate', display: 'Start Date', filter: 'date' },
              ];
              nestedKeys = [
                { key: 'type', subkey: 'name', display: 'Certification Type' },
              ];
              for (k = 0; k < simpleFields.length; k += 1) {
                change = this.ReportService.compareItem(item.originalData.surveillance[j], item.newData.surveillance[j], simpleFields[k].key, simpleFields[k].display, simpleFields[k].filter);
                if (change) { actions.push(change); }
              }
              for (k = 0; k < nestedKeys.length; k += 1) {
                change = this.ReportService.nestedCompare(item.originalData.surveillance[j], item.newData.surveillance[j], nestedKeys[k].key, nestedKeys[k].subkey, nestedKeys[k].display, nestedKeys[k].filter);
                if (change) {
                  actions.push(change);
                }
              }
              if (actions.length === 0) {
                meta.source = {
                  oldS: item.originalData,
                  newS: item.newData,
                };
              } else {
                action += actions.join('</li><li>');
                action += '</li></ul>';
                activity.details.push(action);
              }
            }
          } else {
            activity.action = `${item.description}<br />${link}`;
          }
        } else if (item.description.startsWith('Documentation')) {
          activity.action = 'Documentation was added to a nonconformity';
        } else if (item.description.startsWith('A document was removed')) {
          activity.action = 'Documentation was removed from a nonconformity';
        } else {
          activity.action = item.description;
        }
        meta.action = activity.action;
        meta.details = activity.details;
        meta.newDetails = activity.newDetails;
        meta.csvDetails = activity.details.join('\n');
      });
    }

    prepare(item, full) {
      item.filterText = `${item.developerName}|${item.productName}|${item.chplProductNumber}`;
      item.categoriesFilter = `|${item.categories.join('|')}|`;
      item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
      item.friendlyCertificationDate = new Date(item.certificationDate).toISOString().substring(0, 10);
      item.edition += (item.curesUpdate ? ' Cures Update' : '');
      if (full) {
        this.parse(item);
        item.showDetails = true;
      }
      return item;
    }

    canDownload() {
      return this.displayed
        .filter((item) => !item.action).length <= 1000;
    }

    prepareDownload() {
      const total = this.displayed
        .filter((item) => !item.action).length;
      let progress = 0;
      this.displayed
        .filter((item) => !item.action)
        .forEach((item) => {
          this.parse(item).then(() => {
            progress += 1;
            this.downloadProgress = Math.floor(100 * ((progress + 1) / total));
          });
        });
      // todo, eventually: use the $q.all function as demonstrated in product history eye
    }

    showLoadingBar() {
      const tableState = this.tableController.tableState && this.tableController.tableState();
      let earlyDate = 0;
      const startDate = new Date().getTime();
      if (tableState && tableState.search.predicateObject.date) {
        earlyDate = tableState.search.predicateObject.date.after;
      }
      const earliestDateOfData = this.results
        .map((evt) => evt.date)
        .reduce((acc, cur) => (cur < acc ? cur : acc), startDate);
      const shouldShow = (this.loadProgress.total > 0) && (this.loadProgress.percentage < 100) && (!earlyDate || earliestDateOfData > earlyDate);
      return shouldShow;
    }

    searchAllListings() {
      const that = this;
      this.networkService.getActivityMetadata('listings')
        .then((results) => {
          that.results = results.activities
            .map((item) => that.prepare(item));
          that.loadProgress.total = (Math.floor(results.resultSetSize / results.pageSize) + (results.resultSetSize % results.pageSize === 0 ? 0 : 1));
          const filter = {};
          filter.dataFilter = '';
          filter.tableState = this.tableController.tableState();
          filter.tableState.search.predicateObject.categoriesFilter = '|LISTING|';
          filter.tableState.search.predicateObject.date = {
            after: this.ReportService.coerceToMidnight(new Date()).getTime() - this.defaultDateRangeOffset,
            before: this.ReportService.coerceToMidnight(new Date(), true).getTime(),
          };
          that.doFilter(filter);
          that.addPageToData(1);
        });
    }

    addPageToData(page) {
      const that = this;
      if (this.isDestroyed) { return; }
      this.networkService.getActivityMetadata('listings', { pageNum: page, ignoreLoadingBar: true }).then((results) => {
        results.activities.forEach((item) => {
          that.results.push(that.prepare(item));
        });
        that.loadProgress.complete += 1;
        that.loadProgress.percentage = Math.floor(100 * ((that.loadProgress.complete + 1) / that.loadProgress.total));
        if (page < that.loadProgress.total) {
          that.addPageToData(page + 1);
        }
      });
    }

    searchSingleListingId() {
      const that = this;
      this.networkService.getSingleListingActivityMetadata(this.listingId)
        .then((results) => {
          that.results = results
            .map((item) => that.prepare(item, true));
        });
    }

    search() {
      if (this.listingId) {
        this.searchSingleListingId();
      } else {
        this.searchAllListings();
      }
    }

    shouldShowChange(item, key) {
      switch (key) {
        case 'transparencyAttestationUrl':
          return item.originalData.mandatoryDisclosures === undefined;
        default:
          return true;
      }
    }
  },
};

angular.module('chpl.reports')
  .component('chplReportsListings', ReportsListingsComponent);

export default ReportsListingsComponent;
