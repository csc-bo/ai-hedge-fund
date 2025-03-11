const config = {
    apiKey: process.env.API_KEY || 'your-default-api-key',
    dbConnectionString: process.env.DB_CONNECTION_STRING || 'your-default-db-connection-string',
    tradingPlatformUrl: process.env.TRADING_PLATFORM_URL || 'https://default.tradingplatform.com',
    logLevel: process.env.LOG_LEVEL || 'info',
};

module.exports = config;