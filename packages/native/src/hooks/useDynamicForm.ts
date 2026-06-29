import { useState, useEffect, useCallback } from "react";
import type { NarrativeFormConfig } from "@viveksinghind/narrative-form-core";
import { fetchFormConfig, ConfigFetchError } from "@viveksinghind/narrative-form-core";

export interface UseDynamicFormProps {
  fieldsUrl?: string;
  fieldsUrlHeaders?: Record<string, string>;
  formConfig?: NarrativeFormConfig;
  onFetchError?: (error: Error) => void;
}

export interface UseDynamicFormResult {
  config: NarrativeFormConfig | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * Hook to manage fetching and parsing server-driven form configuration.
 */
export function useDynamicForm({
  fieldsUrl,
  fieldsUrlHeaders,
  formConfig,
  onFetchError,
}: UseDynamicFormProps): UseDynamicFormResult {
  const [config, setConfig] = useState<NarrativeFormConfig | null>(formConfig ?? null);
  const [loading, setLoading] = useState<boolean>(!!fieldsUrl && !formConfig);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // If a complete config is passed via props, use it immediately
    if (formConfig) {
      setConfig(formConfig);
      setLoading(false);
      setError(null);
      return;
    }

    if (!fieldsUrl) {
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchFormConfig(fieldsUrl, { headers: fieldsUrlHeaders })
      .then((data) => {
        if (isMounted) {
          setConfig(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
          onFetchError?.(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fieldsUrl, fieldsUrlHeaders, formConfig, retryCount, onFetchError]);

  const retry = useCallback(() => {
    if (fieldsUrl && !formConfig) {
      setRetryCount((c) => c + 1);
    }
  }, [fieldsUrl, formConfig]);

  return { config, loading, error, retry };
}
