(() => {
  angular.module('chpl.services')
    .factory('utilService', utilService);

  /** @ngInject */
  function utilService($filter, $log, Blob, FileSaver) {
    const service = {
      addDays,
      addNewValue,
      addressRequired,
      arrayCompare,
      arrayToCsv,
      certificationStatusWhenEditing,
      extendSelect,
      findModel,
      isBlank,
      makeCsv,
      muuCount,
      passwordClass,
      passwordTitle,
      range,
      rangeCol,
      sortCert,
      sortCertActual,
      sortCertArray,
      sortCqm,
      sortCqmActual,
      sortNonconformityTypes,
      sortFunctionalitiesTested,
      statusFont,
      ternaryFilter,
    };
    return service;

    /// /////////////////////////////////////////////////////////////////

    function addDays(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    function addNewValue(array, object) {
      if (!array) {
        array = [];
      }
      if (object && !angular.equals(object, {})) {
        array.push(angular.copy(object));
      }
      return array;
    }

    function addressRequired(address) {
      if (!address) { return false; }
      if (address.line1 && address.line1.length > 0) { return true; }
      if (address.line2 && address.line2.length > 0) { return true; }
      if (address.city && address.city.length > 0) { return true; }
      if (address.state && address.state.length > 0) { return true; }
      if (address.zipcode && address.zipcode.length > 0) { return true; }
      if (address.country && address.country.length > 0) { return true; }
      return false;
    }

    function arrayCompare(before, after, key) {
      const ret = {
        added: [],
        edited: [],
        removed: [],
      };
      if (angular.isUndefined(key)) { key = 'id'; }
      let i; let
        j;
      let added; let
        removed;
      const count = Math.max(
        angular.isArray(before) ? before.length : 0,
        angular.isArray(after) ? after.length : 0,
      );

      for (i = 0; i < count; i++) {
        // check after[i] against before
        if (after && angular.isDefined(after[i])) {
          added = true;
          if (before) {
            for (j = 0; j < before.length; j++) {
              // if equal, then not added
              if (angular.equals(after[i], before[j])) { added = false; }
              // if not equal, but have equal ids, then edited
              else if (angular.isDefined(after[i][key])
                && angular.isDefined(before[j][key])
                && after[i][key] === before[j][key]) {
                added = false;
                ret.edited.push({ before: before[j], after: after[i] });
              }
            }
          }
          if (added) {
            ret.added.push(after[i]);
          }
        }
        // check before[i] against after
        if (before && angular.isDefined(before[i])) {
          removed = true;
          if (after) {
            for (j = 0; j < after.length; j++) {
              // if equal, then not added
              if (angular.equals(before[i], after[j])) { removed = false; }
              // if not equal, but have equal ids, then edited
              else if (angular.isDefined(before[i][key])
                && angular.isDefined(after[j][key])
                && before[i][key] === after[j][key]) { removed = false; }
            }
          }
          if (removed) {
            ret.removed.push(before[i]);
          }
        }
      }
      return ret;
    }

    function arrayToCsv(data) {
      return data.map((row) => row.map((cell) => {
        if (typeof (cell) === 'string'
            && (cell.indexOf('"') > -1
              || cell.indexOf(',') > -1
              || cell.indexOf('\n') > -1)) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      })
        .join(','))
        .join('\n');
    }

    function certificationStatusWhenEditing(listing) {
      if (listing.certificationEvents && listing.certificationEvents.length > 0) {
        const events = listing.certificationEvents
          .map((ce) => {
            if (ce.statusDateObject) {
              ce.eventDate = ce.statusDateObject.getTime();
            }
            return ce;
          })
          .sort((a, b) => b.eventDate - a.eventDate);
        return events[0].status.name;
      }
      return '';
    }

    function extendSelect(options, value) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].name === value) {
          return;
        }
      }
      options.push({ name: value });
    }

    function findModel(item, options, key = 'id') {
      const ret = options.filter((option) => item[key] === option[key]);
      if (ret.length === 1) {
        return ret[0];
      }
      return item;
    }

    function makeCsv(data) {
      const blob = new Blob([this.arrayToCsv(data.values)], {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(blob, data.name);
    }

    function muuCount(muuHistory) {
      return muuHistory.sort((a, b) => b.muuDate - a.muuDate)[0];
    }

    function passwordClass(strength) {
      switch (strength) {
        case 0:
          return 'danger';
        case 1:
          return 'danger';
        case 2:
          return 'warning';
        case 3:
          return 'warning';
        case 4:
          return 'success';
        default:
          return '';
      }
    }

    function passwordTitle(strength) {
      switch (strength) {
        case 0:
          return 'Awful';
        case 1:
          return 'Weak';
        case 2:
          return 'Moderate';
        case 3:
          return 'Strong';
        case 4:
          return 'Excellent';
        default:
          return '';
      }
    }

    function range(max, step) {
      step = parseInt(step, 10) || 1;
      const ret = [];
      for (let i = 0; i < max; i += step) {
        ret.push(i);
      }
      return ret;
    }

    function rangeCol(count) {
      switch (parseInt(count, 10)) {
        case 1:
          return 'col-sm-12';
        case 2:
          return 'col-sm-6';
        case 3:
          return 'col-sm-4';
        case 4:
        case 5:
          return 'col-sm-3';
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
          return 'col-sm-2';
        case 12:
          return 'col-sm-1';
        default:
          return 'col-sm-12';
      }
    }

    function sortCert(cert) {
      return certificationResultSortIndex(cert);
    }

    function sortCertActual(a, b) {
      return certificationResultSortComparator(a, b);
    }

    function sortCertArray(array) {
      let ret = Number.MIN_VALUE;
      if (array.length > 0) {
        ret = this.sortCert(array[0]);
      }
      return ret;
    }

    function sortCqm(cqm) {
      if (angular.isObject(cqm)) {
        cqm = cqm.name;
        if (cqm.substring(0, 3) !== 'CMS') {
          cqm = `NQF-${cqm}`;
        }
      }
      const edition = 1000 * cqm.indexOf('-');
      const num = parseInt(edition > 0 ? cqm.substring(4) : cqm.substring(3));
      const ret = edition + num;
      return ret;
    }

    function sortCqmActual(a, b) {
      return sortCqm(a) - sortCqm(b);
    }

    function sortNonconformityTypes(type) {
      if (type.number) {
        return sortCert(type);
      }
      return sortCert({
        ...type,
        number: type.title,
      });
    }

    function sortFunctionalitiesTested(ftA, ftB) {
      const matcher = /^\((.+?)\)/;
      let a = ftA.functionalityTested.regulatoryTextCitation;
      let b = ftB.functionalityTested.regulatoryTextCitation;
      while (a && a.length > 0 && b && b.length > 0) {
        const aVals = a.match(matcher);
        const bVals = b.match(matcher);
        if (aVals && bVals) {
          const testA = isNaN(parseInt(aVals[0], 10)) ? aVals[0] : parseInt(aVals[0], 10);
          const testB = isNaN(parseInt(bVals[0], 10)) ? bVals[0] : parseInt(bVals[0], 10);
          if (testA < testB) { return -1; }
          if (testA > testB) { return 1; }
          a = a.replace(aVals[0], '');
          b = b.replace(bVals[0], '');
        } else {
          if (aVals) { return -1; }
          if (bVals) { return 1; }
          a = a.substring(7);
          b = b.substring(7);
        }
      }
      if (a.length > 0) { return 1; }
      if (b.length > 0) { return -1; }
      return 0;
    }

    function statusFont(status) {
      let ret;
      switch (status) {
        case 'Active':
          ret = 'fa-check-circle status-good';
          break;
        case 'Retired':
          ret = 'fa-university status-neutral';
          break;
        case 'Suspended by ONC':
          ret = 'fa-minus-square status-warning';
          break;
        case 'Suspended by ONC-ACB':
          ret = 'fa-minus-circle status-warning';
          break;
        case 'Terminated by ONC':
          ret = 'fa-window-close status-bad';
          break;
        case 'Withdrawn by Developer Under Surveillance/Review':
          ret = 'fa-exclamation-circle status-bad';
          break;
        case 'Withdrawn by Developer':
          ret = 'fa-stop-circle status-neutral';
          break;
        case 'Withdrawn by ONC-ACB':
          ret = 'fa-times-circle status-bad';
          break;
        // no default
      }
      return ret;
    }

    function ternaryFilter(field) {
      if (field === null) {
        return 'N/A';
      }
      return field ? 'True' : 'False';
    }

    function isBlank(x) {
      if (typeof x === 'string' || x === undefined || x === null) {
        return !x || x.trim().length === 0;
      } if (Array.isArray(x)) {
        return !x.length;
      } if (typeof x === 'object' && x.constructor === Object) {
        return !Object.keys(x).length;
      }
      return false;
    }

    /// ////////////////////////////////////////////////

    function certificationResultSortComparator(a, b) {
      const valueToFindA = a.criterion?.number || a.number;
      const valueToFindB = b.criterion?.number || b.number;
      return certificationResultSortIndex(valueToFindA) - certificationResultSortIndex(valueToFindB);
    }

    function certificationResultSortIndex(certResult) {
      // Handle both criteria numbers, names and certificationResult objects
      const criterion = createCriterion(certResult);
      if (!criterion) {
        // Couldn't figure out what was passed in...
        return Number.MAX_VALUE;
      }

      const valueToFind = criterion.number;
      // If we don't find the item in the referece array, put it at the end
      let index = certificationResultSortOrder().findIndex((item) => item === valueToFind);
      if (index === -1) {
        index = Number.MAX_VALUE;
      }
      return index;
    }

    function createCriterion(cert) {
      if (!cert) { return; }
      if (cert.criterion) { return cert.criterion; }
      let criterion;
      if (cert.number) {
        criterion = { number: cert.number, title: cert.title };
      } else if (cert.name) {
        criterion = {
          number: cert.name.indexOf(':') > -1 ? cert.name.substring(0, cert.name.indexOf(':')) : cert.name,
          title: cert.name.indexOf(':') > -1 ? cert.name.substring(cert.name.indexOf(':') + 1) : '',
        };
      } else {
        criterion = {
          number: cert.indexOf(':') > -1 ? cert.substring(0, cert.indexOf(':')) : cert,
          title: cert.indexOf(':') > -1 ? cert.substring(cert.indexOf(':') + 1) : '',
        };
      }
      return criterion;
    }

    function certificationResultSortOrder() {
      return ['170.302 (a)',
        '170.302 (b)',
        '170.302 (c)',
        '170.302 (d)',
        '170.302 (e)',
        '170.302 (f)(1)',
        '170.302 (f)(2)',
        '170.302 (f)(3)',
        '170.302 (g)',
        '170.302 (h)',
        '170.302 (i)',
        '170.302 (j)',
        '170.302 (k)',
        '170.302 (l)',
        '170.302 (m)',
        '170.302 (n)',
        '170.302 (o)',
        '170.302 (p)',
        '170.302 (q)',
        '170.302 (r)',
        '170.302 (s)',
        '170.302 (t)',
        '170.302 (u)',
        '170.302 (v)',
        '170.302 (w)',
        '170.304 (a)',
        '170.304 (b)',
        '170.304 (c)',
        '170.304 (d)',
        '170.304 (e)',
        '170.304 (f)',
        '170.304 (g)',
        '170.304 (h)',
        '170.304 (i)',
        '170.304 (j)',
        '170.306 (a)',
        '170.306 (b)',
        '170.306 (c)',
        '170.306 (d)(1)',
        '170.306 (d)(2)',
        '170.306 (e)',
        '170.306 (f)',
        '170.306 (g)',
        '170.306 (h)',
        '170.306 (i)',
        '170.314 (a)(1)',
        '170.314 (a)(2)',
        '170.314 (a)(3)',
        '170.314 (a)(4)',
        '170.314 (a)(5)',
        '170.314 (a)(6)',
        '170.314 (a)(7)',
        '170.314 (a)(8)',
        '170.314 (a)(9)',
        '170.314 (a)(10)',
        '170.314 (a)(11)',
        '170.314 (a)(12)',
        '170.314 (a)(13)',
        '170.314 (a)(14)',
        '170.314 (a)(15)',
        '170.314 (a)(16)',
        '170.314 (a)(17)',
        '170.314 (a)(18)',
        '170.314 (a)(19)',
        '170.314 (a)(20)',
        '170.314 (b)(1)',
        '170.314 (b)(2)',
        '170.314 (b)(3)',
        '170.314 (b)(4)',
        '170.314 (b)(5)(A)',
        '170.314 (b)(5)(B)',
        '170.314 (b)(6)',
        '170.314 (b)(7)',
        '170.314 (b)(8)',
        '170.314 (b)(9)',
        '170.314 (c)(1)',
        '170.314 (c)(2)',
        '170.314 (c)(3)',
        '170.314 (d)(1)',
        '170.314 (d)(2)',
        '170.314 (d)(3)',
        '170.314 (d)(4)',
        '170.314 (d)(5)',
        '170.314 (d)(6)',
        '170.314 (d)(7)',
        '170.314 (d)(8)',
        '170.314 (d)(9)',
        '170.314 (e)(1)',
        '170.314 (e)(2)',
        '170.314 (e)(3)',
        '170.314 (f)(1)',
        '170.314 (f)(2)',
        '170.314 (f)(3)',
        '170.314 (f)(4)',
        '170.314 (f)(5)',
        '170.314 (f)(6)',
        '170.314 (f)(7)',
        '170.314 (g)(1)',
        '170.314 (g)(2)',
        '170.314 (g)(3)',
        '170.314 (g)(4)',
        '170.314 (h)(1)',
        '170.314 (h)(2)',
        '170.314 (h)(3)',
        '170.315 (a)(1)',
        '170.315 (a)(2)',
        '170.315 (a)(3)',
        '170.315 (a)(4)',
        '170.315 (a)(5)',
        '170.315 (a)(6)',
        'Removed | 170.315 (a)(6)',
        '170.315 (a)(7)',
        'Removed | 170.315 (a)(7)',
        '170.315 (a)(8)',
        'Removed | 170.315 (a)(8)',
        '170.315 (a)(9)',
        '170.315 (a)(10)',
        '170.315 (a)(11)',
        'Removed | 170.315 (a)(11)',
        '170.315 (a)(12)',
        '170.315 (a)(13)',
        '170.315 (a)(14)',
        '170.315 (a)(15)',
        '170.315 (b)(1)',
        '170.315 (b)(2)',
        '170.315 (b)(3)',
        '170.315 (b)(4)',
        'Removed | 170.315 (b)(4)',
        '170.315 (b)(5)',
        'Removed | 170.315 (b)(5)',
        '170.315 (b)(6)',
        '170.315 (b)(7)',
        '170.315 (b)(8)',
        '170.315 (b)(9)',
        '170.315 (b)(11)',
        '170.315 (c)(1)',
        '170.315 (c)(2)',
        '170.315 (c)(3)',
        '170.315 (c)(4)',
        '170.315 (d)(1)',
        '170.315 (d)(2)',
        '170.315 (d)(3)',
        '170.315 (d)(4)',
        '170.315 (d)(5)',
        '170.315 (d)(6)',
        '170.315 (d)(7)',
        '170.315 (d)(8)',
        '170.315 (d)(9)',
        '170.315 (d)(10)',
        '170.315 (d)(11)',
        '170.315 (e)(1)',
        '170.315 (e)(2)',
        '170.315 (e)(3)',
        '170.315 (f)(1)',
        '170.315 (f)(2)',
        '170.315 (f)(3)',
        '170.315 (f)(4)',
        '170.315 (f)(5)',
        '170.315 (f)(6)',
        '170.315 (f)(7)',
        '170.315 (g)(1)',
        '170.315 (g)(2)',
        '170.315 (g)(3)',
        '170.315 (g)(4)',
        '170.315 (g)(5)',
        '170.315 (g)(6)',
        '170.315 (g)(7)',
        '170.315 (g)(8)',
        '170.315 (g)(9)',
        '170.315 (h)(1)',
        '170.315 (h)(2)',
        '170.523 (k)(1)',
        '170.523 (k)(2)',
        '170.523 (l)',
        'Annual Real World Testing Plan',
        'Annual Real World Testing Results Reports',
        'Semiannual Attestations Submission',
        'Other Non-Conformity',
      ];
    }
  }
})();
