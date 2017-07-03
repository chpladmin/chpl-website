(function () {
    'use strict';

    describe('chpl.common.util', function () {

        beforeEach(module('chpl.common'));

        var $log, mock, util;
        mock = {
            newValue: 'fake',
            objects: [
                {key: 'key', value: 'zeroeth'},
                {key: 'key', value: 'first'},
                {key: 'key', value: 'second'},
                {key: 'key', value: 'third'},
                {key: 'key', value: 'fourth', id: 1},
                {key: 'key', value: 'fifth', id: 1},
                {key: 'key', value: 'sixth', specialKey: 2},
                {key: 'key', value: 'seventh', specialKey: 2},
            ],
            options: [],
            secondValue: 'a second value',
        };

        beforeEach(inject(function (_$log_, _utilService_) {
            $log = _$log_;
            util = _utilService_;
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should have a function to add an option to a select', function () {
            expect(util.extendSelect).toBeDefined();
        });

        it('should update the options when a new item is changed', function () {
            var options = util.extendSelect(mock.options, mock.newValue);
            expect(options).toEqual([{name: mock.newValue}]);
        });

        it('shouldn\'t add a new object if one was already added', function () {
            var options = util.extendSelect(mock.options, mock.newValue);
            options = util.extendSelect(mock.options, mock.secondValue);
            expect(options).toEqual([{name: mock.secondValue}]);
            expect(options.length).toBe(1);
        });

        it('should get the right icon for various statuses', function () {
            expect(util.statusFont('Active')).toBe('fa-check-circle status-good');
            expect(util.statusFont('Retired')).toBe('fa-university status-neutral');
            expect(util.statusFont('Suspended by ONC')).toBe('fa-minus-square status-warning');
            expect(util.statusFont('Suspended by ONC-ACB')).toBe('fa-minus-circle status-warning');
            expect(util.statusFont('Terminated by ONC')).toBe('fa-window-close status-bad');
            expect(util.statusFont('Withdrawn by Developer Under Surveillance/Review')).toBe('fa-exclamation-circle status-bad');
            expect(util.statusFont('Withdrawn by Developer')).toBe('fa-stop-circle status-neutral');
            expect(util.statusFont('Withdrawn by ONC-ACB')).toBe('fa-times-circle status-bad');
        });

        describe('sorting', function () {

            it('should be able to sort certs', function () {
                expect(util.sortCert('170.314 (a)(1)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
                expect(util.sortCert('170.314 (a)(2)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
                expect(util.sortCert('170.314 (a)(2)')).toBeLessThan(util.sortCert('170.315 (a)(10)'));
                expect(util.sortCert('170.302 (a)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
            });

            it('should be able to sort cqms', function () {
                expect(util.sortCqm('NQF-0031')).toBeLessThan(util.sortCqm('NQF-0100'));
                expect(util.sortCqm('NQF-0031')).toBeGreaterThan(util.sortCqm('CMS107'));
                expect(util.sortCqm('CMS26')).toBeLessThan(util.sortCqm('CMS107'));
            });

            it('should be able to sort requirements', function () {
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
            });

            it('should be able to sort nonconformity types', function () {
                var criteria2014_g_4 = { name: '170.314 (g)(4)' };
                var criteria2014_g_10 = { name: '170.314 (g)(10)' };
                var criteria2015_d_1 = { name: '170.315 (d)(1)' };
                var criteria2015_e_1 = { name: '170.315 (e)(1)' };
                var criteria2015_g_4 = { name: '170.315 (g)(4)' };
                var criteria2015_g_10 = { name: '170.315 (g)(10)' };
                var transparency_k_2 = { name: '170.523 (k)(2)' };
                var other = { name: 'Other Non-Conformity' };
                expect(util.sortNonconformityTypes(criteria2014_g_4)).toBeLessThan(util.sortNonconformityTypes(criteria2014_g_10));
                expect(util.sortNonconformityTypes(criteria2014_g_10)).toBeLessThan(util.sortNonconformityTypes(criteria2015_d_1));
                expect(util.sortNonconformityTypes(criteria2015_d_1)).toBeLessThan(util.sortNonconformityTypes(criteria2015_e_1));
                expect(util.sortNonconformityTypes(criteria2015_e_1)).toBeLessThan(util.sortNonconformityTypes(criteria2015_g_4));
                expect(util.sortNonconformityTypes(criteria2015_g_4)).toBeLessThan(util.sortNonconformityTypes(criteria2015_g_10));
                expect(util.sortNonconformityTypes(criteria2015_g_10)).toBeLessThan(util.sortNonconformityTypes(transparency_k_2));
                expect(util.sortNonconformityTypes(transparency_k_2)).toBeLessThan(util.sortNonconformityTypes(other));
            });
        });

        describe('array comparison', function () {
            var ret;
            beforeEach(function () {
                ret = { added: [], edited: [], removed: [] };
            });

            it('should know if an object was added to an array', function () {
                var a = [].concat(mock.objects[1]);
                var b = [].concat(mock.objects[1],mock.objects[2]);
                ret.added.push(mock.objects[2])
                expect(util.arrayCompare(a,b)).toEqual(ret);
            });

            it('should know if an object was removed from an array', function () {
                var a = [].concat(mock.objects[1],mock.objects[0]);
                var b = [].concat(mock.objects[1]);
                ret.removed.push(mock.objects[0])
                expect(util.arrayCompare(a,b)).toEqual(ret);
            });

            it('should know if objects were added and removed from an array', function () {
                var a = [].concat(mock.objects[0],mock.objects[1]);
                var b = [].concat(mock.objects[1],mock.objects[2]);
                ret.added.push(mock.objects[2])
                ret.removed.push(mock.objects[0])
                expect(util.arrayCompare(a,b)).toEqual(ret);
            });

            it('should know if an object was changed, assuming it has an "id" value', function () {
                var a = [].concat(mock.objects[0],mock.objects[1],mock.objects[4]);
                var b = [].concat(mock.objects[0],mock.objects[1],mock.objects[5]);
                ret.edited.push({before: mock.objects[4], after: mock.objects[5]});
                expect(util.arrayCompare(a,b)).toEqual(ret);
            });

            it('should allow different key values', function () {
                var a = [].concat(mock.objects[0],mock.objects[1],mock.objects[6]);
                var b = [].concat(mock.objects[0],mock.objects[1],mock.objects[7]);
                ret.edited.push({before: mock.objects[6], after: mock.objects[7]});
                expect(util.arrayCompare(a,b,'specialKey')).toEqual(ret);
            });

            it('should handle a null before', function () {
                var a = null;
                var b = [].concat(mock.objects[0]);
                ret.added.push(mock.objects[0]);
                expect(util.arrayCompare(a,b)).toEqual(ret);
            });

            it('should handle a null after', function () {
                var a = [].concat(mock.objects[0]);
                var b = null;
                ret.removed.push(mock.objects[0]);
                expect(util.arrayCompare(a,b)).toEqual(ret);
            });
        });
    });
})();
