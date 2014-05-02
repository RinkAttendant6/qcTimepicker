# qcTimepicker

Simple jQuery dropdown timepicker. Small, accessible, and highly customizable.

[**Demo**](http://jsfiddle.net/gh/get/jquery/edge/RinkAttendant6/qcTimepicker/tree/master/Demo)

[![License MPL-2.0](https://img.shields.io/badge/license-MPL--2.0-yellowgreen.svg)](https://github.com/RinkAttendant6/qcTimepicker/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/RinkAttendant6/qcTimepicker.svg?branch=master)](https://travis-ci.org/RinkAttendant6/qcTimepicker)
[![GitTip](https://img.shields.io/gittip/RinkAttendant6.svg)](https://www.gittip.com/RinkAttendant6/)

## Installation

### Bower (recommended)

    bower install qcTimepicker

### Manually

Download the qcTimepicker.min.js file in the `build/` directory. Optionally
download the source map file and unminified code (in the `src/` directory for 
debugging purposes.

## Usage

Load the plugin by including the script on the page:

```html
<script src='path/to/qcTimepicker.min.js' charset='utf-8'></script>
```

Alternatively, you may use a preloader such as Modernizr to load the plugin.

## Initialization

Initialize the plugin by calling the `.qcTimepicker()` function on a jQuery
object:

```js
$('.timepickers').qcTimepicker();
```

Please note that only `input` elements will be initialized.

Labels that are associated with the affected `input` element will be mapped to
the newly created dropdown element.

## Options

Options can be set during the initialization process by passing in an object
as a parameter:

```js
$('.timepickers').qcTimepicker({
    step: '0:15'
});
```

### classes

**Type:** string or Array

**Default:** '' (empty string)

If specified, the class(es) will be applied to the each of the dropdowns
created by qcTimepicker.

### format

**Type:** string

**Default:** 'H:mm'

The format of the time as displayed in the dropdown.
[ICU symbols](http://userguide.icu-project.org/formatparse/datetime) are used
for the format. Supported symbols include: a, h, hh, H, HH, k, kk, K, KK, m,
mm, s, ss, A

To insert a literal symbol into the output string, escape the character with a
backslash. Currently, output strings cannot contain backslashes.

### minTime

**Type:** string or Date

**Default:** '00:00:00' (midnight)

The minimum time (lower-bound of range) in the dropdown. The value must be
specified as a string in 24-hour format or as a Date object. If a string is
given, less-significant units may be omitted if they are zero. Hours are
required.

Examples:

  - '11' => '11:00:00'
  - '11:00' => '11:00:00'
  - '11:30' => '11:30:00'

Leading zeros may be omitted:

  - '11:3' => '11:03:00'

Awkward times will be converted if possible:

  - '11:90:87' => '12:31:27'
  - '28:30:00' => '04:30:00'

### maxTime

**Type:** string or Date

**Default:** '23:59:59'

The maximum time (upper-bound of range) in the dropdown. See `minTime` for
format.

### step

**Type:** string

**Default:** '0:30:00' (30 minutes)

The intervals of time displayed in the dropdown. See `minTime` for format (Date
objects are not permitted here.)

### placeholder

**Type:** string

**Default:** The text of an input element's `placeholder` attribute, if not present,
a hyphen will be displayed.

The text to display in the placeholder option. This is the first option
containing an empty value.

## Methods

### Toggle visibility

The visibility of the dropdown can be toggled by calling qcTimepicker with the
parameters `'show'` and `'hide'`, respectively.

```js
$('input').qcTimepicker('show');
$('input').qcTimepicker('hide');
```

### Destroy

To uninstantiate qcTimepicker and restore the original input, call qcTimepicker
with the `'destroy'` parameter:

```js
$('input').qcTimepicker('destroy');
```
