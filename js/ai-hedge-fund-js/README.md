# ai-hedge-fund-js

## Overview
The AI Hedge Fund project is a trading system that utilizes various AI agents to make informed trading decisions based on different investment strategies. The system integrates sentiment analysis, technical analysis, and fundamental analysis to optimize portfolio management and risk assessment.

## Project Structure
```
ai-hedge-fund-js
├── src
│   ├── agents
│   ├── graph
│   ├── llm
│   ├── utils
│   ├── config.js
│   └── main.js
├── tests
│   ├── agents
│   └── utils
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-hedge-fund-js.git
   ```
2. Navigate to the project directory:
   ```
   cd ai-hedge-fund-js
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To run the hedge fund trading system, execute the following command:
```
node src/main.js --tickers AAPL,GOOGL --start-date 2023-01-01 --end-date 2023-12-31
```
Replace `AAPL,GOOGL` with your desired stock tickers and adjust the dates as necessary.

## Configuration
Environment variables can be set in the `.env` file. Ensure to include any necessary API keys and configuration settings required for the agents and models.

## Testing
To run the tests for the agents and utilities, use the following command:
```
npm test
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.