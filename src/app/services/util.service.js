(() => {
  /** @ngInject */
  function utilService($log) {
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

    function sortCertActual(a, b) {
      return certificationResultSortComparator(a, b);
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

    const service = {
      arrayCompare,
      sortCertActual,
    };
    return service;
  }

  angular.module('chpl.services')
    .factory('utilService', utilService);
})();
