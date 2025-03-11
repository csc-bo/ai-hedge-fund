class PortfolioManager {
    constructor(initialCash) {
        this.portfolio = {
            cash: initialCash,
            positions: {},
            realizedGains: {}
        };
    }

    addPosition(ticker, amount, costBasis) {
        if (!this.positions[ticker]) {
            this.positions[ticker] = { long: 0, short: 0, longCostBasis: 0, shortCostBasis: 0 };
        }
        this.positions[ticker].long += amount;
        this.positions[ticker].longCostBasis = ((this.positions[ticker].longCostBasis * this.positions[ticker].long) + (costBasis * amount)) / (this.positions[ticker].long + amount);
        this.cash -= costBasis * amount;
    }

    sellPosition(ticker, amount, sellPrice) {
        if (this.positions[ticker] && this.positions[ticker].long >= amount) {
            this.positions[ticker].long -= amount;
            const gain = (sellPrice - this.positions[ticker].longCostBasis) * amount;
            this.realizedGains[ticker] = (this.realizedGains[ticker] || 0) + gain;
            this.cash += sellPrice * amount;
        } else {
            throw new Error("Not enough shares to sell");
        }
    }

    getPortfolioValue(currentPrices) {
        let totalValue = this.cash;
        for (const ticker in this.positions) {
            if (this.positions.hasOwnProperty(ticker)) {
                totalValue += this.positions[ticker].long * (currentPrices[ticker] || 0);
            }
        }
        return totalValue;
    }
}

export default PortfolioManager;