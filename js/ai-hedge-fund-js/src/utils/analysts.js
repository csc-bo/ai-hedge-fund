const ANALYST_ORDER = [
    { display: "Ben Graham", value: "benGraham" },
    { display: "Bill Ackman", value: "billAckman" },
    { display: "Fundamentals", value: "fundamentals" },
    { display: "Portfolio Manager", value: "portfolioManager" },
    { display: "Risk Manager", value: "riskManager" },
    { display: "Sentiment", value: "sentiment" },
    { display: "Technical Analyst", value: "technicals" },
    { display: "Valuation", value: "valuation" },
    { display: "Warren Buffett", value: "warrenBuffett" },
];

const get_analyst_nodes = () => {
    return ANALYST_ORDER.reduce((acc, analyst) => {
        acc[analyst.value] = [analyst.value, require(`../agents/${analyst.value}.js`)];
        return acc;
    }, {});
};

module.exports = {
    ANALYST_ORDER,
    get_analyst_nodes,
};