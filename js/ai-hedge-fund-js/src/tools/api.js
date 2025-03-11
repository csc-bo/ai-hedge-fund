import { Cache } from '../data/cache.js';
import { config } from '../config/config.js';

class ApiClient {
    constructor() {
        this.cache = new Cache();
        this.baseUrl = 'https://api.financialdatasets.ai';
        this.apiKey = config.FINANCIAL_DATASETS_API_KEY;
    }

    async getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.apiKey) {
            headers['X-API-KEY'] = this.apiKey;
        }
        return headers;
    }

    async getPrices(ticker, startDate, endDate) {
        // Check cache first
        const cachedData = this.cache.getPrices(ticker);
        if (cachedData) {
            const filteredData = cachedData.filter(
                price => startDate <= price.time && price.time <= endDate
            );
            if (filteredData.length > 0) {
                return filteredData;
            }
        }

        // If not in cache or no data in range, fetch from API
        const url = `${this.baseUrl}/prices/?ticker=${ticker}&interval=day&interval_multiplier=1&start_date=${startDate}&end_date=${endDate}`;
        
        const response = await fetch(url, {
            headers: await this.getHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${ticker} - ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        const prices = data.prices;

        if (!prices || prices.length === 0) {
            return [];
        }

        // Cache the results
        this.cache.setPrices(ticker, prices);
        return prices;
    }

    pricesToDataFrame(prices) {
        // Convert prices to a structure similar to pandas DataFrame
        const df = prices.map(p => ({
            date: new Date(p.time),
            open: Number(p.open),
            close: Number(p.close),
            high: Number(p.high),
            low: Number(p.low),
            volume: Number(p.volume)
        }));

        // Sort by date
        return df.sort((a, b) => a.date - b.date);
    }

    async getPriceData(ticker, startDate, endDate) {
        const prices = await this.getPrices(ticker, startDate, endDate);
        return this.pricesToDataFrame(prices);
    }

    async getFinancialMetrics(ticker, endDate, period = 'ttm', limit = 10) {
        const cachedData = this.cache.getFinancialMetrics(ticker);
        if (cachedData) {
            const filteredData = cachedData
                .filter(metric => metric.report_period <= endDate)
                .sort((a, b) => b.report_period.localeCompare(a.report_period))
                .slice(0, limit);
            if (filteredData.length > 0) {
                return filteredData;
            }
        }

        const url = `${this.baseUrl}/financial-metrics/?ticker=${ticker}&report_period_lte=${endDate}&limit=${limit}&period=${period}`;
        const response = await fetch(url, { headers: await this.getHeaders() });
        
        if (!response.ok) {
            throw new Error(`Error fetching financial metrics: ${response.status}`);
        }

        const data = await response.json();
        const metrics = data.financial_metrics;

        if (metrics && metrics.length > 0) {
            this.cache.setFinancialMetrics(ticker, metrics);
        }
        return metrics || [];
    }

    async searchLineItems(ticker, lineItems, endDate, period = 'ttm', limit = 10) {
        const url = `${this.baseUrl}/financials/search/line-items`;
        const body = {
            tickers: [ticker],
            line_items: lineItems,
            end_date: endDate,
            period: period,
            limit: limit,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: await this.getHeaders(),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error fetching line items: ${response.status}`);
        }

        const data = await response.json();
        return data.search_results || [];
    }

    async getInsiderTrades(ticker, endDate, startDate = null, limit = 1000) {
        const cachedData = this.cache.getInsiderTrades(ticker);
        if (cachedData) {
            const filteredData = cachedData
                .filter(trade => {
                    const tradeDate = trade.transaction_date || trade.filing_date;
                    return (!startDate || tradeDate >= startDate) && tradeDate <= endDate;
                })
                .sort((a, b) => {
                    const dateA = a.transaction_date || a.filing_date;
                    const dateB = b.transaction_date || b.filing_date;
                    return dateB.localeCompare(dateA);
                });
            if (filteredData.length > 0) {
                return filteredData;
            }
        }

        const allTrades = [];
        let currentEndDate = endDate;

        while (true) {
            let url = `${this.baseUrl}/insider-trades/?ticker=${ticker}&filing_date_lte=${currentEndDate}&limit=${limit}`;
            if (startDate) {
                url += `&filing_date_gte=${startDate}`;
            }

            const response = await fetch(url, { headers: await this.getHeaders() });
            if (!response.ok) {
                throw new Error(`Error fetching insider trades: ${response.status}`);
            }

            const data = await response.json();
            const trades = data.insider_trades;

            if (!trades || trades.length === 0) break;
            
            allTrades.push(...trades);

            if (!startDate || trades.length < limit) break;

            currentEndDate = trades
                .map(t => t.filing_date)
                .reduce((a, b) => a < b ? a : b)
                .split('T')[0];

            if (currentEndDate <= startDate) break;
        }

        if (allTrades.length > 0) {
            this.cache.setInsiderTrades(ticker, allTrades);
        }
        return allTrades;
    }

    async getCompanyNews(ticker, endDate, startDate = null, limit = 1000) {
        const cachedData = this.cache.getCompanyNews(ticker);
        if (cachedData) {
            const filteredData = cachedData
                .filter(news => (!startDate || news.date >= startDate) && news.date <= endDate)
                .sort((a, b) => b.date.localeCompare(a.date));
            if (filteredData.length > 0) {
                return filteredData;
            }
        }

        const allNews = [];
        let currentEndDate = endDate;

        while (true) {
            let url = `${this.baseUrl}/news/?ticker=${ticker}&end_date=${currentEndDate}&limit=${limit}`;
            if (startDate) {
                url += `&start_date=${startDate}`;
            }

            const response = await fetch(url, { headers: await this.getHeaders() });
            if (!response.ok) {
                throw new Error(`Error fetching company news: ${response.status}`);
            }

            const data = await response.json();
            const news = data.news;

            if (!news || news.length === 0) break;
            
            allNews.push(...news);

            if (!startDate || news.length < limit) break;

            currentEndDate = news
                .map(n => n.date)
                .reduce((a, b) => a < b ? a : b)
                .split('T')[0];

            if (currentEndDate <= startDate) break;
        }

        if (allNews.length > 0) {
            this.cache.setCompanyNews(ticker, allNews);
        }
        return allNews;
    }

    async getMarketCap(ticker, endDate) {
        const metrics = await this.getFinancialMetrics(ticker, endDate);
        return metrics.length > 0 ? metrics[0].market_cap : null;
    }
}

export default new ApiClient();
