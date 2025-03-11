export function printTradingOutput(result) {
    console.log("Trading Decisions:");
    console.table(result.decisions);
    
    console.log("Analyst Signals:");
    console.table(result.analyst_signals);
}

export function displayError(message) {
    console.error(`Error: ${message}`);
}

export function displayInfo(message) {
    console.info(`Info: ${message}`);
}