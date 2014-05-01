$(document).ready(function() {
    $('.timepicker', '#demo-basic').qcTimepicker();

    $('.timepicker', '#demo-custom-range').qcTimepicker({
        minTime: '8:30',
        maxTime: '15:30'
    });

    $('.timepicker', '#demo-custom-intervals').qcTimepicker({
        minTime: '8:30',
        maxTime: '15:30',
        step: '0:90'
    });

    $('#demo-custom-formats-1').qcTimepicker({
        minTime: '8:30',
        maxTime: '15:30',
        step: '0:90',
        format: 'h:mm a'
    });

    $('#demo-custom-formats-2').qcTimepicker({
        minTime: '8:30',
        maxTime: '15:30',
        step: '0:90',
        format: 'h:mm::ss a'
    });

    $('.timepicker', '#demo-placeholder').qcTimepicker({
        minTime: '8:30',
        maxTime: '15:30',
        step: '0:90'
    });
});