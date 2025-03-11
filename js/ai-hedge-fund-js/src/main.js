import dotenv from 'dotenv';
import { HumanMessage } from 'langchain/schema';
import { StateGraph } from 'langgraph';
import chalk from 'chalk'; // replacing colorama
import inquirer from 'inquirer'; // replacing questionary
import { benGrahamAgent } from './agents/benGraham.js';
import { billAckmanAgent } from './agents/billAckman.js';
import { fundamentalsAgent } from './agents/fundamentals.js';
import { portfolioManagementAgent } from './agents/portfolioManager.js';
import { technicalAnalystAgent } from './agents/technicals.js';
import { riskManagementAgent } from './agents/riskManager.js';
import { sentimentAgent } from './agents/sentiment.js';
import { warrenBuffettAgent } from './agents/warrenBuffett.js';
import { AgentState } from './graph/state.js';
import { valuationAgent } from './agents/valuation.js';
import { printTradingOutput } from './utils/display.js';
import { ANALYST_ORDER, getAnalystNodes } from './utils/analysts.js';
import { progress } from './utils/progress.js';
import { LLM_ORDER, getModelInfo } from './llm/models.js';
import { saveGraphAsPng } from './utils/visualize.js';

// Load environment variables
dotenv.config();

const parseHedgeFundResponse = (response) => {
    try {
        return JSON.parse(response);
    } catch (e) {
        if (e instanceof SyntaxError) {
            console.error(`JSON parsing error: ${e}\nResponse: ${JSON.stringify(response)}`);
        } else if (e instanceof TypeError) {
            console.error(`Invalid response type (expected string, got ${typeof response}): ${e}`);
        } else {
            console.error(`Unexpected error while parsing response: ${e}\nResponse: ${JSON.stringify(response)}`);
        }
        return null;
    }
};

const runHedgeFund = async ({
    tickers,
    startDate,
    endDate,
    portfolio,
    showReasoning = false,
    selectedAnalysts = [],
    modelName = 'gpt-4',
    modelProvider = 'OpenAI'
}) => {
    progress.start();

    try {
        // Create workflow based on selected analysts
        const workflow = selectedAnalysts.length 
            ? createWorkflow(selectedAnalysts)
            : app;

        const finalState = await workflow.invoke({
            messages: [
                new HumanMessage({
                    content: 'Make trading decisions based on the provided data.'
                })
            ],
            data: {
                tickers,
                portfolio,
                startDate,
                endDate,
                analystSignals: {}
            },
            metadata: {
                showReasoning,
                modelName,
                modelProvider
            }
        });

        return {
            decisions: parseHedgeFundResponse(finalState.messages[finalState.messages.length - 1].content),
            analystSignals: finalState.data.analystSignals
        };
    } finally {
        progress.stop();
    }
};

const start = (state) => {
    return state;
};

const createWorkflow = (selectedAnalysts = null) => {
    const workflow = new StateGraph(AgentState);
    workflow.addNode('start_node', start);

    const analystNodes = getAnalystNodes();
    const analysts = selectedAnalysts || Object.keys(analystNodes);

    // Add selected analyst nodes
    analysts.forEach(analystKey => {
        const [nodeName, nodeFunc] = analystNodes[analystKey];
        workflow.addNode(nodeName, nodeFunc);
        workflow.addEdge('start_node', nodeName);
    });

    // Add risk and portfolio management
    workflow.addNode('risk_management_agent', riskManagementAgent);
    workflow.addNode('portfolio_management_agent', portfolioManagementAgent);

    // Connect analysts to risk management
    analysts.forEach(analystKey => {
        const [nodeName] = analystNodes[analystKey];
        workflow.addEdge(nodeName, 'risk_management_agent');
    });

    workflow.addEdge('risk_management_agent', 'portfolio_management_agent');
    workflow.addEdge('portfolio_management_agent', 'END');

    workflow.setEntryPoint('start_node');
    return workflow;
};

export {
    runHedgeFund,
    createWorkflow,
    parseHedgeFundResponse
};