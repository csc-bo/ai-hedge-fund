export class Cache {
    constructor() {
        this.priceCache = new Map();
        this.financialMetricsCache = new Map();
        this.lineItemsCache = new Map();
        this.insiderTradesCache = new Map();
        this.companyNewsCache = new Map();
    }

    mergeData(existing, newData, keyField) {
        if (!existing) return newData;
        
        const existingKeys = new Set(existing.map(item => item[keyField]));
        const merged = [...existing];
        newData.forEach(item => {
            if (!existingKeys.has(item[keyField])) {
                merged.push(item);
            }
        });
        return merged;
    }

    // Price methods
    getPrices(ticker) {
        return this.priceCache.get(ticker);
    }

    setPrices(ticker, prices) {
        this.priceCache.set(ticker, prices);
    }

    // Financial Metrics
    getFinancialMetrics(ticker) {
        return this.financialMetricsCache.get(ticker);
    }

    setFinancialMetrics(ticker, data) {
        this.financialMetricsCache.set(
            ticker, 
            this.mergeData(this.getFinancialMetrics(ticker), data, 'report_period')
        );
    }

    // Line Items
    getLineItems(ticker) {
        return this.lineItemsCache.get(ticker);
    }

    setLineItems(ticker, data) {
        this.lineItemsCache.set(
            ticker, 
            this.mergeData(this.getLineItems(ticker), data, 'report_period')
        );
    }

    // Insider Trades
    getInsiderTrades(ticker) {
        return this.insiderTradesCache.get(ticker);
    }

    setInsiderTrades(ticker, data) {
        this.insiderTradesCache.set(
            ticker, 
            this.mergeData(this.getInsiderTrades(ticker), data, 'filing_date')
        );
    }

    // Company News
    getCompanyNews(ticker) {
        return this.companyNewsCache.get(ticker);
    }

    setCompanyNews(ticker, data) {
        this.companyNewsCache.set(
            ticker, 
            this.mergeData(this.getCompanyNews(ticker), data, 'date')
        );
    }

    clear() {
        this.priceCache.clear();
        this.financialMetricsCache.clear();
        this.lineItemsCache.clear();
        this.insiderTradesCache.clear();
        this.companyNewsCache.clear();
    }
}
