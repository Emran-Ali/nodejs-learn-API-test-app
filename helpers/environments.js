/* eslint-disable operator-linebreak */
// handle Environment variable

const environments = {};

environments.dev = {
    port: 3000,
    name: 'devlopment',
};

environments.production = {
    port: 4000,
    name: 'production',
};

const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'dev';

const envToExport =
    typeof environments[currentEnv] === 'object' ? environments[currentEnv] : environments.dev;
// export environment module
module.exports = envToExport;
