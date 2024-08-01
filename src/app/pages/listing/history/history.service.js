import * as jsJoda from '@js-joda/core';

import { briefLookup, compareListing } from './listings.service';

import { getDisplayDateFormat, localDateToTimestamp } from 'services/date-util';

const interpretActivity = (activity, canSeeHistory) => {
  const ret = {
    ...activity,
    change: [],
  };
  const { originalData: prev, newData: curr } = activity;
  if (activity.description.startsWith('Updated certified product')) {
    const listingChanges = canSeeHistory ? compareListing(prev, curr) : compareListing(prev, curr, briefLookup);
    if (listingChanges.length > 0) {
      ret.change = [
        ...ret.change,
        ...listingChanges,
      ];
    }
  } else if (activity.description.startsWith('Changed ACB ownership')) {
    const changes = [];
    if (prev.chplProductNumber !== curr.chplProductNumber) {
      changes.push(`CHPL Product Number changed from ${prev.chplProductNumber} to ${curr.chplProductNumber}`);
    }
    ret.change = [
      ...ret.change,
      ...changes,
    ];
  } else if (activity.description === 'Created a certified product') {
    ret.change.push('Certified product was uploaded to the CHPL');
  } else if (activity.description.startsWith('Surveillance was added')) {
    ret.change.push('Surveillance activity was added');
  } else if (activity.description.startsWith('Surveillance was updated')) {
    const listingChanges = canSeeHistory ? compareListing(prev, curr) : ['Surveillance activity was updated'];
    if (listingChanges.length > 0) {
      ret.change = [
        ...ret.change,
        ...listingChanges,
      ];
    }
  } else if (activity.description.startsWith('Surveillance was delete')) {
    ret.change.push('Surveillance activity was deleted');
  }
  return ret;
};

const interpretCertificationStatusChanges = (listing) => listing.certificationEvents
  .filter((e) => !e.eventTypeId || e.eventTypeId === 1)
  .filter((e) => e.eventDay <= jsJoda.LocalDate.now())
  .map((e) => {
    e.activityDate = parseInt(e.eventDate, 10);
    if (e.eventTypeId && e.eventTypeId === 1) {
      e.change = ['Certification Status became "Active"'];
    } else if (e.certificationStatusName) {
      e.change = [`Certification Status became "${e.certificationStatusName}"`];
    } else if (e.status) {
      e.change = [`Certification Status became "${e.status.name}"`];
    } else {
      e.change = ['Undetermined change'];
    }
    return e;
  });

const interpretPIHistory = (listing) => listing.promotingInteroperabilityUserHistory
  .sort((a, b) => (a.userCountDate < b.userCountDate ? -1 : 1))
  .map((item, idx, arr) => {
    const title = 'Promoting Interoperability';
    item.activityDate = localDateToTimestamp(item.userCountDate);
    if (idx > 0) {
      item.change = [`Estimated number of ${title} Users changed from ${arr[idx - 1].userCount} to ${item.userCount} on ${getDisplayDateFormat(item.userCountDate)}`];
    } else {
      item.change = [`Estimated number of ${title} Users became ${item.userCount} on ${getDisplayDateFormat(item.userCountDate)}`];
    }
    return item;
  });

const interpretDeveloper = (activity) => {
  const ret = {
    ...activity,
    change: [],
  };
  const SPLIT_DATE_SKEW_ADJUSTMENT = 5 * 1000; // in milliseconds
  const { originalData: prev, newData: curr } = activity;
  let merged = [];
  let split = {};
  if (activity.description.startsWith('Developer ')) {
    if (prev && prev.name !== curr.name) {
      ret.change.push(`Developer changed from ${prev.name} to ${curr.name}`);
    }
    if (prev && curr && prev.id !== curr.id) {
      ret.change.push(`Developer "${prev.name}" joined Developer "${curr.name}"`);
      merged = [prev.id];
    }
  } else if (activity.description.startsWith('Merged ')) {
    ret.change.push(`Developers ${prev.map((p) => p.name).join(' and ')} merged to form ${curr.name}`);
    merged = prev.map((p) => p.id || p.developerId);
  } else if (activity.description.startsWith('Split ')) {
    ret.change.push(`Developer ${prev.name} split to become Developers ${curr[0].name} and ${curr[1].name}`);
    split = { id: prev.id, end: activity.activityDate - SPLIT_DATE_SKEW_ADJUSTMENT };
  }
  return { interpreted: ret, merged, split };
};

const interpretProduct = (activity) => {
  const ret = {
    ...activity,
    change: [],
  };
  const SPLIT_DATE_SKEW_ADJUSTMENT = 5 * 1000; // in milliseconds
  const { originalData: prev, newData: curr } = activity;
  let merged = [];
  let split = {};
  let ownerChanges = [];
  if (activity.description.startsWith('Product ')) {
    if (prev && prev.name !== curr.name) {
      ret.change.push(`Product changed from ${prev.name} to ${curr.name}`);
    }
    if (prev && curr && prev.ownerHistory?.length !== curr.ownerHistory?.length) {
      ownerChanges = [...curr.ownerHistory];
    }
  } else if (activity.description.startsWith('Merged ')) {
    ret.change.push(`Products ${prev.map((p) => p.name).join(' and ')} merged to form ${curr.name}`);
    merged = prev.map((p) => p.id);
  } else if (activity.description.startsWith('Split ')) {
    ret.change.push(`Product ${prev.name} split to become Products ${curr[0].name} and ${curr[1].name}`);
    split = { id: prev.id, end: activity.activityDate - SPLIT_DATE_SKEW_ADJUSTMENT };
  }
  return {
    interpreted: ret, merged, ownerChanges, split,
  };
};

const interpretVersion = (activity) => {
  const ret = {
    ...activity,
    change: [],
  };
  const SPLIT_DATE_SKEW_ADJUSTMENT = 5 * 1000; // in milliseconds
  const { originalData: prev, newData: curr } = activity;
  let merged = [];
  let split = {};
  if (activity.description.startsWith('Product Version ')) {
    if (prev && prev.version !== curr.version) {
      ret.change.push(`Version changed from ${prev.version} to ${curr.version}`);
    }
  } else if (activity.description.startsWith('Merged ')) {
    ret.change.push(`Versions ${prev.map((p) => p.version).join(' and ')} merged to form ${curr.version}`);
    merged = prev.map((p) => p.id);
  } else if (activity.description.startsWith('Split ')) {
    ret.change.push(`Version ${prev.version} split to become Versions ${curr[0].version} and ${curr[1].version}`);
    split = { id: prev.id, end: activity.activityDate - SPLIT_DATE_SKEW_ADJUSTMENT };
  }
  return { interpreted: ret, merged, split };
};

export {
  interpretActivity,
  interpretCertificationStatusChanges,
  interpretPIHistory,
  interpretDeveloper,
  interpretProduct,
  interpretVersion,
};
