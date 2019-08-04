/*
* Create and export configuration variables
*/

// Dependencies
const dotenv = require('dotenv');
dotenv.config();

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort': 8081,
    'httpsPort': 8082,
    'envName': 'staging',
    'hashingSecret': 'thisisasecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid' : process.env.TWILIO_ACCOUNTSID,
        'authToken' : process.env.TWILIO_AUTHTOKEN,
        'fromPhone' : '+12052939482'
    }
    
};

// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
};


// Determine which environment was passed as a command line argument
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment above, if not, default to staging
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
