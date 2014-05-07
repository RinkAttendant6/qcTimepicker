/*jshint devel: true, jquery: true */
;(function($) {
    'use strict';
    
    /**
     * Autoincrement number for inputs without identifiers
     * @type number
     */
    var i = 0;
    
    function validPartialTime(t) {
        return /^([0-1]?[0-9]|[2][0-3]):([0-5][0-9])(:([0-5][0-9]))?$/.test(t);
    }

    /**
     * Converts a partial time into seconds of day
     * @param {string} t A partial time as defined by RFC 3339
     * @param {boolean} [strict=false] Whether malformed partial times are accepted
     * @returns {number}
     */
    function timeToSeconds(t, strict) {
        var regex;
        
        strict = strict || false;
        regex = (strict ? /^([0-1]?[0-9]|[2][0-3]):([0-5][0-9])(:([0-5][0-9]))?$/ : /^\d+(:\d+){0,2}$/);
        
        if (!regex.test(t)) {
            throw 'InvalidArgumentException';
        }
        
        t = $.map(t.split(':'), function(part) {
            return parseInt(part, 10);
        });
        return ((t[0] * 3600 || 0) + (t[1] * 60 || 0) + (t[2] || 0)) % 86400;
    }
    
    /**
     * Converts a Date object into seconds of day
     * @param {!Date} date A Date object
     * @returns {number}
     */
    function dateInstanceToSeconds(date) {
        if(!(date instanceof Date)) {
            throw 'InvalidArgumentException';
        }
        
        return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    }
    
    /**
     * Pads a number with leading zeros
     * @param {(number|string)} num The number to pad
     * @param {number} [len=2] The desired length
     * @returns {string} The padded number
     */
    function padNumber(num, len) {
        len = len || 2;
        num = num+'';
        
        if(num.length >= len) {
            return num;
        }
        
        var arr = [];
        arr.length = len + 1 - num.length;
        return arr.join('0') + num;
    }
    
    /**
     * Formats a time according to ICU formats
     * @param {string} format The format to use
     * @param {(number|string)} seconds The seconds of the day
     * @returns {string}
     */
    function formatTime(format, seconds) {
        seconds = Number(seconds);
        
        var time = {
            hours: Math.floor(seconds / 3600),
            minutes: Math.floor(seconds % 3600 / 60),
            seconds: seconds % 60
        },
        
        data = {
            'hh': padNumber((time.hours % 12) || 12),
            'h': ((time.hours % 12) || 12) + '',
            'HH': padNumber(time.hours),
            'H': time.hours + '',
            'kk': padNumber(time.hours + 1),
            'k': time.hours + 1 + '',
            'KK': padNumber(time.hours % 12 + 1),
            'K': time.hours % 12 + 1 + '',
            'mm': padNumber(time.minutes),
            'm': time.minutes + '',
            'ss': padNumber(time.seconds),
            's': time.seconds + '',
            'A': seconds * 1000 + '',
            'a': seconds < 43200 ? 'am' : 'pm'
        }, symbol, regexCallback;
        
        regexCallback = function($0, $1, $2) {
            return $1 ? $0 : data[$2];
        };
        
        for (symbol in data) {
            if (data.hasOwnProperty(symbol)) {
                format = format.replace(new RegExp('(\\\\)?(' + symbol + ')', 'g'), regexCallback);
            }
        }
        
        // Strip slashes
        return format.replace(/\\/g, '');
    }
    
    /**
     * Sets the time of a dropdown
     * @param {string} time A partial-time as defined by RFC 3339
     * @param {!HTMLSelectElement} dropdown The timepicker element
     */
    function setTime(time, dropdown) {
        if($(dropdown.children).filter(function() {
            return this.value === time;
        }).length) {
            // Value exists in dropdown
            dropdown.value = time;
        }
    }
    
    /**
     * Methods available to qcTimepicker
     * @type Object.<string, function(...[object])>
     */
    var methods = {
        init: function(o) {
            var select = document.createElement('select'),
                placeholderOpt = document.createElement('option');

            placeholderOpt.value = '';
            select.appendChild(placeholderOpt);
            
            return this.filter('input').each(function() {
                var that = this,
                    tSelect = select.cloneNode(true),
                    opt,
                    labels = $('label[for="' + that.id + '"]'),
                    options, time;
                    
                options = $.extend({}, $.fn.qcTimepicker.defaults, o);
                
                // Prevent double-instantiation
                if(that.getAttribute('data-qctimepicker-id')) {
                    return;
                }
            
                // Add classes
                if(options.classes) {
                    if(typeof options.classes === 'object' && options.classes instanceof Array) {
                        $.each(options.classes, function(i, v) {
                            tSelect.className += ' ' + v;
                        });
                        tSelect.className = $.trim(tSelect.className);
                    } else if(typeof options.classes === 'string') {
                        tSelect.className = options.classes;
                    }
                }
                
                // Take into account max and min attributes where present
                if ((that.min || that.getAttribute('min')) && validPartialTime(that.min || that.getAttribute('min'))) {
                    options.minTime = timeToSeconds(that.min || that.getAttribute('min'), true);
                } else if (options.minTime instanceof Date) {
                    options.minTime = dateInstanceToSeconds(options.minTime);
                } else {
                    options.minTime = timeToSeconds(options.minTime);
                }
                
                if ((that.max || that.getAttribute('max')) && validPartialTime(that.max || that.getAttribute('max'))) {
                    options.maxTime = timeToSeconds(that.max || that.getAttribute('max'), true);
                } else if (options.maxTime instanceof Date) {
                    options.maxTime = dateInstanceToSeconds(options.maxTime);
                } else {
                    options.maxTime = timeToSeconds(options.maxTime);
                }

                // Take into account step attribute where present
                options.step = Number(that.step) ||
                               (that.getAttribute('step') ? Number(that.getAttribute('step')) : null) ||
                               (that.step === 'any' || that.getAttribute('step') === 'any' ? 1 : null) ||
                               options.step;
                
                if (typeof options.step !== 'number' || isNaN(options.step) || options.step <= 0 || options.step % 1 !== 0) {
                    options.step = $.fn.qcTimepicker.defaults.step;
                }

                // Generate options
                for(time = options.minTime; time <= options.maxTime; time += options.step) {
                    opt = document.createElement('option');
                    opt.innerHTML = formatTime(options.format, time);
                    opt.value = formatTime('HH:mm:ss', time);

                    tSelect.appendChild(opt);
                }
                
                // Copy over current value if possible
                setTime(that.value, tSelect);
                    
                // Keep controls in sync
                tSelect.onchange = function() {
                    that.value = this.value;
                };
                
                that.onchange = function() {
                    setTime(this.value, tSelect);
                };
                
                // If input is time, copy over properties as required
                if (that.type === 'time') {
                    that.step = options.step;
                    that.min = formatTime('HH:mm:ss', options.minTime);
                    that.max = formatTime('HH:mm:ss', options.maxTime);
                }
                
                // If input is required
                tSelect.required = (that.required || that.getAttribute('required') === 'required');
                
                // If input is disabled or readonly
                tSelect.disabled = that.readOnly || that.disabled;
                
                // Placeholder
                tSelect.firstChild.innerHTML = (that.dataset ? that.dataset.placeholder : false) || that.getAttribute('data-placeholder') || that.placeholder || that.getAttribute('placeholder') || options.placeholder;
                
                if(that.id) {
                    tSelect.id = that.id + '-qcTimepicker';
                } else {
                    tSelect.id = 'qcTimepicker-' + (i++);
                }
                
                // Change label references if necessary
                if(labels.length) {
                    $.each(labels, function(i, v) {
                        v.htmlFor = that.id + '-qcTimepicker';
                    });
                }
                
                // Append it!
                that.parentNode.insertBefore(tSelect, that.nextSibling);
                that.setAttribute('data-qctimepicker-id', tSelect.id);
                
                // Hide the input and make it non-focusable
                that._origDisplay = that.style.display;
                that._origTabIndex = that.tabIndex;
                
                that.style.display = 'none';
                that.tabIndex = -1;
            }).end();
        },
        
        hide: function() {
            return this.filter('input').each(function() {
                $('#' + this.getAttribute('data-qctimepicker-id')).hide();
            }).end();
        },
        
        show: function() {
            return this.filter('input').each(function() {
                $('#' + this.getAttribute('data-qctimepicker-id')).show();
            }).end();
        },
        
        destroy: function() {
            return this.filter('input[data-qctimepicker-id]').each(function() {
                var el = document.getElementById(this.getAttribute('data-qctimepicker-id'));
                el.parentNode.removeChild(el);
                
                this.style.display = this._origDisplay;
                this.tabIndex = this._origTabIndex;
                this.removeAttribute('data-qctimepicker-id');
            }).end();
        },
        
        options: function(o) {
            return this.filter('input[data-qctimepicker-id]').each(function() {
                var el = document.getElementById(this.getAttribute('data-qctimepicker-id'));
                
                if(o.hasOwnProperty('required')) {
                    el.required = o.required;
                }
            }).end();
        },
        
        valueAsDate: function() {
            var input = this.filter('input[data-qctimepicker-id]')[0];
            if (input.value === '') {
                return null;
            }
            return input.valueAsDate || (new Date('Thu, 1 Jan 1970 ' + input.value + ' GMT'));
        },
        
        valueAsNumber: function() {
            var input = this.filter('input[data-qctimepicker-id]')[0];
            if (input.value === '') {
                return Number.NaN;
            }
            return input.type === 'time' ? input.valueAsNumber : Date.parse('Thu, 1 Jan 1970 ' + input.value + ' GMT');
        },
        
        stepUp: function() {
            return this.filter('input[data-qctimepicker-id]').each(function() {
                var el = document.getElementById(this.getAttribute('data-qctimepicker-id'));
                
                if (this.value === '' || el.selectedIndex === 0 || el.selectedIndex === el.children.length - 1) {
                    throw 'InvalidStateError';
                }
                
                el.selectedIndex += 1;
                $(el).trigger('change');
            }).end();
        },
        
        stepDown: function() {
            return this.filter('input[data-qctimepicker-id]').each(function() {
                var el = document.getElementById(this.getAttribute('data-qctimepicker-id'));
                
                if (this.value === '' || el.selectedIndex <= 1) {
                    throw 'InvalidStateError';
                }
                
                el.selectedIndex -= 1;
                $(el).trigger('change');
            }).end();
        }
    };
    
    /**
     * Calls to qcTimepicker
     * @param {(string|Object)=} args
     */
    $.fn.qcTimepicker = function(args) {
    
        if (methods[args]) {
            return methods[args].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        
        if (typeof args === 'object' || !args) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        }
        
        $.error('Method ' + args + ' does not exist on jQuery.qcTimepicker');
    };
    
    /**
     * Default options
     * @struct
     */
    $.fn.qcTimepicker.defaults = {
        classes: '',
        format: 'H:mm',
        minTime: '0:00:00',
        maxTime: '23:59:59',
        step: 1800,
        placeholder: '-'
    };
    
}(jQuery));