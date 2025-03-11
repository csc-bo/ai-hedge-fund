import api from '../tools/api.js';

// Test all endpoints for a given ticker
async function testAllEndpoints(ticker = 'AAPL') {
    try {
        console.log(`Testing all endpoints for ${ticker}...`);
        
        // Test price data
        console.log('\n1. Testing getPriceData:');
        const prices = await api.getPriceData(
            ticker, 
            '2023-01-01', 
            '2023-01-31'
        );
        console.log(`Found ${prices.length} price records`);
        console.log('Sample price:', prices[0]);

        // Test financial metrics
        console.log('\n2. Testing getFinancialMetrics:');
        const metrics = await api.getFinancialMetrics(
            ticker, 
            '2023-12-31'
        );
        console.log(`Found ${metrics.length} financial metrics`);
        console.log('Latest metrics:', metrics[0]);

        // Test company news
        console.log('\n3. Testing getCompanyNews:');
        const news = await api.getCompanyNews(
            ticker, 
            '2024-01-31', 
            '2023-12-31'
        );
        console.log(`Found ${news.length} news items`);
        console.log('Latest news:', news[0]);

        // Test market cap
        console.log('\n4. Testing getMarketCap:');
        const marketCap = await api.getMarketCap(
            ticker, 
            '2023-12-31'
        );
        console.log('Market Cap:', marketCap);

        // Test insider trades
        console.log('\n5. Testing getInsiderTrades:');
        const trades = await api.getInsiderTrades(
            ticker, 
            '2024-03-31',
            '2023-12-31'
        );
        console.log(`Found ${trades.length} insider trades`);
        console.log('Latest trade:', trades[0]);

        // Test line items
        console.log('\n6. Testing searchLineItems:');
        const lineItems = await api.searchLineItems(
            ticker,
            ['revenue', 'net_income', 'total_assets'],
            '2023-12-31'
        );
        console.log(`Found ${lineItems.length} line items`);
        console.log('Sample line items:', lineItems[0]);

    } catch (error) {
        console.error('Error during API testing:', error);
    }
}

// Test specific endpoint with custom parameters
async function testEndpoint(endpoint, params) {
    try {
        console.log(`Testing ${endpoint} with params:`, params);
        let result;

        switch(endpoint) {
            case 'prices':
                result = await api.getPriceData(
                    params.ticker,
                    params.startDate,
                    params.endDate
                );
                break;
            case 'metrics':
                result = await api.getFinancialMetrics(
                    params.ticker,
                    params.endDate,
                    params.period,
                    params.limit
                );
                break;
            case 'news':
                result = await api.getCompanyNews(
                    params.ticker,
                    params.endDate,
                    params.startDate,
                    params.limit
                );
                break;
            case 'trades':
                result = await api.getInsiderTrades(
                    params.ticker,
                    params.endDate,
                    params.startDate,
                    params.limit
                );
                break;
            case 'lineItems':
                result = await api.searchLineItems(
                    params.ticker,
                    params.items,
                    params.endDate,
                    params.period,
                    params.limit
                );
                break;
            default:
                throw new Error('Unknown endpoint');
        }

        console.log('Result:', result);
        return result;

    } catch (error) {
        console.error('Error testing endpoint:', error);
    }
}

// Example usage:
async function runTests() {
    // Test all endpoints for AAPL
    await testAllEndpoints('AAPL');

    // Test specific endpoint with custom parameters
    // await testEndpoint('metrics', {
    //     ticker: 'MSFT',
    //     endDate: '2023-12-31',
    //     period: 'quarterly',
    //     limit: 5
    // });
}

// Run the tests
runTests().then(() => console.log('Tests completed'));

// Export for use in other files
export { testAllEndpoints, testEndpoint, runTests };
