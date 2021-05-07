# qcTimepicker

Simple jQuery dropdown timepicker. Small, accessible, and highly customizable.

[**Demo**](https://rinkattendant6.github.io/qcTimepicker/)

[**Documentation**](https://documentup.com/RinkAttendant6/qcTimepicker)

[![License MPL-2.0](https://img.shields.io/badge/license-MPL--2.0-yellowgreen.svg)](https://github.com/RinkAttendant6/qcTimepicker/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/RinkAttendant6/qcTimepicker.svg?branch=master)](https://travis-ci.org/RinkAttendant6/qcTimepicker)

## Installation

### Bower (recommended)

    bower install qcTimepicker

### Manually

Download the files in the `dist/` directory.

## Usage

Load the plugin by including the script on the page:

```html
<script src='path/to/qcTimepicker.min.js' charset='utf-8'></script>
```

## Initialization

Initialize the plugin by calling the `.qcTimepicker()` function on a jQuery
object:

```js
$('.timepickers').qcTimepicker();
```

Please note that only `input` elements will be initialized.

It is strongly recommended that the input elements have the type `time`,
although all inputs that match the selector will be initialized.

Labels that are associated with the affected `input` element will be mapped to
the newly created dropdown element.

## Options

Options can be set during the initialization process by passing in an object
as a parameter:

```js
$('.timepickers').qcTimepicker({
    step: 900
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

Ignored if a `min` attribute is specified on the element of initialization.

**If the `min` attribute in the HTML is used, the value MUST be specified in
the official format: `HH:mm:ss` (Hours and minutes separated by colons,
optionally followed by a colon and number of seconds. Leading zeros are
required on all parts.)**

### maxTime

**Type:** string or Date

**Default:** '23:59:59'

The maximum time (upper-bound of range) in the dropdown. See `minTime` for
format.

Ignored if a `max` attribute is specified on the element of initialization.

**If the `max` attribute in the HTML is used, the value MUST be specified in
the official format: `HH:mm:ss` (Hours and minutes separated by colons,
optionally followed by a colon and number of seconds. Leading zeros are
required on all parts.)**

### step

**Type:** number

**Default:** 1800 (30 minutes)

The intervals of time displayed in the dropdown. The value represents the
number of seconds between each interval.

Ignored if a `step` attribute is specified on the element of initialization.

### placeholder

**Type:** string

**Default:** The text of an input element's `placeholder` attribute, if not present,
a hyphen will be displayed.

The text to display in the placeholder option. This is the first option
containing an empty value.

Ignored if a `data-placeholder` attribute or `placeholder` attribute is
specified on the element of initialization.

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

### Step (increment and decrement)

To programatically increment or decrement the value in accordance with the
`step`, call qcTimepicker with the `stepUp` or `stepDown` parameters,
respectively.

This behaviour is consistent with the methods
[`stepUp`](https://www.w3.org/TR/html51/forms.html#dom-input-stepup) and 
[`stepDown`](https://http://www.w3.org/TR/html51/forms.html#dom-input-stepdown)
on the [`HTMLInputElement`](https://developer.mozilla.org/en/docs/Web/API/HTMLInputElement)
interface.

```html
<input value='08:00:00'>
```

```js
$('input').qcTimepicker({
    step: '02:00:00'
});

$('input').qcTimepicker('stepUp');
$('input').val() // returns 10:00:00

$('input').qcTimepicker('stepDown');
// Time is now back to 8:00
$('input').val() // returns 08:00:00
```

### Numeric and date values

qcTimepicker supports retrieving the time value as a number or a JavaScript
Date object. In the case of a number, the value returned is in milliseconds.

This behaviour is consistent with the properties
[`valueAsNumber`](https://www.w3.org/TR/html51/forms.html#dom-input-valueasnumber)
and [`valueAsDate`](https://www.w3.org/TR/html51/forms.html#dom-input-valueasdate)
on the [`HTMLInputElement`](https://developer.mozilla.org/en/docs/Web/API/HTMLInputElement)
interface.

```html
<input value='08:00:00'>
```

```js
$('input').qcTimepicker();

// As a number
var foo = $('input').qcTimepicker('valueAsNumber');
console.log(foo); // outputs 28800000

// As a Date
var bar = $('input').qcTimepicker('valueAsDate');

// The string output above differs based on your computer's current time zone
console.log(bar); // outputs Thu Jan 01 1970 03:00:00 GMT-0500 (Eastern Standard Time)

// Call getTime() or valueOf() for a primitive value
console.log(bar.getTime()); // outputs 28800000
```