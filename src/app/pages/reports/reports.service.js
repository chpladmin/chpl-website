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

  coerceToMidnight (date, roundUp) {
    if (date) {
      date.setHours(0,0,0,0);
      if (roundUp) {
        date.setDate(date.getDate() + 1);
      }
      return date;
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
