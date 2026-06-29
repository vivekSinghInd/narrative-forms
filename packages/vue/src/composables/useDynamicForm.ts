import { ref, watch, unref } from "vue";
import type { Ref } from "vue";
import type { NarrativeFormConfig } from "@viveksinghind/narrative-form-core";
import { fetchFormConfig } from "@viveksinghind/narrative-form-core";

export interface UseDynamicFormProps {
  fieldsUrl?: string | Ref<string | undefined>;
  fieldsUrlHeaders?: Record<string, string> | Ref<Record<string, string> | undefined>;
  formConfig?: NarrativeFormConfig | Ref<NarrativeFormConfig | undefined>;
  onFetchError?: (error: Error) => void;
}

export function useDynamicForm(props: UseDynamicFormProps) {
  const config = ref<NarrativeFormConfig | null>(unref(props.formConfig) ?? null);
  const loading = ref<boolean>(!!unref(props.fieldsUrl) && !unref(props.formConfig));
  const error = ref<Error | null>(null);
  const retryCount = ref(0);

  watch(
    [
      () => unref(props.fieldsUrl),
      () => unref(props.fieldsUrlHeaders),
      () => unref(props.formConfig),
      retryCount
    ],
    async ([url, headers, providedConfig]) => {
      if (providedConfig) {
        config.value = providedConfig as NarrativeFormConfig;
        loading.value = false;
        error.value = null;
        return;
      }

      if (!url) {
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        const data = await fetchFormConfig(url as string, { headers: headers as Record<string, string> });
        config.value = data;
      } catch (err: unknown) {
        const e = err instanceof Error ? err : new Error(String(err));
        error.value = e;
        props.onFetchError?.(e);
      } finally {
        loading.value = false;
      }
    },
    { immediate: true }
  );

  const retry = () => {
    if (unref(props.fieldsUrl) && !unref(props.formConfig)) {
      retryCount.value++;
    }
  };

  return { config, loading, error, retry };
}
