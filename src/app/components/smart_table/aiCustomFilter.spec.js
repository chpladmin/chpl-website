(function () {
    'use strict';

    describe('aiCustomFilter', function () {

        var aiCustomFilter, $log, Mock;

        beforeEach(function () {
            module('chpl.common', 'chpl.mock');

            inject(function (_$log_, _Mock_, _customFilterFilter_) {
                aiCustomFilter = _customFilterFilter_;
                $log = _$log_;
                Mock = _Mock_;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('whould filter on text', function () {
            expect(aiCustomFilter(Mock.allCps, {chplProductNumber: 'CHP-'}).length).toBe(4);
        });

        it('whould return exact match searches values', function () {
            expect(aiCustomFilter(Mock.allCps, {practiceType: {distinct: 'Ambulatory'}}).length).toBe(3);
        });

        it('should allow matching any', function () {
            expect(aiCustomFilter(Mock.allCps, {criteriaMet: {matchAny: {all: false, items: ['170.315 (d)(1)','170.315 (d)(10)']}}}).length).toBe(1);
        });

        describe('surveillance filter', function () {
            describe('has surveillance', function () {
                it('never', function () {
                    var survFilter = {surveillance:'never'};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(2);
                });

                it('has-had', function () {
                    var survFilter = {surveillance:'has-had'};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(3);
                });
            });

            describe('has nonconformities', function () {
                it('has-had with no NCs', function () {
                    var survFilter = {surveillance:'has-had', NC:{never:true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                });

                it('has-had with closed NCs', function () {
                    var survFilter = {surveillance:'has-had', NC:{closed:true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                });

                it('has-had with open NCs', function () {
                    var survFilter = {surveillance:'has-had', NC:{open:true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                });
            });

            describe('match all', function () {
                it('has-had with no NCs & open', function () {
                    var survFilter = {surveillance:'has-had', matchAll: true, NC:{never:true, open: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(0);
                });

                it('has-had with closed & open', function () {
                    var survFilter = {surveillance:'has-had', matchAll: true, NC:{closed: true, open: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(0);
                });
            });

            describe('match any with multiples', function () {
                it('has-had with open & closed NCs', function () {
                    var survFilter = {surveillance:'has-had', NC:{open:true, closed: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(2);
                });

                it('has-had with never & closed NCs', function () {
                    var survFilter = {surveillance:'has-had', NC:{never:true, closed: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                });

                it('has-had with never & open NCs', function () {
                    var survFilter = {surveillance:'has-had', NC:{never:true, open: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                });

                it('has-had with never, closed & open NCs', function () {
                    var survFilter = {surveillance:'has-had', NC:{never:true, closed: true, open: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(3);
                });
            });
        });
    });
})();
