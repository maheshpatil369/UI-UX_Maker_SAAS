import { OpenRouter } from "@openrouter/sdk";

export function createOpenRouterClient(apiKey: string) {
  return new OpenRouter({
    apiKey
  });
}

export function getAdminOpenRouter() {
  return new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
  });
}