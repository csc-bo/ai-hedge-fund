export const LLM_ORDER = [
    { display: "GPT-4", value: "gpt-4" },
    { display: "GPT-3.5", value: "gpt-3.5" },
    { display: "BERT", value: "bert" },
];

export function getModelInfo(modelName) {
    const model = LLM_ORDER.find(m => m.value === modelName);
    return model ? { provider: { value: "OpenAI" }, ...model } : null;
}