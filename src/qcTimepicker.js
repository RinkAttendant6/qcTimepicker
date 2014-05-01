/*jshint jquery: true */
;(function($) {
    'use strict';
    
    /**
     * Autoincrement number for inputs without identifiers
     * @type Number
     */
    var i = 0;

    /**
     * Converts a partial time into seconds of day
     * @param {!String} t A partial time as defined by RFC 3339
     * @returns {Number}
     */
    function timeToSeconds(t) {
        if(!/^\d+(:\d+){0,2}$/.test(t)) {
            throw 'InvalidArgumentException';
        }
        
        t = $.map(t.split(':'), function(part) {
            return parseInt(part, 10);
        });
        return ((t[0] * 3600 || 0) + (t[1] * 60 || 0) + (t[2] || 0)) % 86400;
    }
    
    /**
     * Converts a Date object into seconds of day
     * @param {Date} date A Date object
     * @returns {Number}
     */
    function dateInstanceToSeconds(date) {
        if(!(date instanceof Date)) {
            throw 'InvalidArgumentException';
        }
        
        return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    }
    
    /**
     * Pads a number with leading zeros
     * @param {!Number} num The number to pad
     * @param {!Number} [len=2] The desired length
     * @returns {String} The padded number
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
     * @param {String} format The format to use
     * @param {(!Number|!String)} seconds The seconds of the day
     * @returns {Object}
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
            'KK': padNumber(time.hours % 12),
            'K': time.hours % 12 + '',
            'mm': padNumber(time.minutes),
            'm': time.minutes + '',
            'ss': padNumber(time.seconds),
            's': time.seconds + '',
            'A': seconds * 1000 + '',
            'a': seconds < 43200 ? 'am' : 'pm'
        }, symbol;
        
        for (symbol in data) {
            if (data.hasOwnProperty(symbol)) {
                format = format.replace(new RegExp(symbol, 'g'), data[symbol]);
            }
        }
        
        return format;
    }
    
    /**
     * Sets the time of a dropdown
     * @param {String} time A partial-time as defined by RFC 3339
     * @param {HTMLSelectElement} dropdown The timepicker element
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
     * @type Object.<String, function>
     */
    var methods = {
        init: function(o) {
            var options = $.extend({}, $.fn.qcTimepicker.defaults, o);
            
            options.minTime = options.minTime instanceof Date ? dateInstanceToSeconds(options.minTime) : timeToSeconds(options.minTime);
            options.maxTime = options.maxTime instanceof Date ? dateInstanceToSeconds(options.maxTime) : timeToSeconds(options.maxTime);
            options.step = timeToSeconds(options.step);

            var select = document.createElement('select'), placeholderOpt = document.createElement('option'), time;
            placeholderOpt.value = '';
            select.appendChild(placeholderOpt);
            
            // Add classes
            if(options.classes) {
                if(typeof options.classes === 'object' && options.classes instanceof Array) {
                    $.each(options.classes, function(i, v) {
                        select.className += ' ' + v;
                    });
                    select.className = $.trim(select.className);
                } else if(typeof options.classes === 'string') {
                    select.className = options.classes;
                }
            }
            
            // Generate options
            for(time = options.minTime; time <= options.maxTime; time += options.step) {
                var opt = document.createElement('option');
                opt.innerHTML = formatTime(options.format, time);
                opt.value = formatTime('HH:mm:ss', time);
                
                select.appendChild(opt);
            }
            
            return this.filter('input').each(function() {
                var that = this, tSelect = select.cloneNode(true), labels, placeholderOpt;
                
                // Copy over current value if possible
                setTime(that.value, tSelect);
                    
                // Keep controls in sync
                tSelect.onchange = function() {
                    that.value = this.value;
                };
                
                that.onchange = function() {
                    setTime(this.value, tSelect);
                };
                
                // If input is required
                tSelect.required = (that.required || that.getAttribute('required') === 'required');
                
                // Placeholder
                tSelect.firstChild.innerHTML = that.getAttribute('placeholder') || options.placeholder;
                
                if(that.id) {
                    tSelect.id = that.id + '-qcTimepicker';
                } else {
                    tSelect.id = 'qcTimepicker-' + (i++);
                }
                
                // Change label references if necessary
                labels = $('label[for="' + that.id + '"]');
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
        }
    };
    
    /**
     * Calls to qcTimepicker
     * @param {(String|Object)} args
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
     */
    $.fn.qcTimepicker.defaults = {
        'classes': '',
        'format': 'H:mm',
        'minTime': '0:00:00',
        'maxTime': '23:59:59',
        'step': '0:30:00',
        'placeholder': '-'
    };
    
}(jQuery));