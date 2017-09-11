(function () {
    'use strict';

    describe('the Custom Smart-Table Filter', function () {

        var $log, Mock, aiCustomFilter, mock;

        mock = {
            /* eslint-disable quotes, key-spacing */
            correctiveActionCollection: [{"id":3,"chplProductNumber":"CHP-029177","edition":"2014","acb":"InfoGard","developer":"Intuitive Medical Documents","product":"Intuitive Medical Document","version":"2.0","certificationStatus":"Active","surveillanceCount":2,"openNonconformityCount":1,"closedNonconformityCount":1,"mainSearch":"Intuitive Medical Documents|Intuitive Medical Document|2.0|CHP-029177","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":1}"},{"id":3,"chplProductNumber":"CHP-029177","edition":"2014","acb":"InfoGard","developer":"Intuitive Medical Documents","product":"Intuitive Medical Document","version":"2.0","certificationStatus":"Active","surveillanceCount":2,"openNonconformityCount":1,"closedNonconformityCount":1,"mainSearch":"Intuitive Medical Documents|Intuitive Medical Document|2.0|CHP-029177","nonconformities":null},{"id":7847,"chplProductNumber":"CHP-029176","edition":"2014","acb":"InfoGard","developer":"Intuitive Medical Documents","product":"Intuitive Medical Document","version":"2.0","certificationStatus":"Active","surveillanceCount":2,"openNonconformityCount":1,"closedNonconformityCount":1,"mainSearch":"Intuitive Medical Documents|Intuitive Medical Document|2.0|CHP-029176","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":1}"},{"id":4884,"chplProductNumber":"CHP-021264","edition":"2014","acb":"Drummond Group","developer":"LSS Data Systems","product":"Medical and Practice Management (MPM) 6.0 Continuity of Care (CCD) Interface Suite","version":"6.08","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"LSS Data Systems|Medical and Practice Management (MPM) 6.0 Continuity of Care (CCD) Interface Suite|6.08|CHP-021264","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":4890,"chplProductNumber":"CHP-021271","edition":"2014","acb":"Drummond Group","developer":"LSS Data Systems","product":"Medical and Practice Management (MPM) Client/Server Continuity of Care (CCD) Interface Suite","version":"5.6.6","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"LSS Data Systems|Medical and Practice Management (MPM) Client/Server Continuity of Care (CCD) Interface Suite|5.6.6|CHP-021271","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":4215,"chplProductNumber":"CHP-025135","edition":"2014","acb":"Drummond Group","developer":"Medical Information Technology, Inc. (MEDITECH)","product":"MEDITECH MAGIC Continuity of Care Interface (CCD) Suite","version":"v5.67","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"Medical Information Technology, Inc. (MEDITECH)|MEDITECH MAGIC Continuity of Care Interface (CCD) Suite|v5.67|CHP-025135","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":4976,"chplProductNumber":"CHP-023352","edition":"2014","acb":"Drummond Group","developer":"Medical Information Technology, Inc. (MEDITECH)","product":"Medical and Practice Management (MPM)","version":"6.08","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"Medical Information Technology, Inc. (MEDITECH)|Medical and Practice Management (MPM)|6.08|CHP-023352","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":7717,"chplProductNumber":"14.04.04.2931.MEDI.08.1.1.160426","edition":"2014","acb":"Drummond Group","developer":"Medical Information Technology, Inc. (MEDITECH)","product":"MEDITECH 6.0 Continuity of Care (CCD) Interface Suite","version":"v6.08","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"Medical Information Technology, Inc. (MEDITECH)|MEDITECH 6.0 Continuity of Care (CCD) Interface Suite|v6.08|14.04.04.2931.MEDI.08.1.1.160426","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":8052,"chplProductNumber":"14.04.04.2931.MEDI.CC.1.1.160929","edition":"2014","acb":"Drummond Group","developer":"Medical Information Technology, Inc. (MEDITECH)","product":"MEDITECH Medical and Practice Management (MPM) MAGIC Continuity of Care (CCD) Interface Suite","version":"v5.67","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"Medical Information Technology, Inc. (MEDITECH)|MEDITECH Medical and Practice Management (MPM) MAGIC Continuity of Care (CCD) Interface Suite|v5.67|14.04.04.2931.MEDI.CC.1.1.160929","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":4445,"chplProductNumber":"CHP-027145","edition":"2014","acb":"Drummond Group","developer":"Accumedic Computer Systems, Inc.","product":"AccuMed","version":"v 12.11","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Accumedic Computer Systems, Inc.|AccuMed|v 12.11|CHP-027145","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":5835,"chplProductNumber":"CHP-022107","edition":"2014","acb":"ICSA Labs","developer":"I Physician Hub","product":"Electronic Medical Office","version":"2.0","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"I Physician Hub|Electronic Medical Office|2.0|CHP-022107","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":5690,"chplProductNumber":"CHP-024518","edition":"2014","acb":"ICSA Labs","developer":"iMedics Inc.","product":"AmicusMD","version":"1","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"iMedics Inc.|AmicusMD|1|CHP-024518","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":3564,"chplProductNumber":"CHP-024472","edition":"2014","acb":"Drummond Group","developer":"Innovative Medical Practice Solutions","product":"SolidPractice","version":"3.5.4","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Innovative Medical Practice Solutions|SolidPractice|3.5.4|CHP-024472","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":5312,"chplProductNumber":"CHP-029019","edition":"2014","acb":"Drummond Group","developer":"Mountainside Software, Inc.","product":"Mountainside Electronic Medical Records","version":"Version 3.2.0","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Mountainside Software, Inc.|Mountainside Electronic Medical Records|Version 3.2.0|CHP-029019","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":5661,"chplProductNumber":"CHP-024851","edition":"2014","acb":"ICSA Labs","developer":"Perk Medical Systems Inc.","product":"ezPractice","version":"14.1","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Perk Medical Systems Inc.|ezPractice|14.1|CHP-024851","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":3696,"chplProductNumber":"CHP-025320","edition":"2014","acb":"Drummond Group","developer":"Spectrum Medical, Inc.","product":"VIPER Clinical Information Solution","version":"3.0","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Spectrum Medical, Inc.|VIPER Clinical Information Solution|3.0|CHP-025320","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":4943,"chplProductNumber":"CHP-022484","edition":"2014","acb":"Drummond Group","developer":"Tech-Time, Inc.","product":"STAT! Enterprise Medical Management","version":"2.0","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Tech-Time, Inc.|STAT! Enterprise Medical Management|2.0|CHP-022484","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":4944,"chplProductNumber":"CHP-022485","edition":"2014","acb":"Drummond Group","developer":"Tech-Time, Inc.","product":"STAT! Enterprise Medical Management","version":"2.0","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Tech-Time, Inc.|STAT! Enterprise Medical Management|2.0|CHP-022485","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"}],
            /* eslint-enable quotes, key-spacing */
        };
        beforeEach(function () {
            module('chpl.services', 'chpl.mock');

            inject(function (_$log_, _Mock_, _customFilterFilter_) {
                aiCustomFilter = _customFilterFilter_;
                $log = _$log_;
                Mock = _Mock_;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('whould filter on text', function () {
            expect(aiCustomFilter(Mock.allCps, {chplProductNumber: 'CHP-'}).length).toBe(5);
        });

        it('whould return exact match searches values', function () {
            expect(aiCustomFilter(Mock.allCps, {practiceType: {distinct: 'Ambulatory'}}).length).toBe(3);
        });

        it('should allow matching any', function () {
            expect(aiCustomFilter(Mock.allCps, {criteriaMet: {matchAny: {all: false, items: ['170.315 (d)(1)','170.315 (d)(10)']}}}).length).toBe(2);
        });

        describe('surveillance section', function () {
            it('should filter on "never"', function () {
                var survFilter = {surveillance: 'never'};
                expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(3);
            });

            it('should filter on "has-had"', function () {
                var survFilter = {surveillance: 'has-had'};
                expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(4);
            });

            describe('when "has-had" the nonconformity subsection', function () {
                it('should filter on "no NCs"', function () {
                    var survFilter = {surveillance: 'has-had', NC: {never: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                });

                it('should filter on "closed NCs"', function () {
                    var survFilter = {surveillance: 'has-had', NC: {closed: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(2);
                });

                it('should filter on "open NCs"', function () {
                    var survFilter = {surveillance: 'has-had', NC: {open: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                });

                describe('when matching all', function () {
                    it('should filter on "no NCs & open"', function () {
                        var survFilter = {surveillance: 'has-had', matchAll: true, NC: {never: true, open: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(0);
                    });

                    it('should filter on "closed & open"', function () {
                        var survFilter = {surveillance: 'has-had', matchAll: true, NC: {closed: true, open: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(0);
                    });
                });

                describe('when matching any with multiples', function () {
                    it('should filter on "open & closed NCs"', function () {
                        var survFilter = {surveillance: 'has-had', NC: {open: true, closed: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(3);
                    });

                    it('should filter on "never & closed NCs"', function () {
                        var survFilter = {surveillance: 'has-had', NC: {never: true, closed: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(2);
                    });

                    it('should filter on "never & open NCs"', function () {
                        var survFilter = {surveillance: 'has-had', NC: {never: true, open: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                    });

                    it('should filter on "never, closed & open NCs"', function () {
                        var survFilter = {surveillance: 'has-had', NC: {never: true, closed: true, open: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(4);
                    });
                });
            });
        });

        describe('nonconformity section', function () {
            it('should allow all when no filter', function () {
                var ncFilter = {nonconformities: {}};
                expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(17);
            });

            describe('when matching any', function () {
                it('should filter on "has open NCs"', function () {
                    var ncFilter = {
                        nonconformities: {
                            open: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(8);
                });

                it('should filter on "has closed NCs"', function () {
                    var ncFilter = {
                        nonconformities: {
                            closed: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(11);
                });

                it('should filter on "has open || closed NCs"', function () {
                    var ncFilter = {
                        nonconformities: {
                            open: true,
                            closed: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(17);
                });
            });

            describe('when matching all', function () {
                it('should filter on "has open && closed NCs"', function () {
                    var ncFilter = {
                        nonconformities: {
                            open: true,
                            closed: true,
                            matchAll: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(2);
                });

                it('should filter on "has open && no closed NCs"', function () {
                    var ncFilter = {
                        nonconformities: {
                            open: true,
                            closed: false,
                            matchAll: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(6);
                });

                it('should filter on "has no open && closed NCs"', function () {
                    var ncFilter = {
                        nonconformities: {
                            open: false,
                            closed: true,
                            matchAll: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(9);
                });

                it('should filter on "has no open && no closed NCs"', function () {
                    var ncFilter = {
                        nonconformities: {
                            open: false,
                            closed: false,
                            matchAll: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(0);
                });
            });
        });
    });
})();
