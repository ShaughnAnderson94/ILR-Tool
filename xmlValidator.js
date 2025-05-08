const log = require('electron-log');
log.info('worker running')
const { parentPort, workerData } = require('worker_threads');
const xmllint = require('xmllint');
if(xmllint){log.info('xmllint defined')}
    const { xml, xsd } = workerData;

try {
    let result = xmllint.validateXML({ xml, schema: xsd });
    log.info('result in worker ', result)
    parentPort.postMessage({ valid: !result.errors || result.errors.length === 0, errors: result.errors });
    log.info('error not occuring in post messages')
} catch (error) {
    parentPort.postMessage({ valid: false, errors: [error.message] });
} 