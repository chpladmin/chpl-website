import { compareArrays, compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';

let rules;

/* eslint-disable no-nested-ternary */
const compare = (before, after, key, title = 'unknown') => {
  let options;
  switch (key) {
    case 'criteria':
      options = {
        sort: (p, c) => sortCriteria(p, c),
        write: (f) => f.number,
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

const lookup = {
  shortCircuit: ['criteria'],
  'root.additionalInformation': { message: (before, after) => comparePrimitive(before, after, 'additionalInformation', 'Additional Information') },
  'root.approvedStandardVersion': { message: (before, after) => comparePrimitive(before, after, 'approvedStandardVersion', 'Approved Standard Version') },
  'root.criteria': { message: (before, after) => compare(before, after, 'criteria', 'Certification Criteria') },
  'root.endDay': { message: (before, after) => comparePrimitive(before, after, 'endDay', 'End Date', getDisplayDateFormat) },
  'root.groupName': { message: (before, after) => comparePrimitive(before, after, 'groupName', 'Group') },
  'root.id': { message: () => undefined },
  'root.practiceType': { message: () => 'Practice Type' },
  'root.practiceType.description': { message: () => undefined },
  'root.practiceType.id': { message: () => undefined },
  'root.practiceType.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'root.regulatoryTextCitation': { message: (before, after) => comparePrimitive(before, after, 'regulatoryTextCitation', 'Regulatory Text Citation') },
  'root.replaced': { message: (before, after) => comparePrimitive(before, after, 'replaced', 'Replaced') },
  'root.requiredDay': { message: (before, after) => comparePrimitive(before, after, 'requiredDay', 'Required Date', getDisplayDateFormat) },
  'root.retired': { message: (before, after) => comparePrimitive(before, after, 'retired', 'Retired') },
  'root.rule': { message: () => 'Rule' },
  'root.rule.id': { message: () => undefined },
  'root.rule.name': { message: (before, after) => comparePrimitive(before, after, 'name', 'Name') },
  'root.startDay': { message: (before, after) => comparePrimitive(before, after, 'startDay', 'Start Date', getDisplayDateFormat) },
  'root.value': { message: (before, after) => comparePrimitive(before, after, 'value', 'Value') },
};

const compareSystemMaintenance = (prev, curr) => {
  rules = lookup;
  if (prev && curr) {
    return compareObject(prev, curr, rules);
  }
  return [];
};

export default compareSystemMaintenance;
