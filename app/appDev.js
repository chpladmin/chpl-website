;(function () {
    'use strict';

    /*****************************************************
     * This section is dummy data until the API can be wired up
     */
    var totalResults = 400;
    var allProducts = [];
    var words = ['Aliquam', 'Erat', 'Volutpat', 'Nunc', 'Eleifend', 'Leo', 'Vitae', 'Magna', 'In', 'Id', 'Erat', 'Non', 'Orci', 'Commodo', 'Lobortis', 'Proin', 'Neque', 'Massa', 'Cursus', 'Ut', 'Gravida', 'Ut', 'Lobortis', 'Eget', 'Lacus', 'Sed', 'Diam', 'Praesent', 'Fermentum', 'Tempor', 'Tellus', 'Nullam', 'Tempus', 'Mauris', 'Ac', 'Felis', 'Vel', 'Velit', 'Tristique', 'Imperdiet', 'Donec', 'At', 'Pede', 'Etiam', 'Vel', 'Neque', 'Nec', 'Dui', 'Dignissim', 'Bibendum', 'Vivamus', 'Id', 'Enim', 'Phasellus', 'Neque', 'Orci', 'Porta', 'A', 'Aliquet', 'Quis', 'Semper', 'A', 'Massa', 'Phasellus', 'Purus', 'Pellentesque', 'Tristique', 'Imperdiet', 'Tortor', 'Nam', 'Euismod', 'Tellus', 'Id', 'Erat', 'Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetuer', 'Adipiscing', 'Elit', 'Donec', 'Hendrerit', 'Tempor', 'Tellus', 'Donec', 'Pretium', 'Posuere', 'Tellus', 'Proin', 'Quam', 'Nisl', 'Tincidunt', 'Et', 'Mattis', 'Eget', 'Convallis', 'Nec', 'Purus', 'Sociis', 'Natoque', 'Penatibus', 'Et', 'Magnis', 'Dis', 'Parturient', 'Montes', 'Nascetur', 'Ridiculus', 'Mus', 'Nulla', 'Posuere', 'Donec', 'Vitae', 'Dolor', 'Nullam', 'Tristique', 'Diam', 'Non', 'Turpis', 'Cras', 'Placerat', 'Accumsan', 'Nulla', 'Nullam', 'Rutrum', 'Nam', 'Vestibulum', 'Accumsan', 'Nisl'];
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'];
    var vendorList = Object.create(null);
    var productList = Object.create(null);
    var certBodies = ['InfoGard', 'CCHIT', 'Drummond Group Inc.', 'SLI Global', 'Surescripts LLC', 'ICSA Labs'];

    function fakeDate() {
        return Math.floor(Math.random() * 120 + 1900) + "-" + months[Math.floor(Math.random() * months.length)] + "-" + days[Math.floor(Math.random() * days.length)];
    }

    function fakeWord() {
        return words[Math.floor(Math.random() * words.length)];
    }

    function fakeChunk() {
        var chunks = [].concat(words).concat(months).concat(days);
        return chunks[Math.floor(Math.random() * chunks.length)];
    }

    function fakeSentence(maxWords) {
        var wordCount = Math.floor(Math.random() * (maxWords / 2) + (maxWords / 2));
        var ret = "";
        for (var i = 0; i < wordCount; i++) {
            ret += fakeWord() + " ";
        }
        ret += fakeWord() + ".";
        return ret;
    }

    function fakeModifiedItems() {
        var ret = [];
        for (var i = 0; i < 4; i++) {
            ret.push({
                actor: fakeWord() + ' ' + fakeWord(),
                action: fakeSentence(12),
                date: fakeDate()
            });
        }
        return ret;
    }

    function fakeCert(prefix, hasVersion) {
        var ret = {
            title: prefix + Math.floor(Math.random() * 100 + 100) + " " + fakeWord(),
            hasVersion: hasVersion,
            isActive: [true,false][Math.floor(Math.random() * 2)]
        };
        return ret;
    }

    function makeFakes(many) {
        var fakeCerts;
        var i;
        for (var cp_id = 0; cp_id < many; cp_id++) {
            fakeCerts = [];
            fakeCerts.push(
                {title: '2011 Certifications', certs: []},
                {title: '2014 Certifications', certs: []},
                {title: '2011 Clinical Quality Measures', certs: []},
                {title: '2014 Clinical Quality Measures', certs: []});

            var maxCount;
            maxCount = Math.floor(Math.random() * 80);
            for (i = 0; i < maxCount; i++) {
                fakeCerts[0].certs.push(fakeCert('130.123.123.',false));
            }

            maxCount = Math.floor(Math.random() * 90);
            for (i = 0; i < maxCount; i++) {
                fakeCerts[1].certs.push(fakeCert('170.123.123.',false));
            }

            maxCount = Math.floor(Math.random() * 80);
            for (i = 0; i < maxCount; i++) {
                fakeCerts[2].certs.push(fakeCert('NQF',false));
            }

            maxCount = Math.floor(Math.random() * 45);
            for (i = 0; i < maxCount; i++) {
                var certActive = [true,false][Math.floor(Math.random() * 2)];
                fakeCerts[3].certs.push({
                    title: 'CQM' + Math.floor(Math.random() * 1000 + 1000) + " " + fakeWord(),
                    isActive: certActive,
                    hasVersion: certActive,
                    version: certActive ? 'v' + Math.floor(Math.random() * 5) : ''
                });
            }

            var vendor = fakeWord() + " " + fakeWord();
            var product = fakeWord() + " " + fakeWord() + "-" + fakeWord();
            vendorList[vendor] = true;
            productList[product] = true;

            allProducts.push({
                additionalSoftware: fakeSentence(60),
                vendor: vendor,
                product: product,
                version: fakeChunk() + "." + fakeChunk(),
                edition: [2011, 2014][Math.floor(Math.random() * 2)],
                certDate: fakeDate(),
                lastModifiedDate: fakeDate(),
                lastModifiedItems: fakeModifiedItems(),
                classification: ['Complete EHR', 'Modular EHR'][Math.floor(Math.random() * 2)],
                practiceType: ['Ambulatory', 'Inpatient'][Math.floor(Math.random() * 2)],
                certBody: certBodies[Math.floor(Math.random() * certBodies.length)],
                certs: fakeCerts,
                chplNum: 'CHP-' + Math.floor(Math.random() * 10000 + 10000),
                id: cp_id
            });
        }
    }

    function getAllProducts() {
        return allProducts;
    }

    function makeProduct() {
        return allProducts[Math.floor(Math.random() * allProducts.length)];
    }

    var allCerts = [];
    function listCerts() {
        for (var i = 0; i < 100; i++) {
            allCerts.push({
                title: '170.123.123.' + Math.floor(Math.random() * 100 + 100) + " " + fakeWord()
            });
        }
        return allCerts;
    }

    var allCQMs = [];
    function listCQMs() {
        for (var i = 0; i < 100; i++) {
            allCQMs.push({
                title: 'CQM' + Math.floor(Math.random() * 1000 + 1000) + " " + fakeWord(),
            });
        }
        return allCQMs;
    }

    function listVendors() {
        var ret = [];
        for (var vendor in vendorList) {
            ret.push({type: 'vendor',
                      value: vendor});
        }
        return ret;
    }

    function listProducts() {
        var ret = [];
        for (var product in productList) {
            ret.push({type: 'product',
                      value: product});
        }
        return ret;
    }

    function listCertBodies() {
        var ret = [];
        for (var i = 0; i < certBodies.length; i++) {
            ret.push({value: certBodies[i]});
        }
        return ret;
    }

    function listFilterCerts() {
        var ret = [{
            title: 'cat 1', certs: [{title: 'title 1'}]
        },{
            title: 'cat 2', certs: [{title: 'title 2'}]
        }];
        return ret;
    }

    makeFakes(totalResults);
    /*
     * End of dummy data section
     *******************************************************/

    angular.module('appDev', ['app', 'ngMockE2E'])
        .run(function ($httpBackend) {
            $httpBackend.whenGET(/^nav\/.*/).passThrough();
            $httpBackend.whenGET(/^search\/.*/).passThrough();
            $httpBackend.whenGET(/^compare\/.*/).passThrough();
            $httpBackend.whenGET(/^product\/.*/).passThrough();
            $httpBackend.whenGET(/herokuapp/).passThrough(); // for JWT quote mocking
            $httpBackend.whenPOST(/herokuapp/).passThrough();
            $httpBackend.whenGET(/^view.\/.*/).passThrough(); // old view1/2 pages
            $httpBackend.whenGET(/ainq.com\/search/).respond(200, getAllProducts()); // fake search results
            $httpBackend.whenGET(/ainq.com\/get_product/).respond(200, makeProduct()); // fake product
            $httpBackend.whenGET(/ainq.com\/list_certs/).respond(200, listCerts()); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_cqms/).respond(200, listCQMs()); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_editions/).respond(200, [{value: 2011}, {value: 2014}]); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_classifications/).respond(200, [{value: 'Complete EHR'}, {value: 'Modular EHR'}]); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_practices/).respond(200, [{value: 'Inpatient'}, {value: 'Ambulatory'}]); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_products/).respond(200, listProducts()); // list all products
            $httpBackend.whenGET(/ainq.com\/list_vendors/).respond(200, listVendors()); // list all vendors
            $httpBackend.whenGET(/ainq.com\/list_certBodies/).respond(200, listCertBodies()); // list cerification bodies
            $httpBackend.whenGET(/ainq.com\/list_filterCerts/).respond(200, listFilterCerts()); // list cerification bodies
        })
        .config(function ($provide) {
            $provide.decorator('$exceptionHandler', ['$delegate', function($delegate) {
                return function (exception, cause) {
                    $delegate(exception, cause);
                    //alert(exception.message);
                };
            }])
        })
        .config(function($provide) {
            $provide.decorator('$httpBackend', function($delegate) {
                var proxy = function(method, url, data, callback, headers) {
                    var interceptor = function() {
                        var _this = this,
                            _arguments = arguments;
                        setTimeout(function() {
                            callback.apply(_this, _arguments);
                        }, 100); // delay for .1s
                    };
                    return $delegate.call(this, method, url, data, interceptor, headers);
                };
                for(var key in $delegate) {
                    proxy[key] = $delegate[key];
                }
                return proxy;
            });
        });
})();
