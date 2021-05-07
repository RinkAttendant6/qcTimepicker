import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
    runQunitPuppeteer,
    printResultSummary,
    printFailedTests,
} from 'node-qunit-puppeteer';

try {
    const result = await runQunitPuppeteer({
        targetUrl: `file://${path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            'index.html'
        )}`,
        redirectConsole: true,
    });

    printResultSummary(result, console);

    if (result.stats.failed > 0) {
        printFailedTests(result, console);
    }
} catch (ex) {
    console.error(ex);
}
