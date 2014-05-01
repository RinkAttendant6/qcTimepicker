/*jslint browser: true, evil: true */
(function() {
    'use strict';
    var parts = document.location.search.slice(1).split('&'),
        length = parts.length,
        i,
        current,
        version = 'latest',
        file = '../lib/jquery/dist/jquery.min.js';

    for (i = 0; i < length; i += 1) {
        current = parts[ i ].split('=');
        if (current[ 0 ] === 'jquery') {
            version = current[ 1 ];
            break;
        }
    }

    if (version !== 'latest') {
        file = 'https://ajax.googleapis.com/ajax/libs/jquery/' + version + '/jquery.min.js';
    }

    document.write('<script src="' + file + '"></script>');
}());