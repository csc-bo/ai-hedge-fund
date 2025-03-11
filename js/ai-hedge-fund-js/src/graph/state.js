class AgentState {
    constructor() {
        this.currentState = {};
    }

    setState(agentName, state) {
        this.currentState[agentName] = state;
    }

    getState(agentName) {
        return this.currentState[agentName] || null;
    }

    resetState() {
        this.currentState = {};
    }
}

export default AgentState;