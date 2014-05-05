/*jshint jquery: true */
/*globals asyncTest,deepEqual,equal,expect,module,notDeepEqual,notEqual,notStrictEqual,ok,QUnit,raises,start,stop,strictEqual,test,jQuery */
(function($){
    'use strict';
    
    var $fixture, t, tests = {
        init: function() {
            var el;
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker();
            
            el = document.getElementById('test1');
            
            strictEqual($('#test1-qcTimepicker', $fixture).length, 1);
            strictEqual(el.style.display, 'none');
            strictEqual(el.tabIndex, -1);
        },
        
        initDouble: function() {
            var el;
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker();
            $('#test1').qcTimepicker();
            
            el = document.getElementById('test1');
            
            strictEqual(el.parentNode.children.length - 1, 1);
        },
        
        initValue: function() {
            var qc;
            
            $fixture.append('<input id=test1 value=13:30:00 />');
            
            $('#test1').qcTimepicker();
            
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(qc.value, '13:30:00');
        },
        
        initInputTimeValue: function() {
            var qc;
            
            $fixture.append('<input type=time value=15:00:00 id=test1 />');
            
            $('#test1').qcTimepicker();
            
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(qc.value, '15:00:00');
        },
        
        initInputTimeRange: function() {
            var i, qc = [];
            
            $fixture.append('<input id=test1 type=time min=08:00:00 />');
            $fixture.append('<input id=test2 type=time max=16:00:00 />');
            $fixture.append('<input id=test3 type=time min=08:00:00 max=16:00:00 />');
            $fixture.append('<input id=test4 type=time min=foo max=02:00:00 />');
            $fixture.append('<input id=test5 type=time min=23:00:00 max=foo />');
            $fixture.append('<input id=test6 type=time max=08:00:00 min=16:00:00 />');
            $fixture.append('<input id=test7 type=time min=25:00:00 />');
            $fixture.append('<input id=test8 type=time min=-2 />');
            $fixture.append('<input id=test9 type=time min=9 />');
            $fixture.append('<input id=test10 type=time min=foo />');
            $fixture.append('<input id=test11 type=time min=foo max=bar />');
            $fixture.append('<input id=test12 type=time min="" />');
            
            $fixture.append('<input id=test13 type=time min=08:00:00 max=16:00:00 />');
            
            for (i = 1; i <= 12; i += 1) {
                $('#test' + i).qcTimepicker();
                qc[i] = document.getElementById('test' + i + '-qcTimepicker');
            }
            
            $('#test13').qcTimepicker({
                minTime: '7:30',
                maxTime: '16:30'
            });
            qc[13] = document.getElementById('test13-qcTimepicker');
            
            strictEqual(qc[1].children[1].value, '08:00:00');
            strictEqual(qc[1].lastChild.value, '23:30:00');
            
            strictEqual(qc[2].children[1].value, '00:00:00');
            strictEqual(qc[2].lastChild.value, '16:00:00');
            
            strictEqual(qc[3].children[1].value, '08:00:00');
            strictEqual(qc[3].lastChild.value, '16:00:00');
            
            strictEqual(qc[4].children[1].value, '00:00:00');
            strictEqual(qc[4].lastChild.value, '02:00:00');
            
            strictEqual(qc[5].children[1].value, '23:00:00');
            strictEqual(qc[5].lastChild.value, '23:30:00');
            
            for (i = 7; i <= 12; i += 1) {
                strictEqual(qc[i].children[1].value, '00:00:00');
                strictEqual(qc[i].lastChild.value, '23:30:00');
            }
            
            strictEqual(qc[13].children[1].value, '08:00:00');
            strictEqual(qc[13].lastChild.value, '16:00:00');
        },
        
        initRequired: function() {
            var qc, dummyInput = document.createElement('input');
            if(typeof dummyInput.required === 'undefined') {
                // Can't test feature in unsupported browsers
                expect(0);
                return;
            }
            
            $fixture.append('<input id=test1 required />');
            
            $('#test1').qcTimepicker();
            
            qc = document.getElementById('test1-qcTimepicker');
            
            ok(qc.required);
        },
        
        initUnidentified: function() {
            $fixture.append('<input data-test=foo /><input data-test=foo />');
            
            $('[data-test="foo"]').qcTimepicker();
            
            strictEqual($('#qcTimepicker-1', $fixture).length, 1);
            strictEqual($('select[id^="qcTimepicker-"]', $fixture).length, 2);
        },
        
        rangeDefault: function() {
            var qc;
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker();
            
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(qc.children[1].innerHTML, '0:00');
            strictEqual(qc.children[2].innerHTML, '0:30');
            strictEqual(qc.lastChild.innerHTML, '23:30');
            strictEqual(qc.children.length, 24 * 2 + 1);
        },
        
        rangeCustom: function() {
            var qc;
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker({
                minTime: '9',
                maxTime: '17'
            });
            
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(qc.children[1].innerHTML, '9:00');
            strictEqual(qc.children[1].value, '09:00:00');
            strictEqual(qc.children[2].innerHTML, '9:30');
            strictEqual(qc.children[2].value, '09:30:00');
            strictEqual(qc.lastChild.innerHTML, '17:00');
            strictEqual(qc.lastChild.value, '17:00:00');
            strictEqual(qc.children.length, (17 - 9) * 2 + 1 + 1);
        },
        
        rangeDateObject: function() {
            var qc, d1 = new Date(2014, 4, 1, 9, 0, 0), d2 = new Date(2014, 4, 1, 17, 0, 0);
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker({
                minTime: d1,
                maxTime: d2
            });
            
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(qc.children[1].innerHTML, '9:00');
            strictEqual(qc.children[1].value, '09:00:00');
            strictEqual(qc.children[2].innerHTML, '9:30');
            strictEqual(qc.children[2].value, '09:30:00');
            strictEqual(qc.lastChild.innerHTML, '17:00');
            strictEqual(qc.lastChild.value, '17:00:00');
            strictEqual(qc.children.length, (17 - 9) * 2 + 1 + 1);
        },
        
        rangeGoofy: function() {
            var qc;
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker({
                minTime: '29:89:60',
                maxTime: '16:80'
            });
            
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(qc.children[1].innerHTML, '6:30');
            strictEqual(qc.children[1].value, '06:30:00');
            strictEqual(qc.lastChild.innerHTML, '17:00');
            strictEqual(qc.lastChild.value, '17:00:00');
            strictEqual(qc.children.length, (17 - 6) * 2 + 1);
        },
        
        rangeInvalid: function() {
            var qc1;
            
            $fixture.append('<input id=test1 />');
            $fixture.append('<input id=test2 />');
            
            $('#test1').qcTimepicker({
                minTime: '2',
                maxTime: '1'
            });
            
            qc1 = document.getElementById('test1-qcTimepicker');
            
            // Max > min
            strictEqual(qc1.children.length, 1);
            
            // Completely invalid values
            throws(function() {
                $('#test2').qcTimepicker({
                    minTime: 'foo',
                    maxTime: '-6'
                });
            }, 'InvalidArgumentException');
        },
        
        step: function() {
            var qc;
            
            $fixture.append('<input id=test1 />');
            $('#test1').qcTimepicker({
                step: '0:15'
            });
            
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(qc.children[1].innerHTML, '0:00');
            strictEqual(qc.children[2].innerHTML, '0:15');
            strictEqual(qc.lastChild.innerHTML, '23:45');
            strictEqual(qc.children.length, 24 * 4 + 1);
        },
        
        stepRange: function() {
            var qc;
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker({
                minTime: '9',
                maxTime: '16:50',
                step: '0:15'
            });
            
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(qc.children[1].innerHTML, '9:00');
            strictEqual(qc.children[2].innerHTML, '9:15');
            strictEqual(qc.lastChild.innerHTML, '16:45');
            strictEqual(qc.children.length, (17 - 9) * 4 + 1);
        },
        
        stepInvalid: function() {
            $fixture.append('<input id=test1 />');
            
            throws(function() {
                $('#test1').qcTimepicker({
                    step: -0.3
                });
            }, 'InvalidArgumentException');
            
            throws(function() {
                $('#test1').qcTimepicker({
                    step: 'foo'
                });
            }, 'InvalidArgumentException');
            
            throws(function() {
                $('#test1').qcTimepicker({
                    step: null
                });
            }, 'InvalidArgumentException');
            
            throws(function() {
                $('#test1').qcTimepicker({
                    step: '2:-1:-0'
                });
            }, 'InvalidArgumentException');
        },
        
        label: function() {
            var elLabel;
            
            $fixture.append('<label id=foo for=test1>Foo</label><input id=test1 />');
            
            $('#test1').qcTimepicker();
            
            elLabel = document.getElementById('foo');
            
            strictEqual(elLabel.htmlFor, 'test1-qcTimepicker');
            
            // document.activeElement doesn't work in PhantomJS 
            // See https://github.com/netzpirat/guard-jasmine/issues/48
            if (typeof window.callPhantom !== 'function') {
                // Test label functionality
                $(elLabel).trigger('click');
                strictEqual(document.getElementById('test1-qcTimepicker') === document.activeElement, true);
            }
        },
        
        placeholder: function() {
            $fixture.append('<input id=test1 placeholder=foo />');
            $fixture.append('<input id=test2 />');
            $fixture.append('<input id=test3 placeholder=foo />');
            $fixture.append('<input id=test4 />');
            $fixture.append('<input id=test5 type=time data-placeholder=foo />');
            $fixture.append('<input id=test6 type=time />');
            $fixture.append('<input id=test7 type=time data-placeholder=foo />');
            $fixture.append('<input id=test8 type=time />');
            $fixture.append('<input id=test9 data-placeholder=foo placeholder=bar />');
            
            $('#test1, #test2, #test5, #test6').qcTimepicker();
            $('#test3, #test4, #test7, #test8, #test9').qcTimepicker({
                placeholder: 'bar'
            });
            
            strictEqual(document.getElementById('test1-qcTimepicker').firstChild.innerHTML, 'foo');
            strictEqual(document.getElementById('test2-qcTimepicker').firstChild.innerHTML, $.fn.qcTimepicker.defaults.placeholder);
            strictEqual(document.getElementById('test3-qcTimepicker').firstChild.innerHTML, 'foo');
            strictEqual(document.getElementById('test4-qcTimepicker').firstChild.innerHTML, 'bar');
            strictEqual(document.getElementById('test5-qcTimepicker').firstChild.innerHTML, 'foo');
            strictEqual(document.getElementById('test6-qcTimepicker').firstChild.innerHTML, $.fn.qcTimepicker.defaults.placeholder);
            strictEqual(document.getElementById('test7-qcTimepicker').firstChild.innerHTML, 'foo');
            strictEqual(document.getElementById('test8-qcTimepicker').firstChild.innerHTML, 'bar');
            strictEqual(document.getElementById('test9-qcTimepicker').firstChild.innerHTML, 'foo');
        },
        
        hide: function() {
            var qc;
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker().qcTimepicker('hide');
            
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(qc.style.display, 'none');
        },
        
        show: function() {
            var qc;
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker();
            
            qc = document.getElementById('test1-qcTimepicker');
            
            qc.style.display = 'none';
            $('#test1').qcTimepicker('show');
            notStrictEqual(qc.style.display, 'none');
            
            $('#test1').qcTimepicker('hide').qcTimepicker('show');
            notStrictEqual(qc.style.display, 'none');
        },
        
        destroy: function() {
            var el1, el2, el3, qc1;
            
            $fixture.append('<input class=time id=test1 />');
            $fixture.append('<input class=time id=test2 tabindex=5 />');
            $fixture.append('<input class=time id=test3 tabindex=-1 />');
            
            $('.time').qcTimepicker();
            
            el1 = document.getElementById('test1');
            el2 = document.getElementById('test2');
            el3 = document.getElementById('test3');
            
            // Destroy normal
            $('#test1').qcTimepicker('destroy');
            qc1 = document.getElementById('test1-qcTimepicker');
            
            strictEqual(qc1, null);
            notStrictEqual(el1.style.display, 'none');
            notStrictEqual(el1.tabIndex, -1);
            
            // Destroy custom tabindex
            $('#test2').qcTimepicker('destroy');
            
            strictEqual(el2.tabIndex, 5);
            
            // Destroy negative tabindex
            $('#test3').qcTimepicker('destroy');
            
            strictEqual(el3.tabIndex, -1);
        },
        
        setOptions: function() {
            var qc;
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker();
            
            qc = document.getElementById('test1-qcTimepicker');
            
            $('#test1').qcTimepicker('options', {
                required: true
            });
            strictEqual(qc.required, true);
            
            $('#test1').qcTimepicker('options', {
                required: false
            });
            strictEqual(qc.required, false);
        },
        
        classNamesOne: function() {
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker({
                classes: 'foo'
            });
            
            ok($('#test1-qcTimepicker', $fixture).hasClass('foo'));
        },
        
        classNamesMultiple: function() {
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker({
                classes: ['bar', 'baz']
            });
            
            ok($('#test1-qcTimepicker', $fixture).hasClass('bar') && $('#test1-qcTimepicker', $fixture).hasClass('baz'));  
        },
        
        inputChange: function() {
            var el, qc;
            
            $fixture.append('<input id=test1 />');
            
            $('#test1').qcTimepicker();
            
            el = document.getElementById('test1');
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(el.value, '');
            
            // Test changing dropdown
            $('#test1-qcTimepicker').val('14:00:00').trigger('change');
            strictEqual(el.value, '14:00:00');
            
            // Test changing original input (programmatically)
            $('#test1').val('15:00:00').trigger('change');
            strictEqual(qc.value, '15:00:00');
        },
        
        inputTimeChange: function() {
            var el, qc;
            
            $fixture.append('<input type=time id=test1 />');
            
            $('#test1').qcTimepicker();
            
            el = document.getElementById('test1');
            qc = document.getElementById('test1-qcTimepicker');
            
            strictEqual(el.value, '');
            
            // Test changing dropdown
            $('#test1-qcTimepicker').val('14:00:00').trigger('change');
            strictEqual(el.value, '14:00:00');
            
            // Test changing original input (programmatically)
            $('#test1').val('15:00:00').trigger('change');
            strictEqual(qc.value, '15:00:00');
        },
        
        format: function() {
            var testFunction = function(format) {
                $fixture.html('<input id=test1 />');
                
                $('#test1').qcTimepicker({
                    format: format,
                    minTime: '00:01:09',
                    maxTime: '00:01:09'
                });
                
                return document.getElementById('test1-qcTimepicker').lastChild.innerHTML;
            };
            
            var testFormats = {
                'h:m:s a': '12:1:9 am',
                'hh:mm:ss a': '12:01:09 am',
                'H:m:s': '0:1:9',
                'HH:mm:ss': '00:01:09',
                'k:m:s': '1:1:9',
                'kk:mm:ss': '01:01:09',
                'K:m:s a': '1:1:9 am',
                'KK:mm:ss a': '01:01:09 am',
                'A': '69000',
                '\\aa\\h': 'aamh',
                '\\\\': '',
                '\\mm': 'm1',
                '\\m\\m': 'mm'
            };
            
            $.each(testFormats, function(k, v) {
                strictEqual(testFunction(k), v);
            });
        },
        
        valueAsDate: function() {
            var values, dates, v, dummyInput = document.createElement('input');
            
            $fixture.append('<input class=time id=test1 />');
            $fixture.append('<input class=time id=test2 type=time />');
            $fixture.append('<input class=time id=test3 />');
            $fixture.append('<input class=time id=test4 value=00:00:00 />');
            $fixture.append('<input class=time id=test5 type=time value=23:59:00 />');
            
            $('.time').qcTimepicker();
            
            $('#test1-qcTimepicker').val('14:00:00').trigger('change');
            $('#test2-qcTimepicker').val('17:30:00').trigger('change');
            
            values = {
                '1': $('#test1').qcTimepicker('valueAsDate'),
                '2': $('#test2').qcTimepicker('valueAsDate'),
                '3': $('#test3').qcTimepicker('valueAsDate'),
                '4': $('#test4').qcTimepicker('valueAsDate'),
                '5': $('#test5').qcTimepicker('valueAsDate')
            };
            
            dates = {
                '1': new Date('Thu, 1 Jan 1970 14:00:00 GMT'),
                
                // Test for native support
                '2': (typeof dummyInput.valueAsDate === 'object' && dummyInput.valueAsDate instanceof Date) ? document.getElementById('test2').valueAsDate : (new Date('Thu, 1 Jan 1970 17:30:00 GMT')),
                
                '3': null,
                '4': new Date('Thu, 1 Jan 1970 00:00:00 GMT'),
                '5': new Date('Thu, 1 Jan 1970 23:59:00 GMT')
            };
            
            for (v in values) {
                if (values.hasOwnProperty(v)) {
                    deepEqual(values[v], dates[v]);
                }
            }
        },
        
        valueAsNumber: function() {
            var values, dates, v, dummyInput = $('<input type=time />')[0];
            
            $fixture.append('<input class=time id=test1 />');
            $fixture.append('<input class=time id=test2 type=time />');
            $fixture.append('<input class=time id=test3 />');
            $fixture.append('<input class=time id=test4 value=00:00:00 />');
            $fixture.append('<input class=time id=test5 type=time value=23:59:00 />');
            
            $('.time').qcTimepicker();
            
            $('#test1-qcTimepicker').val('14:00:00').trigger('change');
            $('#test2-qcTimepicker').val('17:30:00').trigger('change');
            
            values = {
                '1': $('#test1').qcTimepicker('valueAsNumber'),
                '2': $('#test2').qcTimepicker('valueAsNumber'),
                '3': $('#test3').qcTimepicker('valueAsNumber'),
                '4': $('#test4').qcTimepicker('valueAsNumber'),
                '5': $('#test5').qcTimepicker('valueAsNumber')
            };
            
            dates = {
                '1': Date.parse('Thu, 1 Jan 1970 14:00:00 GMT'),
                
                // Test for native support
                '2': (dummyInput.type === 'time' && typeof dummyInput.valueAsNumber === 'number') ? document.getElementById('test2').valueAsNumber : Date.parse('Thu, 1 Jan 1970 17:30:00 GMT'),
                
                '3': Number.NaN,
                '4': Date.parse('Thu, 1 Jan 1970 00:00:00 GMT'),
                '5': Date.parse('Thu, 1 Jan 1970 23:59:00 GMT')
            };
            
            for (v in values) {
                if (values.hasOwnProperty(v)) {
                    deepEqual(dates[v], values[v]);
                }
            }
        },
        
        stepUp: function() {
            var el2, el3;
            
            $fixture.append('<input class=time id=test1 />');
            $fixture.append('<input class=time id=test2 />');
            $fixture.append('<input class=time id=test3 value=00:00:00 />');
            $fixture.append('<input class=time id=test4 value=23:30:00 />');
            
            $('.time').qcTimepicker();
            
            el2 = document.getElementById('test2');
            el3 = document.getElementById('test3');
            
            $('#test2-qcTimepicker').val('12:30:00').trigger('change');
            
            $('#test2').qcTimepicker('stepUp');
            $('#test3').qcTimepicker('stepUp');
            
            throws(function() {
                $('#test1').qcTimepicker('stepUp');
            }, 'InvalidStateError');
            
            strictEqual(el2.value, '13:00:00');
            strictEqual(el3.value, '00:30:00');
            
            throws(function() {
                $('#test4').qcTimepicker('stepUp');
            }, 'InvalidStateError');
        },
        
        stepUpCustomStep: function() {
            var el2, el3;
            
            $fixture.append('<input class=time id=test1 />');
            $fixture.append('<input class=time id=test2 value=00:00:00 />');
            $fixture.append('<input class=time id=test3 value=14:00:00 />');
            $fixture.append('<input class=time id=test4 value=14:30:00 />');
            $fixture.append('<input class=time id=test5 value=22:00:00 />');
            
            $('.time').qcTimepicker({
                step: '02:00:00'
            });
            
            el2 = document.getElementById('test2');
            el3 = document.getElementById('test3');
            
            $('#test2').qcTimepicker('stepUp');
            $('#test3').qcTimepicker('stepUp');
            
            throws(function() {
                $('#test1').qcTimepicker('stepUp');
            }, 'InvalidStateError');
            
            strictEqual(el2.value, '02:00:00');
            strictEqual(el3.value, '16:00:00');
            
            throws(function() {
                $('#test4').qcTimepicker('stepUp');
            }, 'InvalidStateError');
            
            throws(function() {
                $('#test5').qcTimepicker('stepUp');
            }, 'InvalidStateError');
        },
        
        stepUpTime: function() {
            var el2, el3;
            
            $fixture.append('<input class=time type=time id=test1 />');
            $fixture.append('<input class=time type=time id=test2 value=00:00:00 />');
            $fixture.append('<input class=time type=time id=test3 value=14:00:00 />');
            $fixture.append('<input class=time type=time id=test4 value=23:30:00 />');
            
            $('.time').qcTimepicker();
            
            el2 = document.getElementById('test2');
            el3 = document.getElementById('test3');
            
            $('#test2').qcTimepicker('stepUp');
            $('#test3').qcTimepicker('stepUp');
            
            throws(function() {
                $('#test1').qcTimepicker('stepUp');
            }, 'InvalidStateError');
            
            ok(el2.value === '00:30:00' || el2.value === '00:30');
            ok(el3.value === '14:30:00' || el3.value === '14:30');
            
            throws(function() {
                $('#test4').qcTimepicker('stepUp');
            }, 'InvalidStateError');
        },
        
        stepDown: function() {
            var el2, el4;
            
            $fixture.append('<input class=time id=test1 />');
            $fixture.append('<input class=time id=test2 />');
            $fixture.append('<input class=time id=test3 value=00:00:00 />');
            $fixture.append('<input class=time id=test4 value=23:30:00 />');
            
            $('.time').qcTimepicker();
            
            el2 = document.getElementById('test2');
            el4 = document.getElementById('test4');
            
            $('#test2-qcTimepicker').val('12:30:00').trigger('change');
            
            $('#test2').qcTimepicker('stepDown');
            $('#test4').qcTimepicker('stepDown');
            
            throws(function() {
                $('#test1').qcTimepicker('stepDown');
            }, 'InvalidStateError');
            
            strictEqual(el2.value, '12:00:00');
            
            throws(function() {
                $('#test3').qcTimepicker('stepDown');
            }, 'InvalidStateError');
            
            strictEqual(el4.value, '23:00:00');
        },
        
        stepDownCustomStep: function() {
            var el2, el3;
            
            $fixture.append('<input class=time id=test1 />');
            $fixture.append('<input class=time id=test2 value=22:00:00 />');
            $fixture.append('<input class=time id=test3 value=14:00:00 />');
            $fixture.append('<input class=time id=test4 value=14:30:00 />');
            $fixture.append('<input class=time id=test5 value=00:00:00 />');
            
            $('.time').qcTimepicker({
                step: '02:00:00'
            });
            
            el2 = document.getElementById('test2');
            el3 = document.getElementById('test3');
            
            $('#test2').qcTimepicker('stepDown');
            $('#test3').qcTimepicker('stepDown');
            
            throws(function() {
                $('#test1').qcTimepicker('stepDown');
            }, 'InvalidStateError');
            
            strictEqual(el2.value, '20:00:00');
            strictEqual(el3.value, '12:00:00');
            
            throws(function() {
                $('#test4').qcTimepicker('stepDown');
            }, 'InvalidStateError');
            
            throws(function() {
                $('#test5').qcTimepicker('stepDown');
            }, 'InvalidStateError');
        },
        
        stepDownTime: function() {
            var el2, el3;
            
            $fixture.append('<input class=time type=time id=test1 />');
            $fixture.append('<input class=time type=time id=test2 value=23:30:00 />');
            $fixture.append('<input class=time type=time id=test3 value=14:00:00 />');
            $fixture.append('<input class=time type=time id=test4 value=00:00:00 />');
            
            $('.time').qcTimepicker();
            
            el2 = document.getElementById('test2');
            el3 = document.getElementById('test3');
            
            $('#test2').qcTimepicker('stepDown');
            $('#test3').qcTimepicker('stepDown');
            
            throws(function() {
                $('#test1').qcTimepicker('stepDown');
            }, 'InvalidStateError');
            
            ok(el2.value === '23:00:00' || el2.value === '23:00');
            ok(el3.value === '13:30:00' || el3.value === '13:30');
            
            throws(function() {
                $('#test4').qcTimepicker('stepDown');
            }, 'InvalidStateError');
        }
    };
    
    module('Tests', {
        setup: function() {
            $fixture = $('#qunit-fixture');
        }
    });
    
    for(t in tests) {
        if(tests.hasOwnProperty(t)) {
            test(t, tests[t]);
        }
    }
}(jQuery));