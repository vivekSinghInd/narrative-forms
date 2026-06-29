import { NarrativeFormConfig } from "../types";

export interface FetchConfigOptions {
  headers?: Record<string, string>;
}

export class ConfigFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigFetchError";
  }
}

export async function fetchFormConfig(
  url: string,
  options?: FetchConfigOptions
): Promise<NarrativeFormConfig> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ConfigFetchError(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Basic schema validation
    if (!data || typeof data !== "object") {
      throw new ConfigFetchError("Invalid response: expected a JSON object.");
    }

    if (!Array.isArray(data.fields)) {
      throw new ConfigFetchError("Invalid schema: 'fields' must be an array.");
    }
    
    return data as NarrativeFormConfig;
  } catch (error) {
    if (error instanceof ConfigFetchError) {
      throw error;
    }
    throw new ConfigFetchError(
      error instanceof Error ? error.message : "Failed to fetch form configuration"
    );
  }
}
