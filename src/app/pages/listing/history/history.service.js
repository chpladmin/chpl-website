const interpretActivity = (activity, utilService, ReportService) => {
  const ret = {
    ...activity,
    change: [],
  };
  const { originalData: prev, newData: curr } = activity;
  if (activity.description.startsWith('Updated certified product')) {
    const ccChanges = interpretCertificationCriteria(prev, curr, utilService);
    if (ccChanges.length > 0) {
      ret.change = [
        ...ret.change,
        ...ccChanges,
      ];
    }
    const cqmChanges = interpretCqms(prev, curr);
    if (cqmChanges.length > 0) {
      ret.change = [
        ...ret.change,
        ...cqmChanges,
      ];
    }
    const basicChanges = interpretListingChange(prev, curr, utilService, ReportService);
    if (basicChanges.length > 0) {
      ret.change = [
        ...ret.change,
        ...basicChanges,
      ];
    }
  } else if (activity.description === 'Created a certified product') {
    ret.change.push('Certified product was uploaded to the CHPL');
  } else if (activity.description.startsWith('Surveillance was added')) {
    ret.change.push('Surveillance activity was added');
  } else if (activity.description.startsWith('Surveillance was updated')) {
    ret.change.push('Surveillance activity was updated');
  } else if (activity.description.startsWith('Surveillance was delete')) {
    ret.change.push('Surveillance activity was deleted');
  }
  return ret;
};

const interpretCertificationCriteria = (prev, curr, utilService) => {
  const pCC = prev.certificationResults;
  const cCC = curr.certificationResults;
  let i;
  let j;
  const changes = [];

  pCC.sort((a, b) => utilService.sortCertActual(a, b));
  cCC.sort((a, b) => utilService.sortCertActual(a, b));
  for (i = 0; i < pCC.length; i += 1) {
    const obj = {
      criteria: pCC[i].number + (pCC[i].title.indexOf('Cures Update') > 0 ? ' (Cures Update)' : ''),
      changes: [],
    };

    // Became certified to a criteria
    if (!pCC[i].success && cCC[i].success) {
      obj.changes.push('<li>Certification Criteria was added</li>');
    }

    // Added/removed G1 or G2 success
    if (pCC[i].g1Success !== cCC[i].g1Success) {
      obj.changes.push(`<li>Certification Criteria became ${cCC[i].g1Success ? 'Certified to' : 'Decertified from'} G1</li>`);
    }
    if (pCC[i].g2Success !== cCC[i].g2Success) {
      obj.changes.push(`<li>Certification Criteria became ${cCC[i].g2Success ? 'Certified to' : 'Decertified from'} G2</li>`);
    }

    // Change to G1/G2 Macra Measures
    let measures = utilService.arrayCompare(pCC[i].g1MacraMeasures, cCC[i].g1MacraMeasures);
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
    measures = utilService.arrayCompare(pCC[i].g2MacraMeasures, cCC[i].g2MacraMeasures);
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

    if (obj.changes.length > 0) {
      changes.push(`${obj.criteria} changes:<ul>${obj.changes.join('')}</ul>`);
    }
  }
  return changes;
};

const interpretCqms = (prev, curr) => {
  const changes = [];
  const pCqms = prev.cqmResults;
  const cCqms = curr.cqmResults;
  pCqms.sort((a, b) => ((a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0)));
  cCqms.sort((a, b) => ((a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0)));
  let i;
  let j;
  for (i = 0; i < pCqms.length; i += 1) {
    const obj = { cmsId: pCqms[i].cmsId, changes: [] };
    if (pCqms[i].success !== cCqms[i].success) {
      if (pCqms[i].success) {
        obj.changes.push('<li>CQM became "False"</li>');
      } else {
        obj.changes.push('<li>CQM became "True"</li>');
      }
    }
    for (j = 0; j < pCqms[i].allVersions.length; j += 1) {
      if (pCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) < 0 && cCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) >= 0) {
        obj.changes.push(`<li>${pCqms[i].allVersions[j]} added</li>`);
      }
      if (pCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) >= 0 && cCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) < 0) {
        obj.changes.push(`<li>${pCqms[i].allVersions[j]} removed</li>`);
      }
    }
    const criteria = compareArray(pCqms[i].criteria, cCqms[i].criteria, 'certificationNumber');
    for (j = 0; j < criteria.length; j += 1) {
      obj.changes.push(`<li>Certification Criteria "${criteria[j].name}" changes<ul>${criteria[j].changes.join('')}</ul></li>`);
    }
    if (obj.changes.length > 0) {
      changes.push(`${obj.cmsId} changes:<ul>${obj.changes.join('')}</ul>`);
    }
  }
  return changes;
};

const compareArray = (prev, curr, root) => {
  const ret = [];
  let i;
  let j;
  for (i = 0; i < prev.length; i += 1) {
    for (j = 0; j < curr.length; j += 1) {
      if (prev[i][root] === curr[j][root]) {
        prev[i].evaluated = true;
        curr[j].evaluated = true;
      }
    }
    if (!prev[i].evaluated) {
      ret.push({ name: prev[i][root], changes: [`<li>${prev[i][root]} removed</li>`] });
    }
  }
  for (i = 0; i < curr.length; i += 1) {
    if (!curr[i].evaluated) {
      ret.push({ name: curr[i][root], changes: [`<li>${curr[i][root]} added</li>`] });
    }
  }
  return ret;
};

const interpretListingChange = (prev, curr, utilService, ReportService) => {
  const changes = [];
  if (prev.chplProductNumber !== curr.chplProductNumber) {
    changes.push(`CHPL Product Number changed from ${prev.chplProductNumber} to ${curr.chplProductNumber}`);
  }
  if (prev.curesUpdate !== curr.curesUpdate) {
    changes.push(`2015 Edition Cures Update status changed from ${prev.curesUpdate ? 'True' : 'False'} to ${curr.curesUpdate ? 'True' : 'False'}`);
  }
  if (prev.rwtPlansUrl !== curr.rwtPlansUrl) {
    if (!prev.rwtPlansUrl) {
      changes.push(`Real World Testing Plans URL added: ${curr.rwtPlansUrl}`);
    } else if (!curr.rwtPlansUrl) {
      changes.push(`Real World Testing Plans URL removed: ${prev.rwtPlansUrl}`);
    } else {
      changes.push(`Real World Testing Plans URL changed from ${prev.rwtPlansUrl} to ${curr.rwtPlansUrl}`);
    }
  }
  if (prev.rwtResultsUrl !== curr.rwtResultsUrl) {
    if (!prev.rwtResultsUrl) {
      changes.push(`Real World Testing Results URL added: ${curr.rwtResultsUrl}`);
    } else if (!curr.rwtResultsUrl) {
      changes.push(`Real World Testing Results URL removed: ${prev.rwtResultsUrl}`);
    } else {
      changes.push(`Real World Testing Results URL changed from ${prev.rwtResultsUrl} to ${curr.rwtResultsUrl}`);
    }
  }
  const measures = ReportService.compare(prev.measures, curr.measures, 'measures');
  if (measures.length > 0) {
    changes.push(`G1/G2 measure changes:<ul>${measures.join('')}</ul>`);
  }
  return changes;
};

const interpretCertificationStatusChanges = (listing) => listing.certificationEvents
  .filter((e) => !e.eventTypeId || e.eventTypeId === 1)
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

const interpretPIHistory = (listing, DateUtil, piIsOn) => listing.promotingInteroperabilityUserHistory
  .sort((a, b) => (a.userCountDate < b.userCountDate ? -1 : 1))
  .map((item, idx, arr) => {
    const title = piIsOn ? 'Promoting Interoperability' : 'Meaningful Use';
    item.activityDate = DateUtil.localDateToTimestamp(item.userCountDate);
    if (idx > 0) {
      item.change = [`Estimated number of ${title} Users changed from ${arr[idx - 1].userCount} to ${item.userCount} on ${DateUtil.getDisplayDateFormat(item.userCountDate)}`];
    } else {
      item.change = [`Estimated number of ${title} Users became ${item.userCount} on ${DateUtil.getDisplayDateFormat(item.userCountDate)}`];
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
  } else if (activity.description.startsWith('Merged ')) {
    ret.change.push(`Developers ${prev.map((p) => p.name).join(' and ')} merged to form ${curr.name}`);
    merged = prev.map((p) => p.id);
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
  if (activity.description.startsWith('Product ')) {
    if (prev && prev.name !== curr.name) {
      ret.change.push(`Product changed from ${prev.name} to ${curr.name}`);
    }
  } else if (activity.description.startsWith('Merged ')) {
    ret.change.push(`Products ${prev.map((p) => p.name).join(' and ')} merged to form ${curr.name}`);
    merged = prev.map((p) => p.id);
  } else if (activity.description.startsWith('Split ')) {
    ret.change.push(`Product ${prev.name} split to become Products ${curr[0].name} and ${curr[1].name}`);
    split = { id: prev.id, end: activity.activityDate - SPLIT_DATE_SKEW_ADJUSTMENT };
  }
  return { interpreted: ret, merged, split };
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
