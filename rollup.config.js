import pkg from './package.json';
import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

const header = `/*! ${pkg.name} - v${pkg.version} | (c) ${(new Date()).getFullYear()} ${pkg.author}
Licensed under the Mozilla Public License, version 2.0 */`;

export default {
    external: ['jquery'],
    input: 'src/qcTimepicker.js',
    output: {
        name: 'qcTimepicker',
        file: pkg.browser,
        format: 'iife',
        globals: {
            jquery: '$'
        },
        sourcemap: true
    },
    plugins: [
        clear({
            targets: ['dist']
        }),
        copy({
            targets: [
                {
                    src: 'src/qcTimepicker.js',
                    dest: 'dist/'
                }
            ]
        }),
        terser({
            format: {
                preamble: header
            }
        })
    ]
};
