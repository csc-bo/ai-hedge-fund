import { ChatAnthropic } from '@langchain/anthropic';
// import { ChatDeepSeek } from 'langchain-deepseek';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';
import { ChatOpenAI } from '@langchain/openai';

// Enum equivalent for ModelProvider
const ModelProvider = Object.freeze({
    ANTHROPIC: "Anthropic",
    DEEPSEEK: "DeepSeek",
    GEMINI: "Gemini",
    GROQ: "Groq",
    OPENAI: "OpenAI"
});

class LLMModel {
    constructor(displayName, modelName, provider) {
        this.display_name = displayName;
        this.model_name = modelName;
        this.provider = provider;
    }

    toChoiceTuple() {
        return [this.display_name, this.model_name, this.provider];
    }

    hasJsonMode() {
        return !this.isDeepseek() && !this.isGemini();
    }

    isDeepseek() {
        return this.model_name.startsWith("deepseek");
    }

    isGemini() {
        return this.model_name.startsWith("gemini");
    }
}

// Define available models
const AVAILABLE_MODELS = [
    new LLMModel("[anthropic] claude-3.5-haiku", "claude-3-5-haiku-latest", ModelProvider.ANTHROPIC),
    new LLMModel("[anthropic] claude-3.5-sonnet", "claude-3-5-sonnet-latest", ModelProvider.ANTHROPIC),
    new LLMModel("[anthropic] claude-3.7-sonnet", "claude-3-7-sonnet-latest", ModelProvider.ANTHROPIC),
    new LLMModel("[deepseek] deepseek-r1", "deepseek-reasoner", ModelProvider.DEEPSEEK),
    new LLMModel("[deepseek] deepseek-v3", "deepseek-chat", ModelProvider.DEEPSEEK),
    new LLMModel("[gemini] gemini-2.0-flash", "gemini-2.0-flash", ModelProvider.GEMINI),
    new LLMModel("[gemini] gemini-2.0-pro", "gemini-2.0-pro-exp-02-05", ModelProvider.GEMINI),
    new LLMModel("[groq] llama-3.3 70b", "llama-3.3-70b-versatile", ModelProvider.GROQ),
    new LLMModel("[openai] gpt-4.5", "gpt-4.5-preview", ModelProvider.OPENAI),
    new LLMModel("[openai] gpt-4o", "gpt-4o", ModelProvider.OPENAI),
    new LLMModel("[openai] o1", "o1", ModelProvider.OPENAI),
    new LLMModel("[openai] o3-mini", "o3-mini", ModelProvider.OPENAI)
];

const LLM_ORDER = AVAILABLE_MODELS.map(model => model.toChoiceTuple());

function getModelInfo(modelName) {
    return AVAILABLE_MODELS.find(model => model.model_name === modelName) || null;
}

function getModel(modelName, modelProvider) {
    const getEnvVar = (key) => process.env[key];
    
    const validateApiKey = (key, provider, envVar) => {
        if (!key) {
            console.error(`API Key Error: Please make sure ${envVar} is set in your .env file.`);
            throw new Error(`${provider} API key not found. Please make sure ${envVar} is set in your .env file.`);
        }
    };

    switch (modelProvider) {
        case ModelProvider.GROQ: {
            const apiKey = getEnvVar("GROQ_API_KEY");
            validateApiKey(apiKey, "Groq", "GROQ_API_KEY");
            return new ChatGroq({ model: modelName, apiKey });
        }
        case ModelProvider.OPENAI: {
            const apiKey = getEnvVar("OPENAI_API_KEY");
            validateApiKey(apiKey, "OpenAI", "OPENAI_API_KEY");
            return new ChatOpenAI({ model: modelName, apiKey });
        }
        case ModelProvider.ANTHROPIC: {
            const apiKey = getEnvVar("ANTHROPIC_API_KEY");
            validateApiKey(apiKey, "Anthropic", "ANTHROPIC_API_KEY");
            return new ChatAnthropic({ model: modelName, apiKey });
        }
        case ModelProvider.DEEPSEEK: {
            const apiKey = getEnvVar("DEEPSEEK_API_KEY");
            const baseURL = getEnvVar("DEEPSEEK_BASE_URL");
            validateApiKey(apiKey, "DeepSeek", "DEEPSEEK_API_KEY");
            return new ChatOpenAI({ model: modelName, apiKey, configuration: {
                baseURL: baseURL,
              }, });
        }
        case ModelProvider.GEMINI: {
            const apiKey = getEnvVar("GOOGLE_API_KEY");
            validateApiKey(apiKey, "Google", "GOOGLE_API_KEY");
            return new ChatGoogleGenerativeAI({ model: modelName, apiKey });
        }
        default:
            return null;
    }
}

export {
    ModelProvider,
    LLMModel,
    AVAILABLE_MODELS,
    LLM_ORDER,
    getModelInfo,
    getModel
};