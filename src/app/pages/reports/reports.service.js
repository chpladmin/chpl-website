export class ReportService {
  constructor ($filter, $log, utilService) {
    'ngInject';
    this.$filter = $filter;
    this.$log = $log;
    this.utilService = utilService;
  }

  compareArray (prev, curr, keys, root, nested, altRoot) {
    var ret = [];
    var change, i, j, k, l;
    if (prev !== null && prev !== undefined) {
      for (i = 0; i < prev.length; i++) {
        for (j = 0; j < curr.length; j++) {
          var obj = { name: curr[j][altRoot ? altRoot : root], changes: [] };
          if (prev[i][root] === curr[j][root]) {
            for (k = 0; k < keys.length; k++) {
              change = this.compareItem(prev[i], curr[j], keys[k].key, keys[k].display);
              if (change) { obj.changes.push('<li>' + change + '</li>'); }
            }
            if (nested) {
              for (k = 0; k < nested.length; k++) {
                nested[k].changes = this.utilService.arrayCompare(prev[i][nested[k].key],curr[j][nested[k].key],nested[k].compareId);
                if (nested[k].changes.added.length > 0) {
                  if (nested[k].countOnly) { obj.changes.push('<li>Added ' + nested[k].changes.added.length + ' ' + nested[k].display + (nested[k].changes.added.length !== 1 ? 's' : '') + '</li>'); }
                  else {
                    obj.changes.push('<li>Added ' + nested[k].display + ':<ul>');
                    for (l = 0; l < nested[k].changes.added.length; l++) {
                      obj.changes.push('<li>' + nested[k].changes.added[l][nested[k].value] + '</li>');
                    }
                    obj.changes.push('</ul></li>');
                  }
                }
                if (nested[k].changes.removed.length > 0) {
                  if (nested[k].countOnly) { obj.changes.push('<li>Removed ' + nested[k].changes.removed.length + ' ' + nested[k].display + (nested[k].changes.removed.length !== 1 ? 's' : '') + '</li>'); }
                  else {
                    obj.changes.push('<li>Removed ' + nested[k].display + ':<ul>');
                    for (l = 0; l < nested[k].changes.removed.length; l++) {
                      obj.changes.push('<li>' + nested[k].changes.removed[l][nested[k].value] + '</li>');
                    }
                    obj.changes.push('</ul></li>');
                  }
                }
              }
            }
            prev[i].evaluated = true;
            curr[j].evaluated = true;
          }
          if (obj.changes.length > 0) {
            ret.push(obj);
          }
        }
        if (!prev[i].evaluated) {
          ret.push({ name: prev[i][altRoot ? altRoot : root], changes: ['<li>' + prev[i][altRoot ? altRoot : root] + ' removed</li>']});
        }
      }
      for (i = 0; i < curr.length; i++) {
        if (!curr[i].evaluated) {
          ret.push({ name: curr[i][altRoot ? altRoot : root], changes: ['<li>' + curr[i][altRoot ? altRoot : root] + ' added</li>']});
        }
      }
    }
    return ret;
  }

  /**
     * Compare two arrays.
     * previous & current are arrays of objects
     * options is an object containing functions
     *   required functions:
     *      sort - function (a, b) : return negative number, 0, or positive number for whether a is <, =, or > b, respectively
     *      write - function (o) : return string of user friendly name of object o
     *   optional functions:
     *      compare - f (a, b) : return true iff a !== b and should be considered as a change
     *      change - f (p, c) : return string of user friendly description of change from p to c
     * Returns array of changes between the arrays
     */
  compareArrays (previous, current, options) {
    if (!Array.isArray(previous) || !Array.isArray(current)) {
      return [];
    }
    const ret = [];
    const prev = angular.copy(previous).sort(options.sort);
    const curr = angular.copy(current).sort(options.sort);
    let p = 0;
    let c = 0;

    while (p < prev.length && c < curr.length) {
      const sort = options.sort(prev[p], curr[c]);
      if (sort < 0) {
        ret.push('<li>Removed ' + options.write(prev[p]) + '</li>');
        p++;
      } else if (sort > 0) {
        ret.push('<li>Added ' + options.write(curr[c]) + '</li>');
        c++;
      } else if (sort === 0) {
        if (typeof options.compare === 'function' && options.compare(prev[p], curr[c])) {
          ret.push('<li>' + options.change(prev[p], curr[c]) + '</li>');
        }
        p++;
        c++;
      } else {
        this.$log.debug('Invalid sort', prev[p], curr[c], sort);
        p++;
        c++;
      }
    }
    while (c < curr.length) {
      ret.push('<li>Added ' + options.write(curr[c]) + '</li>');
      c++;
    }
    while (p < prev.length) {
      ret.push('<li>Removed ' + options.write(prev[p]) + '</li>');
      p++;
    }

    return ret;
  }

  compare (previous, current, key) {
    let options = this.getOptions(key);
    return this.compareArrays(previous, current, options);
  }

  getOptions (key) {
    switch (key) {
    case 'additionalSoftware':
      return {
        sort: (p, c) => p.name < c.name ? -1 : p.name > c.name ? 1 : 0,
        write: s => 'Relied Upon Software "' + s.name + '"',
        compare: (p, c) => p.version !== c.version || p.grouping !== c.grouping || p.certifiedProductNumber !== c.certifiedProductNumber || p.justification !== c.justification,
        change: (p, c) => {
          let ret = 'Updated Relied Upon Software "' + p.name + '":<ul>';
          if (p.version !== c.version) {
            ret += '<li>Version changed from "' + p.version + '" to "' + c.version + '"</li>';
          }
          if (p.grouping !== c.grouping) {
            ret += '<li>Grouping changed from "' + p.grouping + '" to "' + c.grouping + '"</li>';
          }
          if (p.certifiedProductNumber !== c.certifiedProductNumber) {
            ret += '<li>CHPL Product Number changed from "' + p.certifiedProductNumber + '" to "' + c.certifiedProductNumber + '"</li>';
          }
          if (p.justification !== c.justification) {
            ret += '<li>Justification changed from "' + p.justification + '" to "' + c.justification + '"</li>';
          }
          ret += '</ul>';
          return ret;
        },
      };
    case 'criteria':
      return {
        sort: (p, c) => p.number < c.number ? -1 : p.number > c.number ? 1 : p.title < c.title ? -1 : p.title > c.title ? 1 : 0,
        write: c => c.number + ': ' + c.title.replace(/\(Cures Update\)/, '<span class="cures-update">(Cures Update)</span>'),
      };
    case 'meaningfulUseUserHistory':
      return {
        sort: (p, c) => p.muuDate - c.muuDate,
        write: m => 'MUU Count of ' + m.muuCount + ' on ' + this.$filter('date')(m.muuDate, 'mediumDate', 'UTC'),
        compare: (p, c) => p.muuCount !== c.muuCount,
        change: (p, c) => 'MUU Count changed from ' + p.muuCount + ' to ' + c.muuCount + ' on ' + this.$filter('date')(p.muuDate, 'mediumDate', 'UTC'),
      };
    case 'measures':
      return {
        sort: (p, c) => {
          p.crit = p.associatedCriteria.map(cc => cc.id).join('|');
          c.crit = c.associatedCriteria.map(cc => cc.id).join('|');
          return p.measureType.id < c.measureType.id ? -1 : p.measureType.id > c.measureType.id ? 1 :
            p.measure.id < c.measure.id ? -1 : p.measure.id > c.measure.id ? 1 :
            p.measure.crit < c.measure.crit ? -1 : p.measure.crit > c.measure.crit ? 1 :
            0;
        },
        write: t => 'Measure "' + t.measure.abbreviation + ': ' + t.measure.requiredTest + '", for ' + t.measureType.name + ' with criteria: ' + t.associatedCriteria.map(c => c.number + ': ' + c.title).join(', '),
        compare: (p, c) => {
          p.crit = p.associatedCriteria.map(cc => cc.id).join('|');
          c.crit = c.associatedCriteria.map(cc => cc.id).join('|');
          return p.measureType.id === c.measureType.id
                        && p.measure.id === c.measure.id
                        && p.crit !== c.crit;
        },
        change: (p, c) => 'Measure "' + p.measure.abbreviation + ': ' + p.measure.requiredTest
                    + '", for ' + p.measureType.name + ' changed from criteria: '
                    + p.associatedCriteria.map(c => c.number + ': ' + c.title).join(', ')
                    + ' to: ' + c.associatedCriteria.map(c => c.number + ': ' + c.title).join(', '),
      };
    case 'promotingInteroperabilityUserHistory':
      return {
        sort: (p, c) => {
          if (p.userCountDate < c.userCountDate) { return -1; }
          if (p.userCountDate > c.userCountDate) { return 1; }
          return 0;
        },
        write: m => 'Promoting Interoperability Count of ' + m.userCount + ' on ' + m.userCountDate,
        compare: (p, c) => p.userCount !== c.userCount,
        change: (p, c) => 'Promoting Interoperability Count changed from ' + p.userCount + ' to ' + c.userCount + ' on ' + p.userCountDate,
      };
    case 'qmsStandards':
      return {
        sort: (p, c) => p.qmsStandardName < c.qmsStandardName ? -1 : p.qmsStandardName > c.qmsStandardName ? 1 : p.qmsModification < c.qmsModification ? -1 : p.qmsModification > c.qmsModification ? 1 : p.applicableCriteria < c.applicableCriteria ? -1 : p.applicableCriteria > c.applicableCriteria ? 1 : 0,
        write: q => 'QMS Standard "' + q.qmsStandardName + '" with modification "' + q.qmsModification + '" applicable to criteria: "' + q.applicableCriteria + '"',
      };
    case 'targetedUsers':
      return {
        sort: (p, c) => p.targetedUserName < c.targetedUserName ? -1 : p.targetedUserName > c.targetedUserName ? 1 : 0,
        write: t => 'Targeted User "' + t.targetedUserName + '"',
      };
    case 'testFunctionality':
      return {
        sort: (p, c) => p.name < c.name ? -1 : p.name > c.name ? 1 : 0,
        write: f => 'Test Functionality "' + f.name + '"',
      };
    default:
      return {
        sort: (p, c) => {
          const key = Object.keys(p).filter((k, idx, arr) => typeof arr[k] === 'string').sort((a, b) => a < b ? -1 : a > b ? 1 : 0)[0];
          return p[key] < c[key] ? -1 : p[key] > c[key] ? 1 : 0;
        },
        write: o => '<pre>' + angular.toJson(o) + '</pre>',
      };
    }
  }

  compareItem (oldData, newData, key, display, filter) {
    if (oldData && oldData[key] && newData && newData[key] && oldData[key] !== newData[key]) {
      if (filter) {
        return display + ' changed from ' + this.$filter(filter)(oldData[key],'mediumDate','UTC') + ' to ' + this.$filter(filter)(newData[key],'mediumDate','UTC');
      } else {
        return display + ' changed from ' + oldData[key] + ' to ' + newData[key];
      }
    }
    if ((!oldData || !oldData[key]) && newData && newData[key]) {
      if (filter) {
        return display + ' added: ' + this.$filter(filter)(newData[key],'mediumDate','UTC');
      } else {
        return display + ' added: ' + newData[key];
      }
    }
    if (oldData && oldData[key] && (!newData || !newData[key])) {
      if (filter) {
        return display + ' removed. Was: ' + this.$filter(filter)(oldData[key],'mediumDate','UTC');
      } else {
        return display + ' removed. Was: ' + oldData[key];
      }
    }
  }

  nestedCompare (oldData, newData, key, subkey, display, filter) {
    return this.compareItem(oldData[key], newData[key], subkey, display, filter);
  }

  compareAddress (prev, curr) {
    var simpleFields = [
      {key: 'streetLineOne', display: 'Street Line 1'},
      {key: 'streetLineTwo', display: 'Street Line 2'},
      {key: 'city', display: 'City'},
      {key: 'state', display: 'State'},
      {key: 'zipcode', display: 'Zipcode'},
      {key: 'country', display: 'Country'},
    ];
    return this.compareObject(prev, curr, simpleFields);
  }

  compareContact (prev, curr) {
    var simpleFields = [
      {key: 'fullName', display: 'Full Name'},
      {key: 'friendlyName', display: 'Friendly Name'},
      {key: 'phoneNumber', display: 'Phone Number'},
      {key: 'title', display: 'Title'},
      {key: 'email', display: 'Email'},
    ];
    return this.compareObject(prev, curr, simpleFields);
  }

  compareObject (prev, curr, fields) {
    var ret = [];
    var change;

    for (var i = 0; i < fields.length; i++) {
      change = this.compareItem(prev, curr, fields[i].key, fields[i].display, fields[i].filter);
      if (change) { ret.push('<li>' + change + '</li>'); }
    }
    return ret;
  }

  interpretNonUpdate (activity, data, text, key) {
    if (!key) { key = 'name'; }
    if (data.originalData && !data.newData) { // no new data: deleted
      activity.name = data.originalData[key];
      activity.action = ['"' + activity.name + '" has been deleted'];
    }
    if (!data.originalData && data.newData) { // no old data: created
      activity.name = data.newData[key];
      activity.action = ['"' + activity.name + '" has been created'];
    }
    if (data.originalData && data.originalData.length > 1 && data.newData) { // both exist, more than one originalData: merge
      activity.name = data.newData[key];
      activity.action = ['Merged ' + data.originalData.length + ' ' + text + 's to form ' + text + ': "' + activity.name + '"'];
    }
  }

  isValidDate (d) {
    return d instanceof Date && !isNaN(d);
  }

  coerceToMidnight (date, roundUp) {
    if (date) {
      date.setHours(0,0,0,0);
      if (roundUp) {
        date.setDate(date.getDate() + 1);
      }
      return date;
    }
  }

  validDates (startDate, endDate, range, ignoreRange) {
    if (this.isValidDate(endDate) && this.isValidDate(startDate)) {
      var utcEnd = Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );
      var utcStart = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      var diffDays = Math.floor((utcEnd - utcStart) / (1000 * 60 * 60 * 24));
      if (ignoreRange) {
        return (utcStart < utcEnd);
      }

      return (0 <= diffDays && diffDays < range);
    } else {
      return false;
    }
  }

  downloadReady (displayed) {
    return displayed.reduce((acc, activity) => activity.action && acc, true);
  }

  showLoadingBar (tableState, results, loadProgress) {
    let earlyDate = 0;
    let startDate = new Date().getTime();

    if (tableState && tableState.search && tableState.search.predicateObject && tableState.search.predicateObject.date) {
      earlyDate = tableState.search.predicateObject.date.after;
    }
    let earliestDateOfData = results
      .map(evt => evt.date)
      .reduce((acc, cur) => cur < acc ? cur : acc, startDate);
    let shouldShow = (loadProgress.total > 0) && (loadProgress.percentage < 100) && (!earlyDate || earliestDateOfData > earlyDate);
    return shouldShow;
  }
}

angular.module('chpl.reports')
  .service('ReportService', ReportService);
