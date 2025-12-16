import { compareArrays, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

let lookup;

/* eslint-disable no-nested-ternary */
const compare = (before, after, key, title = 'unknown') => {
  let options;
  switch (key) {
    case 'capStatuses':
      options = {
        sort: (p, c) => (p.name < c.name ? -1 : p.name > c.name ? 1 : 0),
        write: (f) => `CAP Statuses: "${f.name}"`,
      };
      break;
    case 'surveillanceGroundsForInitiating':
      options = {
        sort: (p, c) => (p.name < c.name ? -1 : p.name > c.name ? 1 : 0),
        write: (f) => `Surveillance Grounds For Initiating: "${f.name}"`,
      };
      break;
    case 'surveillanceProcessTypes':
      options = {
        sort: (p, c) => (p.name < c.name ? -1 : p.name > c.name ? 1 : 0),
        write: (f) => `Surveillance Process Types: "${f.name}"`,
      };
      break;
    case 'surveillances':
      options = {
        sort: (p, c) => (p.friendlyId < c.friendlyId ? -1 : p.friendlyId > c.friendlyId ? 1 : 0),
        write: (f) => `Surveillance "${f.friendlyId}"`,
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

lookup = {
  shortCircuit: [
    'root.developer',
    'root.product',
    'surveillances.quarterlyReport.acb',
  ],
  'root.activitiesOutcomesSummary': { message: (before, after) => comparePrimitive(before, after, 'activitiesOutcomesSummary', 'Activities Outcome Summary') },
  'root.appropriateUseOfMark': { message: (before, after) => comparePrimitive(before, after, 'appropriateUseOfMark', 'Appropriate Use Of Mark') },
  'root.developerComplaintsLogReview': { message: (before, after) => comparePrimitive(before, after, 'developerComplaintsLogReview', 'Developer Complaints Log Review') },
  'root.disclosureRequirementsSummary': { message: (before, after) => comparePrimitive(before, after, 'disclosureRequirementsSummary', 'Disclosure Requirements Summary') },
  'root.disclosureSummary': { message: (before, after) => comparePrimitive(before, after, 'disclosureSummary', 'Disclosure Summary') },
  'root.endDate': { message: (before, after) => comparePrimitive(before, after, 'endDate', 'End Date', getDisplayDateFormat) },
  'root.findingsSummary': { message: (before, after) => comparePrimitive(before, after, 'findingsSummary', 'Findings Summary') },
  'root.icsSurveillanceSummary': { message: (before, after) => comparePrimitive(before, after, 'icsSurveillanceSummary', 'ICS Surveillance Summary') },
  'root.obstacleSummary': { message: (before, after) => comparePrimitive(before, after, 'obstacleSummary', 'Obstacle Summary') },
  'root.postCertificationPerformanceOfCertifiedCapabilities': { message: (before, after) => comparePrimitive(before, after, 'postCertificationPerformanceOfCertifiedCapabilities', 'Post Certification Performance Of Certified Capabilities') },
  'root.prioritizedElementSummary': { message: (before, after) => comparePrimitive(before, after, 'prioritizedElementSummary', 'Prioritized Element Summary') },
  'root.priorityChangesFromFindingsSummary': { message: (before, after) => comparePrimitive(before, after, 'priorityChangesFromFindingsSummary', 'Priority Changes From Findings Summary') },
  'root.quarterlyReport': { message: () => 'Quarterly Report' },
  'root.quarterlyReport.endDate': { message: (before, after) => comparePrimitive(before, after, 'endDate', 'End Date', getDisplayDateFormat) },
  'root.quarterlyReport.startDate': { message: (before, after) => comparePrimitive(before, after, 'startDate', 'Start Date', getDisplayDateFormat) },
  'root.reactiveSummary': { message: (before, after) => comparePrimitive(before, after, 'reactiveSummary', 'Reactive Summary') },
  'root.reactiveSurveillanceSummary': { message: (before, after) => comparePrimitive(before, after, 'reactiveSurveillanceSummary', 'Reactive Surveillance Summary') },
  'root.startDate': { message: (before, after) => comparePrimitive(before, after, 'startDate', 'Start Date', getDisplayDateFormat) },
  'root.surveillanceActivitiesAndOutcomes': { message: (before, after) => comparePrimitive(before, after, 'surveillanceActivitiesAndOutcomes', 'Surveillance Activities And Outcomes') },
  'root.surveillances': { message: (before, after) => compare(before, after, 'surveillances', 'Surveillances') },
  'root.transparencyDisclosureSummary': { message: (before, after) => comparePrimitive(before, after, 'transparencyDisclosureSummary', 'Transparency Disclosure Summary') },
  'surveillances.additionalCostsEvaluation': { message: (before, after) => comparePrimitive(before, after, 'additionalCostsEvaluation', 'Additional Costs Evaluation') },
  'surveillances.capStatusOther': { message: (before, after) => comparePrimitive(before, after, 'capStatusOther', 'CAP Status - Other') },
  'surveillances.capStatuses': { message: (before, after) => compare(before, after, 'capStatuses', 'CAP Statuses') },
  'surveillances.completedCapVerification': { message: (before, after) => compare(before, after, 'completedCapVerification', 'Completed CAP Verification') },
  'surveillances.directionDeveloperResolution': { message: (before, after) => comparePrimitive(before, after, 'directionDeveloperResolution', 'Direction Developer Resolution') },
  'surveillances.endDate': { message: (before, after) => comparePrimitive(before, after, 'endDate', 'End Date', getDisplayDateFormat) },
  'surveillances.groundsForInitiating': { message: (before, after) => compare(before, after, 'groundsForInitiating', 'Grounds For Initiating') },
  'surveillances.k1Reviewed': { message: (before, after) => comparePrimitive(before, after, 'k1Reviewed', 'K1 Reviewed') },
  'surveillances.limitationsEvaluation': { message: (before, after) => comparePrimitive(before, after, 'limitationsEvaluation', 'Limitations Evaluation') },
  'surveillances.mappingId': { message: () => undefined },
  'surveillances.nonconformityCauses': { message: (before, after) => comparePrimitive(before, after, 'nonconformityCauses', 'Nonconformity Causes') },
  'surveillances.nonconformityNature': { message: (before, after) => comparePrimitive(before, after, 'nonconformityNature', 'Nonconformity Nature') },
  'surveillances.nondisclosureEvaluation': { message: (before, after) => comparePrimitive(before, after, 'nondisclosureEvaluation', 'Nondisclosure Evaluation') },
  'surveillances.quarterlyReport': { message: () => 'Quarterly Report' },
  'surveillances.quarterlyReport.activitiesOutcomesSummary': { message: (before, after) => comparePrimitive(before, after, 'activitiesOutcomesSummary', 'Activities Outcome Summary') },
  'surveillances.quarterlyReport.disclosureRequirementsSummary': { message: (before, after) => comparePrimitive(before, after, 'disclosureRequirementsSummary', 'Disclosure Requirements Summary') },
  'surveillances.quarterlyReport.disclosureSummary': { message: (before, after) => comparePrimitive(before, after, 'disclosureSummary', 'Disclosure Summary') },
  'surveillances.quarterlyReport.endDate': { message: (before, after) => comparePrimitive(before, after, 'endDate', 'End Date', getDisplayDateFormat) },
  'surveillances.quarterlyReport.endDate.0': { message: () => undefined },
  'surveillances.quarterlyReport.endDate.1': { message: () => undefined },
  'surveillances.quarterlyReport.endDate.2': { message: () => undefined },
  'surveillances.quarterlyReport.endDateTime': { message: () => undefined },
  'surveillances.quarterlyReport.id': { message: () => undefined },
  'surveillances.quarterlyReport.prioritizedElementSummary': { message: (before, after) => comparePrimitive(before, after, 'prioritizedElementSummary', 'Prioritized Element Summary') },
  'surveillances.quarterlyReport.quarter': { message: () => 'Quarter' },
  'surveillances.quarterlyReport.quarter.endDay': { message: (before, after) => comparePrimitive(before, after, 'endDay', 'End Day') },
  'surveillances.quarterlyReport.quarter.endMonth': { message: (before, after) => comparePrimitive(before, after, 'endMonth', 'End Month') },
  'surveillances.quarterlyReport.quarter.id': { message: () => undefined },
  'surveillances.quarterlyReport.quarter.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'surveillances.quarterlyReport.quarter.startDay': { message: (before, after) => comparePrimitive(before, after, 'startDay', 'Start Day') },
  'surveillances.quarterlyReport.quarter.startMonth': { message: (before, after) => comparePrimitive(before, after, 'startMonth', 'Start Month') },
  'surveillances.quarterlyReport.reactiveSummary': { message: (before, after) => comparePrimitive(before, after, 'reactiveSummary', 'Reactive Summary') },
  'surveillances.quarterlyReport.reactiveSurveillanceSummary': { message: (before, after) => comparePrimitive(before, after, 'reactiveSurveillanceSummary', 'Reactive Surveillance Summary') },
  'surveillances.quarterlyReport.startDate': { message: (before, after) => comparePrimitive(before, after, 'startDate', 'Start Date', getDisplayDateFormat) },
  'surveillances.quarterlyReport.startDate.0': { message: () => undefined },
  'surveillances.quarterlyReport.startDate.1': { message: () => undefined },
  'surveillances.quarterlyReport.startDate.2': { message: () => undefined },
  'surveillances.quarterlyReport.startDateTime': { message: () => undefined },
  'surveillances.quarterlyReport.transparencyDisclosureSummary': { message: (before, after) => comparePrimitive(before, after, 'transparencyDisclosureSummary', 'Transparency Disclosure Summary') },
  'surveillances.quarterlyReport.year': { message: (before, after) => comparePrimitive(before, after, 'year', 'Year') },
  'surveillances.startDate': { message: (before, after) => comparePrimitive(before, after, 'startDate', 'Start Date', getDisplayDateFormat) },
  'surveillances.stepsToEngage': { message: (before, after) => comparePrimitive(before, after, 'stepsToEngage', 'Steps To Engage') },
  'surveillances.stepsToSurveil': { message: (before, after) => comparePrimitive(before, after, 'stepsToSurveil', 'Steps To Surveil') },
  'surveillances.surveillanceFindings': { message: (before, after) => comparePrimitive(before, after, 'surveillanceFindings', 'Surveillance Findings') },
  'surveillances.surveillanceGroundsForInitiating': { message: (before, after) => compare(before, after, 'surveillanceGroundsForInitiating', 'Surveillance Grounds For Initiating') },
  'surveillances.surveillanceGroundsForInitiatingOther': { message: (before, after) => comparePrimitive(before, after, 'surveillanceGroundsForInitiatingOther', 'Surveillance Grounds For Initiating - Other') },
  'surveillances.surveillanceOutcome': { message: () => 'Surveillance Outcome' },
  'surveillances.surveillanceOutcome.id': { message: () => undefined },
  'surveillances.surveillanceOutcome.name': { message: (before, after) => compare(before, after, 'name', 'Name') },
  'surveillances.surveillanceOutcomeOther': { message: (before, after) => comparePrimitive(before, after, 'surveillanceOutcomeOther', 'Surveillance Outcome - Other') },
  'surveillances.surveillanceProcessType': { message: () => 'Surveillance Process Type' },
  'surveillances.surveillanceProcessType.id': { message: () => undefined },
  'surveillances.surveillanceProcessType.name': { message: (before, after) => compare(before, after, 'name', 'Name') },
  'surveillances.surveillanceProcessTypeOther': { message: (before, after) => comparePrimitive(before, after, 'surveillanceProcessTypeOther', 'Surveillance Process Type - Other') },
  'surveillances.surveillanceProcessTypes': { message: (before, after) => compare(before, after, 'surveillanceProcessTypes', 'Surveillance Process Types') },
  'surveillances.transparencyDisclosureSummary': { message: (before, after) => comparePrimitive(before, after, 'transparencyDisclosureSummary', 'Transparency Disclosure Summary') },
};

const compareSurveillanceReporting = (prev, curr) => compareObject(prev, curr, lookup);

export default compareSurveillanceReporting;
