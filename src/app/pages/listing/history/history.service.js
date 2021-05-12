const interpretActivity = (activity, utilService) => {
  let ret = {
    ...activity,
    change: [],
  }
  const {originalData: prev, newData: curr} = activity;
  if (activity.description.startsWith('Updated certified product')) {
    let ccChanges = interpretCertificationCriteria(prev, curr, activity, utilService);
    if (ccChanges.length > 0) {
      ret.change = [
        ...ret.change,
        ...ccChanges,
      ];
    }
    let cqmChanges = interpretCqms(prev, curr, activity);
    if (cqmChanges.length > 0) {
      ret.change = [
        ...ret.change,
        ...cqmChanges,
      ];
    }
    let basicChanges = interpretListingChange(prev, curr, activity);
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
}

const interpretCertificationCriteria = (prev, curr, activity, utilService) => {
  var pCC = prev.certificationResults;
  var cCC = curr.certificationResults;
  var i, j;
  let changes = [];

  pCC.sort((a, b) => utilService.sortCertActual(a, b));
  cCC.sort((a, b) => utilService.sortCertActual(a, b));
  for (i = 0; i < pCC.length; i++) {
    var obj = {
      criteria: pCC[i].number + (pCC[i].title.indexOf('Cures Update') > 0 ? ' (Cures Update)' : ''),
      changes: [],
    };

    // Became certified to a criteria
    if (!pCC[i].success && cCC[i].success) {
      obj.changes.push('<li>Certification Criteria was added</li>');
    }

    // Added/removed G1 or G2 success
    if (pCC[i].g1Success !== cCC[i].g1Success) {
      obj.changes.push('<li>Certification Criteria became ' + (cCC[i].g1Success ? 'Certified to' : 'Decertified from') + ' G1</li>');
    }
    if (pCC[i].g2Success !== cCC[i].g2Success) {
      obj.changes.push('<li>Certification Criteria became ' + (cCC[i].g2Success ? 'Certified to' : 'Decertified from') + ' G2</li>');
    }

    // Change to G1/G2 Macra Measures
    var measures = utilService.arrayCompare(pCC[i].g1MacraMeasures,cCC[i].g1MacraMeasures);
    if (measures.added.length > 0) {
      obj.changes.push('<li>Added G1 MACRA Measure' + (measures.added.length > 1 ? 's' : '') + ':<ul>');
      for (j = 0; j < measures.added.length; j++) {
        obj.changes.push('<li>' + measures.added[j].abbreviation + '</li>');
      }
      obj.changes.push('</ul></li>');
    }
    if (measures.removed.length > 0) {
      obj.changes.push('<li>Removed G1 MACRA Measure' + (measures.removed.length > 1 ? 's' : '') + ':<ul>');
      for (j = 0; j < measures.removed.length; j++) {
        obj.changes.push('<li>' + measures.removed[j].abbreviation + '</li>');
      }
      obj.changes.push('</ul></li>');
    }
    measures = utilService.arrayCompare(pCC[i].g2MacraMeasures,cCC[i].g2MacraMeasures);
    if (measures.added.length > 0) {
      obj.changes.push('<li>Added G2 MACRA Measure' + (measures.added.length > 1 ? 's' : '') + ':<ul>');
      for (j = 0; j < measures.added.length; j++) {
        obj.changes.push('<li>' + measures.added[j].abbreviation + '</li>');
      }
      obj.changes.push('</ul></li>');
    }
    if (measures.removed.length > 0) {
      obj.changes.push('<li>Removed G2 MACRA Measure' + (measures.removed.length > 1 ? 's' : '') + ':<ul>');
      for (j = 0; j < measures.removed.length; j++) {
        obj.changes.push('<li>' + measures.removed[j].abbreviation + '</li>');
      }
      obj.changes.push('</ul></li>');
    }

    if (obj.changes.length > 0) {
      changes.push(obj.criteria + ' changes:<ul>' + obj.changes.join('') + '</ul>');
    }
  }
  return changes;
}

const interpretCqms = (prev, curr, activity) => {
  let changes = [];
  var pCqms = prev.cqmResults;
  var cCqms = curr.cqmResults;
  pCqms.sort(function (a,b) { return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0); } );
  cCqms.sort(function (a,b) { return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0); } );
  var i, j;
  for (i = 0; i < pCqms.length; i++) {
    var obj = { cmsId: pCqms[i].cmsId, changes: [] };
    if (pCqms[i].success !== cCqms[i].success) {
      if (pCqms[i].success) {
        obj.changes.push('<li>CQM became "False"</li>');
      } else {
        obj.changes.push('<li>CQM became "True"</li>');
      }
    }
    for (j = 0; j < pCqms[i].allVersions.length; j++) {
      if (pCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) < 0 && cCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) >= 0) {
        obj.changes.push('<li>' + pCqms[i].allVersions[j] + ' added</li>');
      }
      if (pCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) >= 0 && cCqms[i].successVersions.indexOf(pCqms[i].allVersions[j]) < 0) {
        obj.changes.push('<li>' + pCqms[i].allVersions[j] + ' removed</li>');
      }
    }
    var criteria = compareArray(pCqms[i].criteria, cCqms[i].criteria, 'certificationNumber');
    for (j = 0; j < criteria.length; j++) {
      obj.changes.push('<li>Certification Criteria "' + criteria[j].name + '" changes<ul>' + criteria[j].changes.join('') + '</ul></li>');
    }
    if (obj.changes.length > 0) {
      changes.push(obj.cmsId + ' changes:<ul>' + obj.changes.join('') + '</ul>');
    }
  }
  return changes;
}

const compareArray = (prev, curr, root) => {
  var ret = [];
  var i, j;
  for (i = 0; i < prev.length; i++) {
    for (j = 0; j < curr.length; j++) {
      if (prev[i][root] === curr[j][root]) {
        prev[i].evaluated = true;
        curr[j].evaluated = true;
      }
    }
    if (!prev[i].evaluated) {
      ret.push({ name: prev[i][root], changes: ['<li>' + prev[i][root] + ' removed</li>']});
    }
  }
  for (i = 0; i < curr.length; i++) {
    if (!curr[i].evaluated) {
      ret.push({ name: curr[i][root], changes: ['<li>' + curr[i][root] + ' added</li>']});
    }
  }
  return ret;
}

const interpretListingChange = (prev, curr, activity) => {
  let changes = [];
  if (prev.chplProductNumber !== curr.chplProductNumber) {
    changes.push('CHPL Product Number changed from ' + prev.chplProductNumber + ' to ' + curr.chplProductNumber);
  }
  if (prev.curesUpdate !== curr.curesUpdate) {
    changes.push('2015 Edition Cures Update status changed from ' + (prev.curesUpdate ? 'True' : 'False') + ' to ' + (curr.curesUpdate ? 'True' : 'False'));
  }
  if (prev.rwtPlansUrl !== curr.rwtPlansUrl) {
    if (!prev.rwtPlansUrl) {
      changes.push('Real World Testing Plans URL added: ' + curr.rwtPlansUrl);
    } else if (!curr.rwtPlansUrl) {
      changes.push('Real World Testing Plans URL removed: ' + prev.rwtPlansUrl);
    } else {
      changes.push('Real World Testing Plans URL changed from ' + prev.rwtPlansUrl + ' to ' + curr.rwtPlansUrl);
    }
  }
  if (prev.rwtResultsUrl !== curr.rwtResultsUrl) {
    if (!prev.rwtResultsUrl) {
      changes.push('Real World Testing Results URL added: ' + curr.rwtResultsUrl);
    } else if (!curr.rwtResultsUrl) {
      changes.push('Real World Testing Results URL removed: ' + prev.rwtResultsUrl);
    } else {
      changes.push('Real World Testing Results URL changed from ' + prev.rwtResultsUrl + ' to ' + curr.rwtResultsUrl);
    }
  }
  return changes;
}

const interpretCertificationStatusChanges = (listing) => {
  return listing.certificationEvents
    .filter(e => !e.eventTypeId || e.eventTypeId === 1)
    .map(e => {
      e.activityDate = parseInt(e.eventDate, 10);
      if (e.eventTypeId && e.eventTypeId === 1) {
        e.change = ['Certification Status became "Active"'];
      } else if (e.certificationStatusName) {
        e.change = ['Certification Status became "' + e.certificationStatusName + '"'];
      } else if (e.status) {
        e.change = ['Certification Status became "' + e.status.name + '"'];
      } else {
        e.change = ['Undetermined change'];
      }
      return e;
    });
}

const interpretMuuHistory = (listing, DateUtil) => {
  return listing.meaningfulUseUserHistory
    .sort((a, b) => a.muuDate - b.muuDate)
    .map((item, idx, arr) => {
      if (idx > 0) {
        item.activityDate = parseInt(item.muuDate, 10);
        item.change = ['Estimated number of Meaningful Use Users changed from ' + arr[idx - 1].muuCount
                       + ' to ' + item.muuCount + ' on ' + DateUtil.getDisplayDateFormat(item.muuDate)];
        /*
        item.change = ['Estimated number of Meaningful Use Users changed from ' + arr[idx - 1].muuCount
                       + ' to ' + item.muuCount + ' on ' + this.$filter('date')(item.muuDate, 'mediumDate')];
                       */
      } else {
        item.activityDate = parseInt(item.muuDate, 10);
        item.change = ['Estimated number of Meaningful Use Users became ' + item.muuCount + ' on ' + DateUtil.getDisplayDateFormat(item.muuDate)];
//        item.change = ['Estimated number of Meaningful Use Users became ' + item.muuCount + ' on ' + this.$filter('date')(item.muuDate, 'mediumDate')];
      }
      return item;
    })
}

export {
  interpretActivity,
  interpretCertificationStatusChanges,
  interpretMuuHistory,
};

/*


    _interpretDeveloper (activity) {
      var curr, prev;
      activity.change = [];
      prev = activity.originalData;
      curr = activity.newData;
      if (activity.description.startsWith('Developer ')) {
        if (prev && prev.name !== curr.name) {
          activity.change.push('Developer changed from ' + prev.name + ' to ' + curr.name);
        }
      } else if (activity.description.startsWith('Merged ')) {
        activity.change.push('Developers ' + prev.map(d => d.name).join(' and ') + ' merged to form ' + curr.name);
        let that = this;
        prev.forEach(d => {  // look at history of "parent" Developers
          that.interpretedActivity.developers.push(d.id);
          that.networkService.getSingleDeveloperActivityMetadata(d.id).then(response => {
            let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretDeveloper(response)));
            that.$q.all(promises)
              .then(response => {
                that.activity = that.activity
                  .concat(response)
                  .filter(a => a.change && a.change.length > 0);
              });
          });
        });
      } else if (activity.description.startsWith('Split ')) {
        activity.change.push('Developer ' + prev.name + ' split to become Developers ' + curr[0].name + ' and ' + curr[1].name);
        if (this.interpretedActivity.developers.indexOf(prev.id) === -1) {
          let that = this;
          that.interpretedActivity.developers.push(prev.id);
          that.networkService.getSingleDeveloperActivityMetadata(prev.id, {end: activity.activityDate - this.SPLIT_DATE_SKEW_ADJUSTMENT}).then(response => {
            let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretDeveloper(response)));
            that.$q.all(promises)
              .then(response => {
                that.activity = that.activity
                  .concat(response)
                  .filter(a => a.change && a.change.length > 0);
              });
          });
        }
      }
      return activity;
    }

    _interpretProduct (activity) {
      var curr, prev;
      activity.change = [];
      prev = activity.originalData;
      curr = activity.newData;
      if (activity.description.startsWith('Product ')) {
        if (prev && prev.name !== curr.name) {
          activity.change.push('Product changed from ' + prev.name + ' to ' + curr.name);
        }
      } else if (activity.description.startsWith('Merged ')) {
        activity.change.push('Products ' + prev.map(p => p.name).join(' and ') + ' merged to form ' + curr.name);
        let that = this;
        prev.forEach(p => {  // look at history of "parent" Products
          that.interpretedActivity.products.push(prev.id);
          that.networkService.getSingleProductActivityMetadata(p.id).then(response => {
            let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretProduct(response)));
            that.$q.all(promises)
              .then(response => {
                that.activity = that.activity
                  .concat(response)
                  .filter(a => a.change && a.change.length > 0);
              });
          });
        });
      } else if (activity.description.startsWith('Split ')) {
        activity.change.push('Product ' + prev.name + ' split to become Products ' + curr[0].name + ' and ' + curr[1].name);
        if (this.interpretedActivity.products.indexOf(prev.id) === -1) {
          let that = this;
          that.interpretedActivity.products.push(prev.id);
          that.networkService.getSingleProductActivityMetadata(prev.id, {end: activity.activityDate - this.SPLIT_DATE_SKEW_ADJUSTMENT}).then(response => {
            let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretProduct(response)));
            that.$q.all(promises)
              .then(response => {
                that.activity = that.activity
                  .concat(response)
                  .filter(a => a.change && a.change.length > 0);
              });
          });
        }
      }
      return activity;
    }

    _interpretVersion (activity) {
      let curr, prev;
      activity.change = [];
      prev = activity.originalData;
      curr = activity.newData;
      if (activity.description.startsWith('Product Version ')) {
        if (prev && prev.version !== curr.version) {
          activity.change.push('Version changed from ' + prev.version + ' to ' + curr.version);
        }
      } else if (activity.description.startsWith('Merged ')) {
        activity.change.push('Versions ' + prev.map(v => v.version).join(' and ') + ' merged to form ' + curr.version);
        let that = this;
        prev.forEach(v => {  // look at history of "parent" Versions
          that.interpretedActivity.versions.push(prev.id);
          that.networkService.getSingleVersionActivityMetadata(v.id).then(response => {
            let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretVersion(response)));
            that.$q.all(promises)
              .then(response => {
                that.activity = that.activity
                  .concat(response)
                  .filter(a => a.change && a.change.length > 0);
              });
          });
        });
      } else if (activity.description.startsWith('Split ')) {
        activity.change.push('Version ' + prev.version + ' split to become Versions ' + curr[0].version + ' and ' + curr[1].version);
        if (this.interpretedActivity.versions.indexOf(prev.id) === -1) {
          let that = this;
          that.interpretedActivity.versions.push(prev.id);
          that.networkService.getSingleVersionActivityMetadata(prev.id, {end: activity.activityDate - this.SPLIT_DATE_SKEW_ADJUSTMENT}).then(response => {
            let promises = response.map(item => that.networkService.getActivityById(item.id).then(response => that._interpretVersion(response)));
            that.$q.all(promises)
              .then(response => {
                that.activity = that.activity
                  .concat(response)
                  .filter(a => a.change && a.change.length > 0);
              });
          });
        }
      }
      return activity;
    }
  },
};
*/
