;(function () {
    'use strict';

    describe('[app.search module] [search filter]', function () {

        var $filter;
        beforeEach(module('app.search'));
        beforeEach(function () {
            inject(function (_$filter_) {
                $filter = _$filter_;
            });
        });

        var $log;
        beforeEach(inject(function (_$log_) {
            $log = _$log_;
        }));
        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }

        });

        var item1 = {
            vendor: 'Vendor1',
            product: 'Product1',
            edition: 2011,
            certDate: '2011-01-01',
            classification: 'Complete EHR',
            fakeCerts: [{
                title: '2011 Certifications',
                certs: [{
                    title: '2011 Cert 1',
                    isActive: true
                }]
            }]
        };
        var item2 = {
            vendor: 'Vendor2',
            product: 'Product2',
            edition: 2014,
            certDate: '2014-01-01',
            classification: 'Modular EHR',
            fakeCerts: [{
                title: '2014 Certifications',
                certs: [{
                    title: '2014 Cert 1',
                    isActive: false
                }]
            }]
        };
        var items = [item1, item2];

        it('should filter out Vendor2 when vendor.value is "Vendor1"', function () {
            var result = $filter('tableFilter')(items, {vendor: 'Vendor1'});
            expect(result).toEqual([item1]);
        });

        it('should filter out both items when edition.value is 2000', function () {
            var result = $filter('tableFilter')(items, {edition: 2000});
            expect(result).toEqual([]);
        });
    });
})();
