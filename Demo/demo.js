/*global $*/
$('.timepicker', '#demo-basic').qcTimepicker();

$('.timepicker', '#demo-custom-range').qcTimepicker();

$('.timepicker', '#demo-custom-intervals').qcTimepicker();

$('#demo-custom-formats-1').qcTimepicker({
    format: 'h:mm a'
});

$('#demo-custom-formats-2').qcTimepicker({
    format: 'h:mm:ss a'
});

$('.timepicker', '#demo-placeholder').qcTimepicker();