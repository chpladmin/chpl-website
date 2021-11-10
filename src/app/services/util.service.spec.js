(() => {
  'use strict';

  describe('the Utility service', () => {
    var $log, FileSaver, mock, util;

    mock = {
      objects: [
        { key: 'key', value: 'zeroeth' },
        { key: 'key', value: 'first' },
        { key: 'key', value: 'second' },
        { key: 'key', value: 'third' },
        { key: 'key', value: 'fourth', id: 1 },
        { key: 'key', value: 'fifth', id: 1 },
        { key: 'key', value: 'sixth', specialKey: 2 },
        { key: 'key', value: 'seventh', specialKey: 2 },
      ],
    };

    beforeEach(() => {
      angular.mock.module('chpl.services', $provide => {
        $provide.decorator('FileSaver', $delegate => {
          $delegate.saveAs = jasmine.createSpy('saveAs');
          return $delegate;
        });
      });

      inject((_$log_, _FileSaver_, _utilService_) => {
        $log = _$log_;
        FileSaver = _FileSaver_;
        FileSaver.saveAs.and.returnValue();
        util = _utilService_;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    it('should get the right icon for various statuses', () => {
      expect(util.statusFont('Active')).toBe('fa-check-circle status-good');
      expect(util.statusFont('Retired')).toBe('fa-university status-neutral');
      expect(util.statusFont('Suspended by ONC')).toBe('fa-minus-square status-warning');
      expect(util.statusFont('Suspended by ONC-ACB')).toBe('fa-minus-circle status-warning');
      expect(util.statusFont('Terminated by ONC')).toBe('fa-window-close status-bad');
      expect(util.statusFont('Withdrawn by Developer Under Surveillance/Review')).toBe('fa-exclamation-circle status-bad');
      expect(util.statusFont('Withdrawn by Developer')).toBe('fa-stop-circle status-neutral');
      expect(util.statusFont('Withdrawn by ONC-ACB')).toBe('fa-times-circle status-bad');
    });

    describe('when extending a select element using just a name', () => {
      it('should be able to add an option to a select', () => {
        expect(util.extendSelect).toBeDefined();
      });

      it('should update the options when a new item is added', () => {
        var options = [];
        util.extendSelect(options, 'fake');
        expect(options).toEqual([{ name: 'fake' }]);
      });

      it('shouldn\'t add a new object if the name is a duplicate', () => {
        var options = [];
        util.extendSelect(options, 'name1');
        util.extendSelect(options, 'name2');
        util.extendSelect(options, 'name1');
        expect(options.length).toBe(2);
      });
    });

    describe('when adding a value to an array', () => {
      it('should create the array if necessary', () => {
        var array, object;
        object = { id: 1 };
        array = util.addNewValue(array, object);
        expect(array).toEqual([object]);
      });

      it('should not add an undefined or empty object', () => {
        var array, object;
        array = [];
        array = util.addNewValue(array, object);
        expect(array).toEqual([]);
        object = {};
        array = util.addNewValue(array, object);
        expect(array).toEqual([]);
      });
    });

    describe('when connecting to a model', () => {
      it('should match to a model', () => {
        var id = { id: 2 };
        var array = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }];
        expect(id).not.toBe(array[1]);
        id = util.findModel(id, array);
        expect(id).toBe(array[1]);
      });

      it('should match with an optional key', () => {
        var id = { name: 'name2' };
        var array = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }];
        expect(id).not.toBe(array[1]);
        id = util.findModel(id, array, 'name');
        expect(id).toBe(array[1]);
      });
    });

    describe('when sorting', () => {
      describe('certification criteria', () => {
        it('should be able to sort strings', () => {
          expect(util.sortCert('170.314 (a)(1)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
          expect(util.sortCert('170.314 (a)(2)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
          expect(util.sortCert('170.314 (a)(2)')).toBeLessThan(util.sortCert('170.315 (a)(10)'));
          expect(util.sortCert('170.302 (a)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
        });

        it('should be able to sort objects by name', () => {
          expect(util.sortCert({ name: '170.314 (a)(2)' })).toBeLessThan(util.sortCert({ name: '170.314 (a)(10)' }));
        });

        it('should be able to sort objects by number', () => {
          expect(util.sortCert({ number: '170.314 (a)(2)' })).toBeLessThan(util.sortCert({ number: '170.314 (a)(10)' }));
        });

        it('should sort objects that are Cures Update before the original criteria', () => {
          let a = '170.315 (b)(2): A title';
          let b = '170.315 (b)(2): A title (Cures Update)';
          expect(util.sortCert(b)).toBeLessThan(util.sortCert(a));
        });

        it('should sort objects that are Cures Update before the original criteria', () => {
          let a = {
            number: '170.315 (b)(2)',
            title: 'A title',
          };
          let b = {
            number: '170.315 (b)(2)',
            title: 'A title (Cures Update)',
          };
          expect(util.sortCert(b)).toBeLessThan(util.sortCert(a));
        });
      });

      it('should be able to sort cqms', () => {
        expect(util.sortCqm('NQF-0031')).toBeLessThan(util.sortCqm('NQF-0100'));
        expect(util.sortCqm('NQF-0031')).toBeGreaterThan(util.sortCqm('CMS107'));
        expect(util.sortCqm('CMS26')).toBeLessThan(util.sortCqm('CMS107'));
      });

      it('should be able to sort requirements', () => {
        var criteria2014 = {
          requirement: '170.314 (g)(4)',
          type: { id: 1, name: 'Certified Capability' },
        };
        var criteria2014_2 = {
          requirement: '170.314 (g)(10)',
          type: { id: 1, name: 'Certified Capability' },
        };
        var criteria2015_d_1 = {
          requirement: '170.315 (d)(1)',
          type: { id: 1, name: 'Certified Capability' },
        };
        var criteria2015_e_1 = {
          requirement: '170.315 (e)(1)',
          type: { id: 1, name: 'Certified Capability' },
        };
        var criteria2015_g_4 = {
          requirement: '170.315 (g)(4)',
          type: { id: 1, name: 'Certified Capability' },
        };
        var criteria2015_g_10 = {
          requirement: '170.315 (g)(10)',
          type: { id: 1, name: 'Certified Capability' },
        };
        var transparency_requirement = {
          requirement: '170.523 (k)(2)',
          type: { id: 2, name: 'Transparency or Disclosure Requirement' },
        };
        var other_requirement = {
          requirement: 'fake requirement',
          type: { id: 3, name: 'Other Requirement' },
        };
        expect(util.sortRequirements(criteria2014)).toBeLessThan(util.sortRequirements(criteria2014_2));
        expect(util.sortRequirements(criteria2014_2)).toBeLessThan(util.sortRequirements(criteria2015_d_1));
        expect(util.sortRequirements(criteria2015_d_1)).toBeLessThan(util.sortRequirements(criteria2015_e_1));
        expect(util.sortRequirements(criteria2015_e_1)).toBeLessThan(util.sortRequirements(criteria2015_g_4));
        expect(util.sortRequirements(criteria2015_g_4)).toBeLessThan(util.sortRequirements(criteria2015_g_10));
        expect(util.sortRequirements(criteria2015_g_10)).toBeLessThan(util.sortRequirements(transparency_requirement));
        expect(util.sortRequirements(transparency_requirement)).toBeLessThan(util.sortRequirements(other_requirement));
        expect(util.sortRequirements('170.302 (a)')).toBeLessThan(util.sortRequirements(criteria2014));
      });

      it('should be able to sort nonconformity types', () => {
        var criteria2014_a_4 = { number: '170.314 (a)(4)' };
        var criteria2014_a_10 = { number: '170.314 (a)(10)' };
        var criteria2015_d_1 = { number: '170.315 (d)(1)' };
        var criteria2015_e_1 = { number: '170.315 (e)(1)' };
        var criteria2015_g_4 = { number: '170.315 (g)(4)' };
        var criteria2015_g_10 = { number: '170.315 (g)(10)' };
        var transparency_k_2 = { number: '170.523 (k)(2)' };
        var other = { number: 'Other Non-Conformity' };
        expect(util.sortNonconformityTypes(criteria2014_a_4)).toBeLessThan(util.sortNonconformityTypes(criteria2014_a_10));
        expect(util.sortNonconformityTypes(criteria2014_a_10)).toBeLessThan(util.sortNonconformityTypes(criteria2015_d_1));
        expect(util.sortNonconformityTypes(criteria2015_d_1)).toBeLessThan(util.sortNonconformityTypes(criteria2015_e_1));
        expect(util.sortNonconformityTypes(criteria2015_e_1)).toBeLessThan(util.sortNonconformityTypes(criteria2015_g_4));
        expect(util.sortNonconformityTypes(criteria2015_g_4)).toBeLessThan(util.sortNonconformityTypes(criteria2015_g_10));
        expect(util.sortNonconformityTypes(criteria2015_g_10)).toBeLessThan(util.sortNonconformityTypes(transparency_k_2));
        expect(util.sortNonconformityTypes(transparency_k_2)).toBeLessThan(util.sortNonconformityTypes(other));
      });

      it('should be able to order arrays of arrays of certs by the first cert', () => {
        expect(util.sortCertArray([])).toBeLessThan(util.sortCertArray(['170.314 (a)(10)']));
        expect(util.sortCertArray(['170.314 (a)(2)'])).toBeLessThan(util.sortCertArray(['170.314 (a)(10)']));
      });

      xit('should farm out sorting', () => {
        spyOn(util, 'sortCert').and.callFake(a => a);
        expect(util.sortCertActual(1, 2)).toBeLessThan(0);
        expect(util.sortCert.calls.count()).toBe(2);
        expect(util.sortCertActual(2, 1)).toBeGreaterThan(0);
        expect(util.sortCert.calls.count()).toBe(4);
      });

      xit('should farm out sorting', () => {
        spyOn(util, 'sortCqm').and.callFake(a => a);
        expect(util.sortCqmActual(1, 2)).toBeLessThan(0);
        expect(util.sortCqm.calls.count()).toBe(2);
        expect(util.sortCqmActual(2, 1)).toBeGreaterThan(0);
        expect(util.sortCqm.calls.count()).toBe(4);
      });

      describe('test functionality', () => {
        let b5 = { name: '(b)(3)(ii)(B)(5)' };
        let b8 = { name: '(b)(3)(ii)(B)(8)' };
        let d = { name: '(b)(3)(ii)(D)' };
        let other = { name: '170.102(13)(ii)(C)' };
        let other2 = { name: '170.102(19)(ii)' };

        it('should sort b5 before b8', () => {
          expect(util.sortTestFunctionality(b5, b8)).toBeLessThan(0);
          expect(util.sortTestFunctionality(b8, b5)).toBeGreaterThan(0);
        });

        it('should sort b5 before d', () => {
          expect(util.sortTestFunctionality(b5, d)).toBeLessThan(0);
          expect(util.sortTestFunctionality(d, b5)).toBeGreaterThan(0);
        });

        it('should sort b8 before d', () => {
          expect(util.sortTestFunctionality(b8, d)).toBeLessThan(0);
          expect(util.sortTestFunctionality(d, b8)).toBeGreaterThan(0);
        });

        it('shouldn\'t sort identical values', () => {
          expect(util.sortTestFunctionality(b8, b8)).toBe(0);
        });

        it('should sort other last', () => {
          expect(util.sortTestFunctionality(b8, other)).toBeLessThan(0);
          expect(util.sortTestFunctionality(other, b8)).toBeGreaterThan(0);
        });

        it('should sort others', () => {
          expect(util.sortTestFunctionality(other, other2)).toBeLessThan(0);
          expect(util.sortTestFunctionality(other2, other)).toBeGreaterThan(0);
        });

        describe('mass sort', () => {
          let raw = [
            { name: '170.102(19)(ii)' },
            { name: '(b)(1)(iii)(G)(1)(ii)' },
            { name: '170.102(13)(ii)(C)' },
            { name: '(b)(1)(ii)(A)(5)(i)' },
            { name: '170.102(19)(i)' },
            { name: '(b)(1)(ii)(A)(5)(ii)' },
            { name: '(b)(1)(iii)(F)' },
            { name: '(b)(1)(iii)(E)' },
          ];

          it('should sort real data', () => {
            let sorted = raw.sort(util.sortTestFunctionality);
            expect(sorted[0].name).toBe('(b)(1)(ii)(A)(5)(i)');
            expect(sorted[7].name).toBe('170.102(19)(ii)');
          });
        });
      });
    });

    describe('when comparing arrays', () => {
      var ret;
      beforeEach(() => {
        ret = { added: [], edited: [], removed: [] };
      });

      it('should know if an object was added to an array', () => {
        var a = [].concat(mock.objects[1]);
        var b = [].concat(mock.objects[1], mock.objects[2]);
        ret.added.push(mock.objects[2]);
        expect(util.arrayCompare(a, b)).toEqual(ret);
      });

      it('should know if an object was removed from an array', () => {
        var a = [].concat(mock.objects[1], mock.objects[0]);
        var b = [].concat(mock.objects[1]);
        ret.removed.push(mock.objects[0]);
        expect(util.arrayCompare(a, b)).toEqual(ret);
      });

      it('should know if objects were added and removed from an array', () => {
        var a = [].concat(mock.objects[0], mock.objects[1]);
        var b = [].concat(mock.objects[1], mock.objects[2]);
        ret.added.push(mock.objects[2]);
        ret.removed.push(mock.objects[0]);
        expect(util.arrayCompare(a, b)).toEqual(ret);
      });

      it('should know if an object was changed, assuming it has an "id" value', () => {
        var a = [].concat(mock.objects[0], mock.objects[1], mock.objects[4]);
        var b = [].concat(mock.objects[0], mock.objects[1], mock.objects[5]);
        ret.edited.push({ before: mock.objects[4], after: mock.objects[5] });
        expect(util.arrayCompare(a, b)).toEqual(ret);
      });

      it('should allow different key values', () => {
        var a = [].concat(mock.objects[0], mock.objects[1], mock.objects[6]);
        var b = [].concat(mock.objects[0], mock.objects[1], mock.objects[7]);
        ret.edited.push({ before: mock.objects[6], after: mock.objects[7] });
        expect(util.arrayCompare(a, b, 'specialKey')).toEqual(ret);
      });

      it('should handle a null before', () => {
        var a = null;
        var b = [].concat(mock.objects[0]);
        ret.added.push(mock.objects[0]);
        expect(util.arrayCompare(a, b)).toEqual(ret);
      });

      it('should handle a null after', () => {
        var a = [].concat(mock.objects[0]);
        var b = null;
        ret.removed.push(mock.objects[0]);
        expect(util.arrayCompare(a, b)).toEqual(ret);
      });
    });

    describe('when converting an array to CSV', () => {
      var data;

      beforeEach(() => {
        data = {
          name: 'filename',
          values: [
            ['header 1', 'header 2', 'header 3', 'header 4'],
            ['String with "quotes"', 'String with ,commas,', 'String with "both,omg"', 'String with\nnewline'],
          ],
        };
      });

      it('should convert arrays', () => {
        expect(util.arrayToCsv(data.values)).toEqual('header 1,header 2,header 3,header 4\n"String with ""quotes""","String with ,commas,","String with ""both,omg""","String with\nnewline"');
      });

      it('should call the FileSaver to output', () => {
        util.makeCsv(data);
        expect(FileSaver.saveAs).toHaveBeenCalledWith(jasmine.any(Object), 'filename');
      });

      it('should handle null and undefined cells to blank strings', () => {
        data.values[1][0] = null;
        data.values[1][1] = undefined;
        expect(util.arrayToCsv(data.values)).toEqual('header 1,header 2,header 3,header 4\n,,"String with ""both,omg""","String with\nnewline"');
      });

      it('should handle raw numbers', () => {
        data.values[1] = [1, 2, 3, 4];
        expect(util.arrayToCsv(data.values)).toEqual('header 1,header 2,header 3,header 4\n1,2,3,4');
      });
    });

    describe('when determining if an address is required', () => {
      var address;
      it('should not be required if there is no data', () => {
        address = {};
        expect(util.addressRequired(address)).toBe(false);
        expect(util.addressRequired()).toBe(false);
      });

      it('should be required if there are any fields that have data', () => {
        address = {
          line1: undefined,
          line2: undefined,
          city: undefined,
          state: undefined,
          zipcode: undefined,
          country: undefined,
        };
        expect(util.addressRequired(address)).toBe(false);
        address.country = '';
        expect(util.addressRequired(address)).toBe(false);
        address.country = 'USA';
        expect(util.addressRequired(address)).toBe(true);
        address.country = undefined;

        address.zipcode = '';
        expect(util.addressRequired(address)).toBe(false);
        address.zipcode = 'USA';
        expect(util.addressRequired(address)).toBe(true);
        address.zipcode = undefined;

        address.state = '';
        expect(util.addressRequired(address)).toBe(false);
        address.state = 'USA';
        expect(util.addressRequired(address)).toBe(true);
        address.state = undefined;

        address.city = '';
        expect(util.addressRequired(address)).toBe(false);
        address.city = 'USA';
        expect(util.addressRequired(address)).toBe(true);
        address.city = undefined;

        address.line2 = '';
        expect(util.addressRequired(address)).toBe(false);
        address.line2 = 'USA';
        expect(util.addressRequired(address)).toBe(true);
        address.line2 = undefined;

        address.line1 = '';
        expect(util.addressRequired(address)).toBe(false);
        address.line1 = 'USA';
        expect(util.addressRequired(address)).toBe(true);
        address.line1 = undefined;
      });
    });

    describe('when deriving the current certification status during editing', () => {
      it('should return "" if the field is null/undefined/missing', () => {
        var cp = {};
        expect(util.certificationStatusWhenEditing(cp)).toBe('');
        cp.certificationEvents = undefined;
        expect(util.certificationStatusWhenEditing(cp)).toBe('');
        cp.certificationEvents = [];
        expect(util.certificationStatusWhenEditing(cp)).toBe('');
      });

      it('should use the most recent status as "current"', () => {
        var cp = {
          certificationEvents: [
            { status: { name: 'Active' }, statusDateObject: new Date('1/1/2018') },
            { status: { name: 'Inactive' }, statusDateObject: new Date('2/2/2018') },
            { status: { name: 'Closed' }, statusDateObject: new Date('3/3/2018') },
          ],
        };
        expect(util.certificationStatusWhenEditing(cp)).toBe('Closed');
        cp.certificationEvents[0].statusDateObject = new Date('4/4/2018');
        expect(util.certificationStatusWhenEditing(cp)).toBe('Active');
      });
    });

    describe('when dealing with booleans', () => {
      it('should return "N/A" if null', () => {
        expect(util.ternaryFilter(null)).toBe('N/A');
      });

      it('should return "True" if true', () => {
        expect(util.ternaryFilter(true)).toBe('True');
      });

      it('should return "False" if false', () => {
        expect(util.ternaryFilter(false)).toBe('False');
      });
    });

    describe('when dealing with password strength', () => {
      it('should know what the class should be', () => {
        expect(util.passwordClass(-1)).toBe('');
        expect(util.passwordClass(0)).toBe('danger');
        expect(util.passwordClass(1)).toBe('danger');
        expect(util.passwordClass(2)).toBe('warning');
        expect(util.passwordClass(3)).toBe('warning');
        expect(util.passwordClass(4)).toBe('success');
      });

      it('should know what the title should be', () => {
        expect(util.passwordTitle(-1)).toBe('');
        expect(util.passwordTitle(0)).toBe('Awful');
        expect(util.passwordTitle(1)).toBe('Weak');
        expect(util.passwordTitle(2)).toBe('Moderate');
        expect(util.passwordTitle(3)).toBe('Strong');
        expect(util.passwordTitle(4)).toBe('Excellent');
      });
    });

    describe('when dealing with muu', () => {
      it('should know what the most current value is', () => {
        const meaningfulUseUserHistory = [
          { id: 1, muuCount: 4, muuDate: 100 },
          { id: 3, muuCount: 23, muuDate: 300 },
          { id: 2, muuCount: 2, muuDate: 200 },
        ];
        expect(util.muuCount(angular.copy(meaningfulUseUserHistory))).toEqual(meaningfulUseUserHistory[1]);
      });
    });

    describe('when getting ranges', () => {
      it('should get every one if no step specified', () => {
        expect(util.range(6)).toEqual([0, 1, 2, 3, 4, 5]);
      });

      it('should get every other one if stepped by 2', () => {
        expect(util.range(6, '2')).toEqual([0, 2, 4]);
      });

      it('should handle col count for 1 column', () => {
        expect(util.rangeCol(1)).toBe('col-sm-12');
      });

      it('should handle col count for 2 column2', () => {
        expect(util.rangeCol(2)).toBe('col-sm-6');
      });

      it('should handle col count for 3 columns', () => {
        expect(util.rangeCol('3')).toBe('col-sm-4');
      });

      it('should handle default columns', () => {
        expect(util.rangeCol(undefined)).toBe('col-sm-12');
      });
    });

    describe('when providing', () => {
      const shouldReturnTrue = 'should return true';
      const shouldReturnFalse = 'should return false';

      describe('a string', () => {
        it('which has no characters ' + shouldReturnTrue, () => {
          let emptyString = '';
          let isBlank = util.isBlank(emptyString);
          expect(isBlank).toBe(true);
        });

        it('which has whitespace character only ' + shouldReturnTrue, () => {
          let stringWithOneWhiteSpaceCharacterOnly = ' ';
          let isBlank = util.isBlank(stringWithOneWhiteSpaceCharacterOnly);
          expect(isBlank).toBe(true);
        });

        it('which has two whitespace characters ' + shouldReturnTrue, () => {
          let stringWithTwoWhiteSpaceCharacters = '  ';
          let isBlank = util.isBlank(stringWithTwoWhiteSpaceCharacters);
          expect(isBlank).toBe(true);
        });

        it('which has at least some characters other than whitespace ' + shouldReturnFalse, () => {
          let stringWithData = 'some data!';
          let isBlank = util.isBlank(stringWithData);
          expect(isBlank).toBe(false);
        });
      });

      describe('a variable', () => {
        it('which is null ' + shouldReturnTrue, () => {
          let nullVariable = null;
          let isBlank = util.isBlank(nullVariable);
          expect(isBlank).toBe(true);
        });

        it('which is undefined ' + shouldReturnTrue, () => {
          let undefinedVariable;
          let isBlank = util.isBlank(undefinedVariable);
          expect(isBlank).toBe(true);
        });
      });

      describe('an empty', () => {
        it('array ' + shouldReturnTrue, () => {
          let emptyArray = [];
          let isBlank = util.isBlank(emptyArray);
          expect(isBlank).toBe(true);
        });

        it('object ' + shouldReturnTrue, () => {
          let emptyObject = {};
          let isBlank = util.isBlank(emptyObject);
          expect(isBlank).toBe(true);
        });
      });

      describe('a populated', () => {
        it('array ' + shouldReturnFalse, () => {
          let populatedArray = [5, 6, 7];
          let isBlank = util.isBlank(populatedArray);
          expect(isBlank).toBe(false);
        });

        it('object ' + shouldReturnFalse, () => {
          let populatedObject = { id: 10 };
          let isBlank = util.isBlank(populatedObject);
          expect(isBlank).toBe(false);
        });
      });
    });

    describe('when examining a criterion', () => {
      it('should know if it counts as cures based on title', () => {
        let criterion = {
          number: '170.315 (d)(2)',
          title: 'A Cures Criteria (Cures Update)',
        };
        expect(util.isCures(criterion)).toBe(true);
      });

      it('should know if it counts as cures based on number', () => {
        let criterion = {
          number: '170.315 (b)(10)',
          title: 'a cures criteria',
        };
        expect(util.isCures(criterion)).toBe(true);
        criterion.number = '170.315 (d)(12)';
        expect(util.isCures(criterion)).toBe(true);
        criterion.number = '170.315 (d)(13)';
        expect(util.isCures(criterion)).toBe(true);
        criterion.number = '170.315 (g)(10)';
        expect(util.isCures(criterion)).toBe(true);
      });

      it('should know if it doesn\'t count as cures', () => {
        let criterion = {
          number: '170.315 (d)(2)',
          title: 'not cures',
        };
        expect(util.isCures(criterion)).toBe(false);
      });
    });
  });
})();
