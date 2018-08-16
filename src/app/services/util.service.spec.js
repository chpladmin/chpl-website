(function () {
    'use strict';

    describe('the Utility service', function () {
        var $log, FileSaver, mock, util;

        mock = {
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
        };

        beforeEach(function () {
            module('chpl.services', function ($provide) {
                $provide.decorator('FileSaver', function ($delegate) {
                    $delegate.saveAs = jasmine.createSpy('saveAs');
                    return $delegate;
                });
            });

            inject(function (_$log_, _FileSaver_, _utilService_) {
                $log = _$log_;
                FileSaver = _FileSaver_;
                FileSaver.saveAs.and.returnValue();
                util = _utilService_;
            })
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
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

        describe('when extending a select element using just a name', function () {
            it('should be able to add an option to a select', function () {
                expect(util.extendSelect).toBeDefined();
            });

            it('should update the options when a new item is added', function () {
                var options = [];
                util.extendSelect(options, 'fake');
                expect(options).toEqual([{name: 'fake'}]);
            });

            it('shouldn\'t add a new object if the name is a duplicate', function () {
                var options = [];
                util.extendSelect(options, 'name1');
                util.extendSelect(options, 'name2');
                util.extendSelect(options, 'name1');
                expect(options.length).toBe(2);
            });
        });

        describe('when adding a value to an array', function () {
            it('should create the array if necessary', function () {
                var array, object;
                object = {id: 1};
                array = util.addNewValue(array, object);
                expect(array).toEqual([object]);
            });

            it('should not add an undefined or empty object', function () {
                var array, object;
                array = [];
                array = util.addNewValue(array, object);
                expect(array).toEqual([]);
                object = {};
                array = util.addNewValue(array, object);
                expect(array).toEqual([]);
            });
        });

        describe('when connecting to a model', function () {
            it('should match to a model', function () {
                var id = {id: 2};
                var array = [{id: 1, name: 'name1'}, {id: 2, name: 'name2'}];
                expect(id).not.toBe(array[1]);
                id = util.findModel(id, array);
                expect(id).toBe(array[1]);
            });

            it('should match with an optional key', function () {
                var id = {name: 'name2'};
                var array = [{id: 1, name: 'name1'}, {id: 2, name: 'name2'}];
                expect(id).not.toBe(array[1]);
                id = util.findModel(id, array, 'name');
                expect(id).toBe(array[1]);
            });
        });

        describe('when sorting', function () {

            it('should be able to sort certs', function () {
                expect(util.sortCert('170.314 (a)(1)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
                expect(util.sortCert('170.314 (a)(2)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
                expect(util.sortCert('170.314 (a)(2)')).toBeLessThan(util.sortCert('170.315 (a)(10)'));
                expect(util.sortCert('170.302 (a)')).toBeLessThan(util.sortCert('170.314 (a)(10)'));
            });

            it('should be able to sort cert objects by name', function () {
                expect(util.sortCert({name: '170.314 (a)(2)'})).toBeLessThan(util.sortCert({name: '170.314 (a)(10)'}));
            });

            it('should be able to sort cert objects by number', function () {
                expect(util.sortCert({number: '170.314 (a)(2)'})).toBeLessThan(util.sortCert({number: '170.314 (a)(10)'}));
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
                expect(util.sortRequirements('170.302 (a)')).toBeLessThan(util.sortRequirements(criteria2014));
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

            it('should be able to sort nonconformity types', function () {
                var criteria2014_g_4 = '170.314 (g)(4)';
                var criteria2014_g_10 = '170.314 (g)(10)';
                var criteria2015_d_1 = '170.315 (d)(1)';
                var criteria2015_e_1 = '170.315 (e)(1)';
                var criteria2015_g_4 = '170.315 (g)(4)';
                var criteria2015_g_10 = '170.315 (g)(10)';
                var transparency_k_2 = '170.523 (k)(2)';
                var other = 'Other Non-Conformity';
                expect(util.sortOtherNonconformityTypes(criteria2014_g_4)).toBeLessThan(util.sortOtherNonconformityTypes(criteria2014_g_10));
                expect(util.sortOtherNonconformityTypes(criteria2014_g_10)).toBeLessThan(util.sortOtherNonconformityTypes(criteria2015_d_1));
                expect(util.sortOtherNonconformityTypes(criteria2015_d_1)).toBeLessThan(util.sortOtherNonconformityTypes(criteria2015_e_1));
                expect(util.sortOtherNonconformityTypes(criteria2015_e_1)).toBeLessThan(util.sortOtherNonconformityTypes(criteria2015_g_4));
                expect(util.sortOtherNonconformityTypes(criteria2015_g_4)).toBeLessThan(util.sortOtherNonconformityTypes(criteria2015_g_10));
                expect(util.sortOtherNonconformityTypes(criteria2015_g_10)).toBeLessThan(util.sortOtherNonconformityTypes(transparency_k_2));
                expect(util.sortOtherNonconformityTypes(transparency_k_2)).toBeLessThan(util.sortOtherNonconformityTypes(other));
            });

            it('should be able to order arrays of arrays of certs by the first cert', function () {
                expect(util.sortCertArray([])).toBeLessThan(util.sortCertArray(['170.314 (a)(10)']));
                expect(util.sortCertArray(['170.314 (a)(2)'])).toBeLessThan(util.sortCertArray(['170.314 (a)(10)']));
            });
        });

        describe('when comparing arrays', function () {
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

        describe('when converting an array to CSV', function () {
            var data;

            beforeEach(function () {
                data = {
                    name: 'filename',
                    values: [
                        ['header 1', 'header 2', 'header 3', 'header 4'],
                        ['String with "quotes"', 'String with ,commas,', 'String with "both,omg"', 'String with\nnewline'],
                    ],
                };
            });

            it('should convert arrays', function () {
                expect(util.arrayToCsv(data.values)).toEqual('header 1,header 2,header 3,header 4\n"String with ""quotes""","String with ,commas,","String with ""both,omg""","String with\nnewline"');
            });

            it('should call the FileSaver to output', function () {
                util.makeCsv(data);
                expect(FileSaver.saveAs).toHaveBeenCalledWith(jasmine.any(Object), 'filename');
            });

            it('should handle null and undefined cells to blank strings', function () {
                data.values[1][0] = null;
                data.values[1][1] = undefined;
                expect(util.arrayToCsv(data.values)).toEqual('header 1,header 2,header 3,header 4\n,,"String with ""both,omg""","String with\nnewline"');
            });

            it('should handle raw numbers', function () {
                data.values[1] = [1,2,3,4];
                expect(util.arrayToCsv(data.values)).toEqual('header 1,header 2,header 3,header 4\n1,2,3,4');
            });
        });

        describe('when determining if an address is required', function () {
            var address;
            it('should not be required if there is no data', function () {
                address = {};
                expect(util.addressRequired(address)).toBe(false);
                expect(util.addressRequired()).toBe(false);
            });

            it('should be required if there are any fields that have data', function () {
                address = {
                    line1: undefined,
                    line2: undefined,
                    city: undefined,
                    state: undefined,
                    zipcode: undefined,
                    country: undefined,
                }
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

        describe('when deriving the current certification status', function () {
            it('should use the most recent status as "current"', function () {
                var cp = {
                    certificationEvents: [
                        { status: { name: 'Active' }, eventDate: 4 },
                        { status: { name: 'Inactive' }, eventDate: 6 },
                        { status: { name: 'Closed' }, eventDate: 2 },
                    ],
                }
                expect(util.certificationStatus(cp)).toBe('Inactive');
                cp.certificationEvents[1].eventDate = 1;
                expect(util.certificationStatus(cp)).toBe('Active');
            });

            it('should return "" if no events exist', function () {
                var cp = {
                    certificationEvents: [],
                }
                expect(util.certificationStatus(cp)).toBe('');
            });

            it('should return "" if the field is null/undefined/missing', function () {
                var cp = {};
                expect(util.certificationStatus(cp)).toBe('');
                cp.certificationEvents = undefined;
                expect(util.certificationStatus(cp)).toBe('');
                cp.certificationEvents = [];
                expect(util.certificationStatus(cp)).toBe('');
            });

            it('should use the most recent status as "current" when editing', function () {
                var cp = {
                    certificationEvents: [
                        { status: { name: 'Active' }, statusDateObject: new Date('1/1/2018') },
                        { status: { name: 'Inactive' }, statusDateObject: new Date('2/2/2018') },
                        { status: { name: 'Closed' }, statusDateObject: new Date('3/3/2018') },
                    ],
                }
                expect(util.certificationStatus(cp, {editing: true})).toBe('Closed');
                cp.certificationEvents[0].statusDateObject = new Date('4/4/2018');
                expect(util.certificationStatus(cp, {editing: true})).toBe('Active');
            });
        });

        describe('when dealing with booleans', function () {
            it('should return "N/A" if null', function () {
                expect(util.ternaryFilter(null)).toBe('N/A');
            });

            it('should return "True" if true', function () {
                expect(util.ternaryFilter(true)).toBe('True');
            });

            it('should return "False" if false', function () {
                expect(util.ternaryFilter(false)).toBe('False');
            });
        });
    });
})();
